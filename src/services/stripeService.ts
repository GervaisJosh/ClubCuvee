import { loadStripe } from '@stripe/stripe-js';
import type { CheckoutSessionData } from '../types';

// Initialize Stripe with the public key
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePromise = loadStripe(stripePublicKey);

export const stripeService = {
  async createCheckoutSession(data: CheckoutSessionData): Promise<string> {
    try {
      // Make sure to include metadata about the type of checkout
      const finalData = {
        ...data,
        metadata: {
          ...(data.metadata || {}),
          type: data.type || 'customer_subscription'
        }
      };
      
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to create checkout session');
      return result.id;
    } catch (error: any) {
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
  async recordPayment(sessionId: string, data: {
    tier: string;
    amount: number;
    restaurantId?: string;
    customerEmail?: string;
  }): Promise<void> {
    try {
      const { error } = await fetch('/api/payments/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stripe_session_id: sessionId,
          tier: data.tier,
          amount: data.amount,
          restaurant_id: data.restaurantId,
          customer_email: data.customerEmail
        }),
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error recording payment:', error);
      // Don't throw, as this is non-critical
    }
  },
  
  // Verify Stripe configuration
  async verifyStripeSetup(): Promise<{
    status: string;
    livemode?: boolean;
    config?: Record<string, string>;
    balance?: any;
    error?: string;
    type?: string;
    details?: any;
  }> {
    try {
      // Use our centralized API request handler
      const { apiRequest, isApiError } = await import('./apiErrorHandler');
      const result = await apiRequest('/api/verify-stripe', {
        method: 'GET'
      });
      
      return result;
    } catch (error: any) {
      console.error('Error verifying Stripe:', error);
      
      // Format the error consistently
      if (error.name === 'ApiError') {
        return {
          status: 'error',
          error: error.message,
          type: error.type,
          details: error.data
        };
      }
      
      // Fallback for other types of errors
      return {
        status: 'error',
        error: error.message || 'Failed to verify Stripe configuration'
      };
    }
  }
};
