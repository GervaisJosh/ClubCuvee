import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

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

interface MembershipTier {
  id: string;
  name: string;
  description: string;
  monthly_price_cents: number;
  stripe_product_id: string;
  stripe_price_id: string;
  is_active: boolean;
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

  if (req.method !== 'GET') {
    throw new APIError(405, 'Method not allowed', 'METHOD_NOT_ALLOWED');
  }

  const business_id = req.query.business_id as string;

  if (!business_id) {
    throw new APIError(400, 'business_id parameter is required', 'MISSING_BUSINESS_ID');
  }

  // Get business details
  const { data: business, error: businessError } = await supabaseAdmin
    .from('businesses')
    .select('id, name, email')
    .eq('id', business_id)
    .single();

  if (businessError || !business) {
    throw new APIError(404, 'Business not found', 'BUSINESS_NOT_FOUND');
  }

  // Get active membership tiers for this business
  const { data: tiers, error: tiersError } = await supabaseAdmin
    .from('membership_tiers')
    .select('id, name, description, monthly_price_cents, stripe_product_id, stripe_price_id, is_active')
    .eq('business_id', business_id)
    .eq('is_active', true);

  if (tiersError) {
    console.error('Error fetching membership tiers:', tiersError);
    throw new APIError(500, 'Failed to fetch membership tiers', 'FETCH_TIERS_FAILED');
  }

  // Format price display for frontend
  const formattedTiers = (tiers || []).map((tier: MembershipTier) => ({
    ...tier,
    price_display: `$${(tier.monthly_price_cents / 100).toFixed(2)}`,
    price_per_interval: `$${(tier.monthly_price_cents / 100).toFixed(2)}/month`
  }));

  res.status(200).json({
    success: true,
    data: {
      business: business,
      tiers: formattedTiers,
      has_tiers: formattedTiers.length > 0
    }
  });
});