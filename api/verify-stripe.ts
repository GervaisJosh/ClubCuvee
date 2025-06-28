import { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { withErrorHandler } from './utils/error-handler';
import { getSubscription } from './utils/stripe';
import { getRestaurantInvite } from './utils/supabase';
import { APIError } from './utils/error-handler';

const verifyStripeSchema = z.object({
  token: z.string().uuid(),
  sessionId: z.string(),
});

/**
 * API endpoint for verifying Stripe configuration
 * Tests connectivity to Stripe API and verifies environment variables
 * Production-ready with comprehensive error handling
 */
export default withErrorHandler(async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  // Handle GET requests for basic Stripe configuration check
  if (req.method === 'GET') {
    try {
      // Check if Stripe is configured
      const isConfigured = !!process.env.STRIPE_SECRET_KEY;
      
      res.status(200).json({
        status: 'success',
        data: {
          isConfigured,
          message: isConfigured ? 'Stripe is configured' : 'Stripe is not configured'
        }
      });
      return;
    } catch (error) {
      throw new APIError(500, 'Failed to verify Stripe configuration', 'STRIPE_ERROR');
    }
  }

  // Handle POST requests for subscription verification
  if (req.method === 'POST') {
    try {
      const { token, sessionId } = verifyStripeSchema.parse(req.body);

      // Verify invite exists
      await getRestaurantInvite(token);

      // Verify subscription status
      const subscription = await getSubscription(sessionId);

      if (subscription.status !== 'active') {
        throw new APIError(400, 'Subscription is not active', 'INVALID_SUBSCRIPTION');
      }

      res.status(200).json({
        status: 'success',
        data: {
          subscription: {
            id: subscription.id,
            status: subscription.status,
            currentPeriodEnd: subscription.current_period_end,
          }
        }
      });
      return;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new APIError(400, 'Invalid request data', 'VALIDATION_ERROR');
      }
      throw error;
    }
  }

  throw new APIError(405, 'Method not allowed', 'METHOD_NOT_ALLOWED');
});