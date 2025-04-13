import Stripe from 'stripe';

// Initialize Stripe for server-side operations
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {});
