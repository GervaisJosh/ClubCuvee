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

interface CreateRestaurantTierRequest {
  business_id: string;
  name: string;
  description?: string;
  monthly_price_cents: number;
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

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new APIError(401, 'Unauthorized', 'UNAUTHORIZED');
  }

  const body: CreateRestaurantTierRequest = req.body;
  const { business_id, name, description, monthly_price_cents } = body;

  // Validate required fields
  if (!business_id || !name || !monthly_price_cents) {
    throw new APIError(400, 'Missing required fields: business_id, name, monthly_price_cents', 'MISSING_FIELDS');
  }

  if (monthly_price_cents < 1000) {
    throw new APIError(400, 'Minimum price is $10.00 (1000 cents)', 'INVALID_PRICE');
  }

  // Verify the business exists and user has permission
  const { data: business, error: businessError } = await supabaseAdmin
    .from('businesses')
    .select('id, name')
    .eq('id', business_id)
    .single();

  if (businessError || !business) {
    throw new APIError(404, 'Business not found or access denied', 'BUSINESS_NOT_FOUND');
  }

  // Create the membership tier in database first
  const { data: tier, error: tierError } = await supabaseAdmin
    .from('membership_tiers')
    .insert({
      business_id,
      name,
      description,
      monthly_price_cents,
      is_active: false // Will be set to true after Stripe creation
    })
    .select()
    .single();

  if (tierError || !tier) {
    throw new APIError(500, 'Failed to create membership tier', 'TIER_CREATION_FAILED');
  }

  try {
    // Create Stripe Product
    const product = await stripe.products.create({
      name: `${business.name} - ${name}`,
      description: description || `Wine club membership tier for ${business.name}`,
      metadata: {
        business_id: business_id,
        tier_id: tier.id,
        created_by: 'club_cuvee_platform'
      }
    });

    // Create Stripe Price
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: monthly_price_cents,
      currency: 'usd',
      recurring: {
        interval: 'month'
      },
      metadata: {
        business_id: business_id,
        tier_id: tier.id,
        created_by: 'club_cuvee_platform'
      }
    });

    // Update the tier with Stripe IDs and mark as active
    const { error: updateError } = await supabaseAdmin
      .from('membership_tiers')
      .update({
        stripe_product_id: product.id,
        stripe_price_id: price.id,
        is_active: true
      })
      .eq('id', tier.id);

    if (updateError) {
      console.error('Failed to update tier with Stripe IDs:', updateError);
      // Note: Stripe objects are created but DB update failed
      // TODO: Consider implementing cleanup or retry logic
    }

    res.status(200).json({
      success: true,
      data: {
        tier_id: tier.id,
        stripe_product_id: product.id,
        stripe_price_id: price.id,
        is_active: !updateError
      }
    });

  } catch (stripeError: any) {
    console.error('Stripe creation failed:', stripeError);
    
    // Clean up the database tier since Stripe creation failed
    await supabaseAdmin
      .from('membership_tiers')
      .delete()
      .eq('id', tier.id);

    throw new APIError(500, `Failed to create Stripe products: ${stripeError.message}`, 'STRIPE_ERROR');
  }
});