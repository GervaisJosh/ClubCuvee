import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

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

interface CreateCustomerCheckoutRequest {
  business_id: string;
  tier_id: string;
  customer_email: string;
  customer_name?: string;
}

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

  const body: CreateCustomerCheckoutRequest = req.body;
  const { business_id, tier_id, customer_email, customer_name } = body;

  // Validate required fields
  if (!business_id || !tier_id || !customer_email) {
    throw new APIError(400, 'Missing required fields: business_id, tier_id, customer_email', 'MISSING_FIELDS');
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(customer_email)) {
    throw new APIError(400, 'Invalid email format', 'INVALID_EMAIL');
  }

  // Get the business and tier details
  const { data: business, error: businessError } = await supabaseAdmin
    .from('businesses')
    .select('id, name')
    .eq('id', business_id)
    .single();

  if (businessError || !business) {
    throw new APIError(404, 'Business not found', 'BUSINESS_NOT_FOUND');
  }

  // Get the membership tier details
  const { data: tier, error: tierError } = await supabaseAdmin
    .from('membership_tiers')
    .select('*')
    .eq('id', tier_id)
    .eq('business_id', business_id)
    .eq('is_active', true)
    .single();

  if (tierError || !tier) {
    throw new APIError(404, 'Membership tier not found or not ready for signup', 'TIER_NOT_FOUND');
  }

  if (!tier.stripe_price_id) {
    throw new APIError(400, 'Membership tier is not configured for online signup', 'TIER_NOT_CONFIGURED');
  }

  // Create Stripe checkout session
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: customer_email,
    line_items: [
      {
        price: tier.stripe_price_id,
        quantity: 1,
      },
    ],
    success_url: `${process.env.VITE_APP_URL || 'http://localhost:3000'}/join/${business_id}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.VITE_APP_URL || 'http://localhost:3000'}/join/${business_id}?canceled=true`,
    metadata: {
      business_id: business_id,
      tier_id: tier_id,
      customer_email: customer_email,
      customer_name: customer_name || '',
      type: 'customer_membership'
    },
    subscription_data: {
      metadata: {
        business_id: business_id,
        tier_id: tier_id,
        customer_email: customer_email,
        customer_name: customer_name || ''
      }
    },
    allow_promotion_codes: true, // Allow customers to use discount codes
    billing_address_collection: 'auto'
  });

  res.status(200).json({
    success: true,
    data: {
      sessionId: session.id,
      checkoutUrl: session.url,
      business: business,
      tier: {
        id: tier.id,
        name: tier.name,
        description: tier.description,
        price_cents: tier.monthly_price_cents,
        interval: 'month'
      }
    }
  });
});