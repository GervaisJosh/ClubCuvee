import Stripe from 'stripe';
import { APIError } from './error-handler';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is required');
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error('STRIPE_WEBHOOK_SECRET is required');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-06-30.basil',
  typescript: true,
});

export const verifyStripeWebhook = (signature: string, payload: string) => {
  try {
    return stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    throw new APIError(400, 'Invalid webhook signature', 'INVALID_SIGNATURE');
  }
};

export const createCheckoutSession = async (data: {
  restaurantName: string;
  email: string;
  membershipTier: string;
  successUrl: string;
  cancelUrl: string;
}) => {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env[`STRIPE_PRICE_ID_${data.membershipTier.toUpperCase()}`],
          quantity: 1,
        },
      ],
      customer_email: data.email,
      metadata: {
        restaurantName: data.restaurantName,
        membershipTier: data.membershipTier,
      },
      success_url: data.successUrl,
      cancel_url: data.cancelUrl,
    });

    return session;
  } catch (err) {
    if (err instanceof Stripe.errors.StripeError) {
      throw new APIError(400, err.message, 'STRIPE_ERROR');
    }
    throw err;
  }
};

export const getSubscription = async (subscriptionId: string) => {
  try {
    return await stripe.subscriptions.retrieve(subscriptionId);
  } catch (err) {
    if (err instanceof Stripe.errors.StripeError) {
      throw new APIError(400, err.message, 'STRIPE_ERROR');
    }
    throw err;
  }
}; 