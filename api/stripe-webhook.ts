// File: /api/stripe-webhook.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { Readable } from 'stream';

// For verifying Stripe signatures, we need the raw request body
async function readRawBody(readable: Readable) {
  const chunks: Buffer[] = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

// Initialize Stripe (no explicit apiVersion)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {});

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
        const session = event.data.object as Stripe.Checkout.Session;
        const { customer_id, restaurant_id } = session.metadata || {};

        if (!customer_id || !restaurant_id) {
          console.error('Missing metadata (customer_id or restaurant_id) in session');
          break;
        }

        // Update customer record in Supabase
        const { error: updateError } = await supabase
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
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const { customer_id } = subscription.metadata || {};
        if (!customer_id) {
          console.error('Missing customer_id in subscription metadata');
          break;
        }

        const { error: updateError } = await supabase
          .from('customers')
          .update({
            subscription_status: subscription.status,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id);

        if (updateError) {
          console.error('Error updating subscription status:', updateError);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const { customer_id } = subscription.metadata || {};
        if (!customer_id) {
          console.error('Missing customer_id in subscription metadata');
          break;
        }

        const canceledAt = subscription.canceled_at
          ? new Date(subscription.canceled_at * 1000).toISOString()
          : new Date().toISOString();

        const { error: updateError } = await supabase
          .from('customers')
          .update({
            subscription_status: 'canceled',
            subscription_end_date: canceledAt,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id);

        if (updateError) {
          console.error('Error updating subscription cancellation:', updateError);
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          // Record payment in your "subscription_payments" table (optional)
          const { error } = await supabase
            .from('subscription_payments')
            .insert([
              {
                stripe_invoice_id: invoice.id,
                stripe_subscription_id: invoice.subscription,
                stripe_customer_id: invoice.customer,
                amount: invoice.amount_paid / 100, // from cents
                currency: invoice.currency,
                status: invoice.status,
                payment_date: new Date(invoice.created * 1000).toISOString(),
                created_at: new Date().toISOString(),
              },
            ]);

          if (error) {
            console.error('Error recording subscription payment:', error);
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        if (!invoice.subscription) break;

        // Find the matching customer by subscription
        const { data: foundCustomer, error: custError } = await supabase
          .from('customers')
          .select('id, email')
          .eq('stripe_subscription_id', invoice.subscription)
          .maybeSingle();

        if (custError) {
          console.error('Error finding customer for failed payment:', custError);
          break;
        }
        if (!foundCustomer) {
          console.error('No matching customer found for failed payment');
          break;
        }

        // Mark subscription as past_due
        const { error: updateError } = await supabase
          .from('customers')
          .update({
            subscription_status: 'past_due',
            updated_at: new Date().toISOString(),
          })
          .eq('id', foundCustomer.id);

        if (updateError) {
          console.error('Error updating customer subscription status:', updateError);
        }

        // Optionally, send an email to the customer about the failed payment
        break;
      }

      default:
        // Unexpected event type
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Acknowledge receipt of the event
    return res.json({ received: true });
  } catch (error: any) {
    console.error('Error handling Stripe webhook:', error);
    return res.status(500).json({ error: error.message });
  }
}
