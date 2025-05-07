// File: /api/stripe-webhook.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import { withErrorHandler } from './utils/error-handler';
import { verifyStripeWebhook, getSubscription } from './utils/stripe';
import { createRestaurant, updateRestaurantInvite } from './utils/supabase';
import { APIError } from './utils/error-handler';
import Stripe from 'stripe';

/**
 * Stripe webhook endpoint - all logic is now contained in the modular webhookHandler
 * This provides a clean entry point for the Vercel serverless function
 * Uses the withErrorHandling wrapper for consistent error responses
 */
export default withErrorHandler(async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  if (req.method !== 'POST') {
    throw new APIError(405, 'Method not allowed', 'METHOD_NOT_ALLOWED');
  }

  const signature = req.headers['stripe-signature'];
  if (!signature || typeof signature !== 'string') {
    throw new APIError(400, 'Missing stripe-signature header', 'MISSING_SIGNATURE');
  }

  // Verify webhook signature
  const event = verifyStripeWebhook(signature, req.body);

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      
      if (!session.subscription || !session.metadata?.restaurantName) {
        throw new APIError(400, 'Invalid session data', 'INVALID_SESSION');
      }

      // Get subscription details
      const subscription = await getSubscription(session.subscription as string);

      // Create restaurant record
      await createRestaurant({
        name: session.metadata.restaurantName,
        email: session.customer_email!,
        subscription_id: subscription.id,
        membership_tier: session.metadata.membershipTier,
      });

      // Mark invite as accepted
      if (session.metadata.inviteToken) {
        await updateRestaurantInvite(session.metadata.inviteToken, {
          status: 'accepted',
          accepted_at: new Date().toISOString(),
        });
      }

      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.status(200).json({ received: true });
});
