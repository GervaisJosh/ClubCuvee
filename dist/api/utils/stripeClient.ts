import Stripe from 'stripe';

// Check if the Stripe secret key is configured
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error('STRIPE_SECRET_KEY is not configured in environment variables');
}

// Initialize Stripe for server-side operations with proper configuration
export const stripe = new Stripe(stripeSecretKey || 'invalid_key', {
  apiVersion: '2025-02-24.acacia', // Using latest API version
  maxNetworkRetries: 3, // Retry on network failures for better reliability
});