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
      const response = await fetch('/api/payments/record', {
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
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to record payment');
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
      const response = await fetch('/api/verify-stripe', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json() as { error?: string };
        throw new Error(errorData.error || 'Failed to verify Stripe configuration');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('Error verifying Stripe:', error);
      
      return {
        status: 'error',
        error: error.message || 'Failed to verify Stripe configuration',
        type: error.type || 'VERIFICATION_ERROR',
        details: error.details || error
      };
    }
  }
};
