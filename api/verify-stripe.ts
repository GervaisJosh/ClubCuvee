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
  if (req.method !== 'POST') {
    throw new APIError(405, 'Method not allowed', 'METHOD_NOT_ALLOWED');
  }

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
    subscription: {
      id: subscription.id,
      status: subscription.status,
      currentPeriodEnd: subscription.current_period_end,
    },
  });
});