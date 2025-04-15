import Stripe from 'stripe';

// Initialize Stripe for server-side operations with proper configuration
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16', // Using a specific API version for stability
  maxNetworkRetries: 3, // Retry on network failures for better reliability
});