// File: /api/stripe-webhook.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import { withErrorHandler } from './utils/error-handler';
import { verifyStripeWebhook, getSubscription } from './utils/stripe';
import { createRestaurant, updateRestaurantInvite } from './utils/supabase';
import { supabaseAdmin } from '../lib/supabaseAdmin';
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
      
      // Handle business onboarding checkout
      if (session.metadata?.type === 'business_onboarding') {
        if (!session.subscription || !session.metadata?.business_invitation_token) {
          throw new APIError(400, 'Invalid business onboarding session data', 'INVALID_SESSION');
        }

        // Get subscription details
        const subscription = await getSubscription(session.subscription as string);

        // Get the business invitation details to create the business
        const { data: inviteData, error: inviteError } = await supabaseAdmin.rpc('validate_business_invitation_token', {
          p_token: session.metadata.business_invitation_token
        });

        if (inviteError || !inviteData || inviteData.length === 0) {
          throw new APIError(400, 'Invalid business invitation token', 'INVALID_TOKEN');
        }

        const businessData = inviteData[0];

        // Create business record
        await createRestaurant({
          name: businessData.business_name,
          email: businessData.business_email,
          subscription_id: subscription.id,
          membership_tier: session.metadata.pricing_tier_key,
        });

        // Mark business invitation as used
        const { error: markUsedError } = await supabaseAdmin.rpc('mark_business_invitation_used', {
          p_token: session.metadata.business_invitation_token
        });

        if (markUsedError) {
          console.error('Error marking business invitation as used:', markUsedError);
        }
      } 
      // Handle legacy restaurant invitations (backward compatibility)
      else if (session.metadata?.restaurantName) {
        if (!session.subscription) {
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
      } 
      // Handle customer membership signup
      else if (session.metadata?.type === 'customer_membership') {
        if (!session.subscription || !session.metadata?.business_id || !session.metadata?.tier_id) {
          throw new APIError(400, 'Invalid customer membership session data', 'INVALID_SESSION');
        }

        // Get subscription details
        const subscription = await getSubscription(session.subscription as string);

        // Create customer membership record
        const { error: membershipError } = await supabaseAdmin
          .from('customer_memberships')
          .insert({
            customer_email: session.metadata.customer_email,
            customer_name: session.metadata.customer_name || null,
            business_id: session.metadata.business_id,
            tier_id: session.metadata.tier_id,
            stripe_customer_id: subscription.customer as string,
            stripe_subscription_id: subscription.id,
            status: 'active',
            started_at: new Date().toISOString()
          });

        if (membershipError) {
          console.error('Error creating customer membership:', membershipError);
          throw new APIError(500, 'Failed to create customer membership', 'MEMBERSHIP_CREATION_FAILED');
        }
      } else {
        throw new APIError(400, 'Unknown checkout session type', 'INVALID_SESSION');
      }

      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.status(200).json({ received: true });
});
