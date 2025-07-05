import { stripe } from '../utils/stripeClient';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Readable } from 'stream';
import Stripe from 'stripe';
import { sendErrorResponse, AppError } from '../utils/errorHandler';

// For verifying Stripe signatures, we need the raw request body
async function readRawBody(readable: Readable) {
  const chunks: Buffer[] = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

// Rate limiting configuration
interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

const RATE_LIMITS: Record<string, RateLimitConfig> = {
  default: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100
  },
  'checkout.session.completed': {
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxRequests: 50
  },
  'customer.subscription.updated': {
    windowMs: 5 * 60 * 1000,
    maxRequests: 50
  }
};

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const requestCounts = new Map<string, RateLimitEntry>();

function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [key, entry] of requestCounts.entries()) {
    if (now > entry.resetTime) {
      requestCounts.delete(key);
    }
  }
}

function isRateLimited(ip: string, eventType: string): boolean {
  cleanupExpiredEntries();
  
  const config = RATE_LIMITS[eventType] || RATE_LIMITS.default;
  const key = `${ip}:${eventType}`;
  const now = Date.now();
  
  const entry = requestCounts.get(key);
  if (!entry) {
    requestCounts.set(key, {
      count: 1,
      resetTime: now + config.windowMs
    });
    return false;
  }
  
  if (now > entry.resetTime) {
    requestCounts.set(key, {
      count: 1,
      resetTime: now + config.windowMs
    });
    return false;
  }
  
  if (entry.count >= config.maxRequests) {
    return true;
  }
  
  entry.count++;
  return false;
}

/**
 * Handle Stripe webhook events
 */
export async function handleWebhook(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      throw new AppError(405, 'Method not allowed');
    }

    // Apply rate limiting
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (typeof ip === 'string' && isRateLimited(ip, 'default')) {
      throw new AppError(429, 'Too many requests');
    }

    // 1. Read raw body
    const rawBody = await readRawBody(req);
    const signature = req.headers['stripe-signature'] as string;

    // 2. Construct event with Stripe
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('Missing STRIPE_WEBHOOK_SECRET environment variable');
    }
    
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret
    );

    // Apply event-specific rate limiting after verifying the event
    if (typeof ip === 'string' && isRateLimited(ip, event.type)) {
      throw new AppError(429, 'Too many requests for this event type');
    }

    // 3. Handle the event
    console.log(`Processing webhook event: ${event.type}`);
    
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
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Acknowledge receipt of the event
    return res.status(200).json({ received: true });
  } catch (error) {
    return sendErrorResponse(res, error instanceof Error ? error : new Error(String(error)));
  }
}

/**
 * Handle checkout.session.completed event
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  if (!session.metadata?.customer_id || !session.metadata?.restaurant_id) {
    throw new AppError(400, 'Missing required metadata in session');
  }

  try {
    // Start a Supabase transaction
    const { data: customer, error: customerError } = await supabaseAdmin
      .from('customers')
      .select('*')
      .eq('id', session.metadata.customer_id)
      .single();

    if (customerError) throw customerError;
    if (!customer) throw new AppError(404, 'Customer not found');

    // Update customer with Stripe data
    const { error: updateError } = await supabaseAdmin
      .from('customers')
      .update({
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: session.subscription as string,
        subscription_status: 'active',
        updated_at: new Date().toISOString()
      })
      .eq('id', session.metadata.customer_id);

    if (updateError) throw updateError;

    // Update restaurant status
    const { error: restaurantError } = await supabaseAdmin
      .from('restaurants')
      .update({
        status: 'active',
        updated_at: new Date().toISOString()
      })
      .eq('id', session.metadata.restaurant_id);

    if (restaurantError) throw restaurantError;

  } catch (error) {
    console.error('Error processing checkout completed:', error);
    throw error;
  }
}

/**
 * Handle customer.subscription.updated event
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const { customer_id } = subscription.metadata || {};
  
  if (!customer_id) {
    // Try to get metadata from the Stripe customer
    const customerId = subscription.customer as string;
    try {
      const customer = await stripe.customers.retrieve(customerId);
      const metadata = (customer as Stripe.Customer).metadata;
      
      if (metadata.customer_id) {
        await updateSubscriptionByCustomerId(metadata.customer_id, subscription);
        return;
      }
    } catch (err) {
      console.error('Error fetching Stripe customer:', err);
    }
    
    console.error('Missing customer_id in subscription metadata');
    return;
  }

  await updateSubscriptionByCustomerId(customer_id, subscription);
}

/**
 * Update subscription status by customer ID
 */
async function updateSubscriptionByCustomerId(customerId: string, subscription: Stripe.Subscription) {
  // First try updating by subscription ID
  const { error: subIdError, count } = await supabaseAdmin
    .from('customers')
    .update({
      subscription_status: subscription.status,
      current_period_end: subscription.current_period_end 
        ? new Date(subscription.current_period_end * 1000).toISOString() 
        : null,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id)
    .select('count');

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
        current_period_end: subscription.current_period_end 
          ? new Date(subscription.current_period_end * 1000).toISOString() 
          : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', customerId);

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
    // Try to get metadata from the Stripe customer
    const customerId = subscription.customer as string;
    try {
      const customer = await stripe.customers.retrieve(customerId);
      const metadata = (customer as Stripe.Customer).metadata;
      
      if (metadata.customer_id) {
        await updateSubscriptionCancellation(metadata.customer_id, subscription);
        return;
      }
    } catch (err) {
      console.error('Error fetching Stripe customer:', err);
    }
    
    console.error('Missing customer_id in subscription metadata');
    return;
  }

  await updateSubscriptionCancellation(customer_id, subscription);
}

/**
 * Update subscription cancellation by customer ID
 */
async function updateSubscriptionCancellation(_customerId: string, subscription: Stripe.Subscription) {
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
  } catch (error) {
    console.error('Error processing payment failed event:', error);
    // Don't throw to avoid webhook failure
  }
}

export default handleWebhook;