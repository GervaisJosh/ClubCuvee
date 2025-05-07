import Stripe from 'stripe';
import { handleStripeError } from '@/lib/utils/errorHandler';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-08-16',
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
      const idempotencyKey = crypto.randomUUID();
      return await stripe.checkout.sessions.create(data, {
        idempotencyKey
      });
    } catch (error) {
      throw handleStripeError(error);
    }
  },

  createCustomer: async (data: Stripe.CustomerCreateParams) => {
    try {
      const idempotencyKey = crypto.randomUUID();
      return await stripe.customers.create(data, {
        idempotencyKey
      });
    } catch (error) {
      throw handleStripeError(error);
    }
  },

  createSubscription: async (data: Stripe.SubscriptionCreateParams) => {
    try {
      const idempotencyKey = crypto.randomUUID();
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