import { VercelRequest, VercelResponse } from '@vercel/node';
import { withErrorHandler } from './utils/error-handler';
import { stripe } from './utils/stripe';
import { APIError } from './utils/error-handler';

/**
 * API endpoint for verifying Stripe configuration
 * Tests connectivity to Stripe API and verifies environment variables
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Ensure JSON responses
  res.setHeader('Content-Type', 'application/json');

  try {
    if (req.method !== 'GET') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    // First, validate that we have the necessary environment variables
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    
    if (!stripeSecretKey) {
      res.status(500).json({
        error: 'Missing Stripe configuration',
        type: 'CONFIGURATION_ERROR',
        config: {
          STRIPE_SECRET_KEY: 'missing',
          STRIPE_WEBHOOK_SECRET: !!process.env.STRIPE_WEBHOOK_SECRET ? 'configured' : 'missing',
          VITE_STRIPE_PUBLIC_KEY: !!(process.env.VITE_STRIPE_PUBLIC_KEY || process.env.STRIPE_PUBLIC_KEY) ? 'configured' : 'missing',
        }
      });
      return;
    }
    
    // Verify we can connect to Stripe API
    const balance = await stripe.balance.retrieve();
    
    // Check for required environment variables
    const configStatus = {
      STRIPE_SECRET_KEY: 'configured',
      STRIPE_WEBHOOK_SECRET: !!process.env.STRIPE_WEBHOOK_SECRET ? 'configured' : 'missing',
      VITE_STRIPE_PUBLIC_KEY: !!(process.env.VITE_STRIPE_PUBLIC_KEY || process.env.STRIPE_PUBLIC_KEY) ? 'configured' : 'missing',
    };
    
    res.status(200).json({
      status: 'success',
      message: 'Stripe API connection successful',
      livemode: balance.livemode,
      config: configStatus,
      balance: {
        available: balance.available.map(b => ({ 
          amount: (b.amount / 100).toFixed(2),
          currency: b.currency 
        })),
        pending: balance.pending.map(b => ({ 
          amount: (b.amount / 100).toFixed(2),
          currency: b.currency 
        })),
      }
    });
  } catch (error: any) {
    // Handle Stripe-specific errors
    if (error.type?.startsWith('Stripe')) {
      res.status(error.statusCode || 500).json({
        error: error.message,
        type: 'STRIPE_ERROR',
        details: error
      });
      return;
    }
    
    // Handle other errors
    res.status(500).json({
      error: error.message || 'Failed to verify Stripe configuration',
      type: 'VERIFICATION_ERROR',
      details: error
    });
  }
}