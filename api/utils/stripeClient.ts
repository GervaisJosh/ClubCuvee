import Stripe from 'stripe';
import { randomUUID } from 'crypto';

// Inline error handler for Stripe errors
function handleStripeError(error: any): Error {
  if (error instanceof Stripe.errors.StripeError) {
    console.error('Stripe API Error:', error);
    return new Error(`Stripe error: ${error.message}`);
  }
  return error instanceof Error ? error : new Error(String(error));
}

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  console.error('STRIPE_SECRET_KEY is not configured in environment variables');
}

export const stripe = new Stripe(stripeSecretKey || 'invalid_key', {
  apiVersion: '2025-02-24.acacia',
  maxNetworkRetries: 3,
  typescript: true,
  appInfo: {
    name: 'Club Cuvee',
    version: '1.0.0'
  }
});

// Wrapper for Stripe API calls with error handling
export const stripeApi = {
  createCheckoutSession: async (data: Stripe.Checkout.SessionCreateParams) => {
    try {
      const idempotencyKey = randomUUID();
      return await stripe.checkout.sessions.create(data, {
        idempotencyKey
      });
    } catch (error) {
      throw handleStripeError(error);
    }
  },

  createCustomer: async (data: Stripe.CustomerCreateParams) => {
    try {
      const idempotencyKey = randomUUID();
      return await stripe.customers.create(data, {
        idempotencyKey
      });
    } catch (error) {
      throw handleStripeError(error);
    }
  },

  createSubscription: async (data: Stripe.SubscriptionCreateParams) => {
    try {
      const idempotencyKey = randomUUID();
      return await stripe.subscriptions.create(data, {
        idempotencyKey
      });
    } catch (error) {
      throw handleStripeError(error);
    }
  },

  constructEvent: async (payload: string | Buffer, signature: string, secret: string) => {
    try {
      return stripe.webhooks.constructEvent(payload, signature, secret);
    } catch (error) {
      throw handleStripeError(error);
    }
  }
};