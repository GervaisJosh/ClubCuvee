import { stripe } from '../utils/stripeClient';
import { supabaseAdmin } from '../utils/supabaseAdmin';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Readable } from 'stream';
import Stripe from 'stripe';

// For verifying Stripe signatures, we need the raw request body
async function readRawBody(readable: Readable) {
  const chunks: Buffer[] = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

/**
 * Handle Stripe webhook events
 */
export async function handleWebhook(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let event: Stripe.Event;
  try {
    // 1. Read raw body
    const rawBody = await readRawBody(req);
    const signature = req.headers['stripe-signature'] as string;

    // 2. Construct event with Stripe
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    console.error('❌ Error verifying Stripe webhook signature:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 3. Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      }

      case 'customer.subscription.updated': {
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      }

      case 'invoice.payment_failed': {
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      }

      default:
        // Unexpected event type
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Acknowledge receipt of the event
    return res.status(200).json({ received: true });
  } catch (error: any) {
    console.error('Error handling Stripe webhook:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/** 
 * Handle checkout.session.completed event 
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  // Extract metadata
  const { customer_id, restaurant_id } = session.metadata || {};

  if (!customer_id || !restaurant_id) {
    console.error('Missing metadata (customer_id or restaurant_id) in session');
    return;
  }

  // Update customer record in Supabase
  const { error: updateError } = await supabaseAdmin
    .from('customers')
    .update({
      stripe_customer_id: session.customer,
      stripe_subscription_id: session.subscription,
      subscription_status: 'active',
      updated_at: new Date().toISOString(),
    })
    .eq('id', customer_id);

  if (updateError) {
    console.error('Error updating customer after checkout:', updateError);
    throw updateError;
  }
}

/**
 * Handle customer.subscription.updated event
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const { customer_id } = subscription.metadata || {};
  
  if (!customer_id) {
    console.error('Missing customer_id in subscription metadata');
    return;
  }

  // First try updating by subscription ID
  const { error: subIdError, count } = await supabaseAdmin
    .from('customers')
    .update({
      subscription_status: subscription.status,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id)
    .select('count', { count: 'exact', head: true });

  if (subIdError) {
    console.error('Error updating subscription by ID:', subIdError);
  }

  // If no records updated by subscription ID, try by customer_id from metadata
  if (!count) {
    const { error: custIdError } = await supabaseAdmin
      .from('customers')
      .update({
        stripe_subscription_id: subscription.id,
        subscription_status: subscription.status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', customer_id);

    if (custIdError) {
      console.error('Error updating subscription by customer ID:', custIdError);
      throw custIdError;
    }
  }
}

/**
 * Handle customer.subscription.deleted event
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const { customer_id } = subscription.metadata || {};
  
  if (!customer_id) {
    console.error('Missing customer_id in subscription metadata');
    return;
  }

  const canceledAt = subscription.canceled_at
    ? new Date(subscription.canceled_at * 1000).toISOString()
    : new Date().toISOString();

  const { error: updateError } = await supabaseAdmin
    .from('customers')
    .update({
      subscription_status: 'canceled',
      subscription_end_date: canceledAt,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);

  if (updateError) {
    console.error('Error updating subscription cancellation:', updateError);
    throw updateError;
  }
}

/**
 * Handle invoice.payment_succeeded event
 */
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  if (!invoice.subscription) return;

  try {
    // Record payment in your "subscription_payments" table
    const { error } = await supabaseAdmin
      .from('subscription_payments')
      .insert([{
        stripe_invoice_id: invoice.id,
        stripe_subscription_id: invoice.subscription,
        stripe_customer_id: invoice.customer,
        amount: invoice.amount_paid / 100, // from cents
        currency: invoice.currency,
        status: invoice.status,
        payment_date: new Date(invoice.created * 1000).toISOString(),
        created_at: new Date().toISOString(),
      }]);

    if (error) {
      console.error('Error recording subscription payment:', error);
      // Don't throw, as this is non-critical
    }
  } catch (error) {
    console.error('Error processing payment succeeded event:', error);
    // Don't throw to avoid webhook failure
  }
}

/**
 * Handle invoice.payment_failed event
 */
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  if (!invoice.subscription) return;

  try {
    // Find the matching customer by subscription
    const { data: foundCustomer, error: custError } = await supabaseAdmin
      .from('customers')
      .select('id, email')
      .eq('stripe_subscription_id', invoice.subscription)
      .maybeSingle();

    if (custError) {
      console.error('Error finding customer for failed payment:', custError);
      return;
    }
    
    if (!foundCustomer) {
      console.error('No matching customer found for failed payment');
      return;
    }

    // Mark subscription as past_due
    const { error: updateError } = await supabaseAdmin
      .from('customers')
      .update({
        subscription_status: 'past_due',
        updated_at: new Date().toISOString(),
      })
      .eq('id', foundCustomer.id);

    if (updateError) {
      console.error('Error updating customer subscription status:', updateError);
      throw updateError;
    }

    // Optionally, send an email to the customer about the failed payment
    // if (foundCustomer.email) {
    //   await sendFailedPaymentEmail(foundCustomer.email, {
    //     amount: invoice.amount_due / 100,
    //     currency: invoice.currency
    //   });
    // }
  } catch (error) {
    console.error('Error processing payment failed event:', error);
    // Don't throw to avoid webhook failure
  }
}

export default handleWebhook;
