import { VercelRequest, VercelResponse } from '@vercel/node';
import { stripe } from './utils/stripe';
import { supabaseAdmin } from '../lib/supabaseAdmin';
import { withErrorHandler, APIError } from './utils/error-handler';

export default withErrorHandler(async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  if (req.method !== 'POST') {
    throw new APIError(405, 'Method not allowed', 'METHOD_NOT_ALLOWED');
  }

  const { token, tier_id } = req.body;

  if (!token) {
    throw new APIError(400, 'Token is required', 'VALIDATION_ERROR');
  }

  if (!tier_id) {
    throw new APIError(400, 'Pricing tier ID is required', 'VALIDATION_ERROR');
  }

  // Validate the business invitation token
  const { data: tokenValidation, error: validationError } = await supabaseAdmin.rpc('validate_business_invitation_token', {
    p_token: token
  });

  if (validationError || !tokenValidation || tokenValidation.length === 0) {
    throw new APIError(400, 'Invalid or expired business invitation token', 'VALIDATION_ERROR');
  }

  const tokenData = tokenValidation[0];
  if (!tokenData.is_valid) {
    throw new APIError(400, 'Business invitation token is not valid', 'VALIDATION_ERROR');
  }

  // Get pricing tier details from database
  const { data: tierData, error: tierError } = await supabaseAdmin.rpc('get_pricing_tier_details', {
    p_tier_id: tier_id
  });

  if (tierError || !tierData || tierData.length === 0) {
    throw new APIError(400, 'Invalid pricing tier selected', 'VALIDATION_ERROR');
  }

  const selectedTier = tierData[0];

  // Prevent custom tiers from using online checkout
  if (selectedTier.tier_key === 'custom') {
    throw new APIError(400, 'Custom tier requires manual setup. Please contact us directly.', 'VALIDATION_ERROR');
  }

  if (!selectedTier.stripe_price_id) {
    throw new APIError(400, 'Pricing tier is not configured for online checkout', 'VALIDATION_ERROR');
  }

  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers.host;
  const baseUrl = `${protocol}://${host}`;

  // Create Stripe checkout session
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: selectedTier.stripe_price_id,
        quantity: 1,
      },
    ],
    success_url: `${baseUrl}/onboard/${token}?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/onboard/${token}?canceled=true`,
    metadata: {
      business_invitation_token: token,
      pricing_tier_id: tier_id,
      pricing_tier_key: selectedTier.tier_key,
      type: 'business_onboarding'
    },
    subscription_data: {
      metadata: {
        business_invitation_token: token,
        pricing_tier_id: tier_id,
        pricing_tier_key: selectedTier.tier_key
      }
    }
  });

  res.status(200).json({
    success: true,
    data: {
      sessionId: session.id,
      checkoutUrl: session.url,
      tokenData: tokenData,
      selectedTier: selectedTier
    }
  });
});