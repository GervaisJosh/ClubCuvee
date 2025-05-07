import { VercelRequest, VercelResponse } from '@vercel/node';
import { withErrorHandler } from './utils/error-handler';
import { stripe } from './utils/stripe';
import { APIError } from './utils/error-handler';

/**
 * API endpoint for verifying Stripe configuration
 * Tests connectivity to Stripe API and verifies environment variables
 */
export default withErrorHandler(async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  if (req.method !== 'GET') {
    throw new APIError(405, 'Method not allowed', 'METHOD_NOT_ALLOWED');
  }

  try {
    // First, validate that we have the necessary environment variables
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    
    if (!stripeSecretKey) {
      const configError = new APIError(500, 'Missing Stripe configuration', 'CONFIGURATION_ERROR');
      (configError as any).config = {
        STRIPE_SECRET_KEY: 'missing',
        STRIPE_WEBHOOK_SECRET: !!process.env.STRIPE_WEBHOOK_SECRET ? 'configured' : 'missing',
        VITE_STRIPE_PUBLIC_KEY: !!(process.env.VITE_STRIPE_PUBLIC_KEY || process.env.STRIPE_PUBLIC_KEY) ? 'configured' : 'missing',
      };
      throw configError;
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
      const stripeError = new APIError(
        error.statusCode || 500,
        error.message,
        'STRIPE_ERROR'
      );
      (stripeError as any).stripeError = error;
      throw stripeError;
    }
    
    // Handle other errors
    const verificationError = new APIError(
      500,
      error.message || 'Failed to verify Stripe configuration',
      'VERIFICATION_ERROR'
    );
    (verificationError as any).originalError = error;
    throw verificationError;
  }
});