import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { ZodError } from 'zod';

// Inline error handling (no external dependencies)
class APIError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

const setCommonHeaders = (res: VercelResponse) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
};

const errorHandler = (
  error: unknown,
  req: VercelRequest,
  res: VercelResponse
) => {
  console.error('API Error:', error);
  setCommonHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (error instanceof APIError) {
    return res.status(error.statusCode).json({
      status: 'error',
      error: {
        message: error.message,
        code: error.code,
      },
    });
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      status: 'error',
      error: {
        message: 'Validation error',
        code: 'VALIDATION_ERROR',
        details: error.errors,
      },
    });
  }

  return res.status(500).json({
    status: 'error',
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_ERROR',
    },
  });
};

const withErrorHandler = (
  handler: (req: VercelRequest, res: VercelResponse) => Promise<void>
) => {
  return async (req: VercelRequest, res: VercelResponse) => {
    try {
      setCommonHeaders(res);
      if (req.method === 'OPTIONS') {
        return res.status(204).end();
      }
      await handler(req, res);
    } catch (error) {
      errorHandler(error, req, res);
    }
  };
};

// Tier mapping from frontend to database tiers
const TIER_MAPPING = {
  'basic': 'Neighborhood Cellar',
  'premium': 'Neighborhood Cellar', // Map both basic and premium to Neighborhood Cellar for now
  'enterprise': 'World Class Club'
};

export default withErrorHandler(async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  // Create Supabase admin client directly in the API (no external dependencies)
  const supabaseAdmin = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  // Initialize Stripe client
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia',
    typescript: true,
  });

  if (req.method !== 'POST') {
    throw new APIError(405, 'Method not allowed', 'METHOD_NOT_ALLOWED');
  }

  const { token, membershipTier } = req.body;

  if (!token || !membershipTier) {
    throw new APIError(400, 'Token and membershipTier are required', 'VALIDATION_ERROR');
  }

  // Validate invite token
  const { data: invite, error: inviteError } = await supabaseAdmin
    .from('restaurant_invitations')
    .select('restaurant_name, email, tier, expires_at, status')
    .eq('token', token)
    .single();

  if (inviteError || !invite) {
    console.error('Error fetching invitation details:', inviteError);
    throw new APIError(404, 'Invalid or expired invitation token', 'NOT_FOUND');
  }

  // Check if token is expired
  if (new Date(invite.expires_at) < new Date()) {
    throw new APIError(400, 'This invitation has expired', 'VALIDATION_ERROR');
  }

  // Check if token is already used
  if (invite.status === 'completed') {
    throw new APIError(400, 'This invitation has already been used', 'VALIDATION_ERROR');
  }

  // Map frontend tier to database tier name
  const dbTierName = TIER_MAPPING[membershipTier as keyof typeof TIER_MAPPING];
  if (!dbTierName) {
    throw new APIError(400, 'Invalid membership tier', 'VALIDATION_ERROR');
  }

  // Get pricing tier details from database
  const { data: pricingTier, error: tierError } = await supabaseAdmin
    .from('business_pricing_tiers')
    .select('id, name, stripe_price_id, monthly_price_cents, is_custom')
    .eq('name', dbTierName)
    .eq('is_active', true)
    .single();

  if (tierError || !pricingTier) {
    console.error('Error fetching pricing tier:', tierError);
    throw new APIError(400, 'Invalid pricing tier selected', 'VALIDATION_ERROR');
  }

  if (pricingTier.is_custom || !pricingTier.stripe_price_id) {
    throw new APIError(400, 'Custom tiers require manual setup - please contact support', 'VALIDATION_ERROR');
  }

  // Create Stripe checkout session
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL || 'https://club-cuvee.com';
  
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: pricingTier.stripe_price_id,
          quantity: 1,
        },
      ],
      customer_email: invite.email,
      metadata: {
        restaurantName: invite.restaurant_name,
        membershipTier: dbTierName,
        invitationToken: token,
        pricingTierId: pricingTier.id,
      },
      success_url: `${baseUrl}/onboarding/${token}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/onboarding/${token}`,
    });

    // Mark invite as in progress and store session ID
    await supabaseAdmin
      .from('restaurant_invitations')
      .update({
        status: 'accepted',
        payment_session_id: session.id,
        updated_at: new Date().toISOString()
      })
      .eq('token', token);

    res.status(200).json({
      url: session.url,
    });
  } catch (err) {
    if (err instanceof Stripe.errors.StripeError) {
      throw new APIError(400, err.message, 'STRIPE_ERROR');
    }
    throw err;
  }
});