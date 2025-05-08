import { loadStripe } from '@stripe/stripe-js';
import { apiClient } from '../lib/api-client';
import type { CheckoutSessionData, PaymentRecord } from '../types';

// Validate required environment variables
const requiredEnvVars = {
  VITE_STRIPE_PUBLIC_KEY: import.meta.env.VITE_STRIPE_PUBLIC_KEY,
};

Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

// Initialize Stripe with the public key
const stripePromise = loadStripe(requiredEnvVars.VITE_STRIPE_PUBLIC_KEY);

export const stripeService = {
  async createCheckoutSession(data: CheckoutSessionData): Promise<string> {
    try {
      const response = await apiClient.post<{ url: string }>('/api/create-checkout-session', data);
      return response.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  },
  
  async redirectToCheckout(sessionId: string): Promise<void> {
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Failed to load Stripe');
      
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) throw new Error(error.message || 'Redirect to checkout failed');
    } catch (error: any) {
      console.error('Error redirecting to checkout:', error);
      throw error;
    }
  },
  
  async verifyPaymentSession(sessionId: string): Promise<boolean> {
    if (!sessionId) return false;
    
    try {
      // You can add additional verification here if needed
      // For example, a call to your backend to verify the session
      // is valid and belongs to the expected customer
      
      // For simplicity, we're just checking the session ID exists
      // In production, you would validate this against Stripe
      return true;
    } catch (error) {
      console.error('Error verifying payment session:', error);
      return false;
    }
  },
  
  // Optional helper if you want to track payments in your own DB
  async recordPayment(data: PaymentRecord): Promise<void> {
    try {
      await apiClient.post('/api/record-payment', data);
    } catch (error) {
      console.error('Error recording payment:', error);
      throw error;
    }
  },
  
  // Verify Stripe configuration
  async verifyStripeSetup(): Promise<{
    isConfigured: boolean;
    accountId?: string;
    details?: any;
  }> {
    try {
      const response = await apiClient.get<{
        isConfigured: boolean;
        accountId?: string;
        details?: any;
      }>('/api/verify-stripe');
      return response;
    } catch (error) {
      console.error('Error verifying Stripe setup:', error);
      throw error;
    }
  }
};
