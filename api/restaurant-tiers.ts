import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Create Supabase admin client (inline, no external dependencies)
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

export default withErrorHandler(async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new APIError(401, 'Unauthorized', 'UNAUTHORIZED');
  }

  const business_id = req.query.business_id as string;

  if (!business_id) {
    throw new APIError(400, 'business_id parameter is required', 'MISSING_BUSINESS_ID');
  }

  switch (req.method) {
    case 'GET':
      await handleGetTiers(business_id, res);
      break;
    
    case 'DELETE':
      const tier_id = req.query.tier_id as string;
      if (!tier_id) {
        throw new APIError(400, 'tier_id parameter is required for DELETE', 'MISSING_TIER_ID');
      }
      await handleDeleteTier(business_id, tier_id, res);
      break;
    
    default:
      throw new APIError(405, 'Method not allowed', 'METHOD_NOT_ALLOWED');
  }
});

async function handleGetTiers(business_id: string, res: VercelResponse) {
  // Verify business exists
  const { data: business, error: businessError } = await supabaseAdmin
    .from('businesses')
    .select('id, name')
    .eq('id', business_id)
    .single();

  if (businessError || !business) {
    throw new APIError(404, 'Business not found', 'BUSINESS_NOT_FOUND');
  }

  // Get all tiers for this business
  const { data: tiers, error: tiersError } = await supabaseAdmin
    .from('membership_tiers')
    .select('*')
    .eq('business_id', business_id)
    .order('created_at', { ascending: true });

  if (tiersError) {
    throw new APIError(500, 'Failed to fetch tiers', 'FETCH_TIERS_FAILED');
  }

  res.status(200).json({
    success: true,
    data: {
      business: business,
      tiers: tiers || []
    }
  });
}

async function handleDeleteTier(business_id: string, tier_id: string, res: VercelResponse) {
  // Verify the tier exists and belongs to this business
  const { data: tier, error: tierError } = await supabaseAdmin
    .from('membership_tiers')
    .select('*')
    .eq('id', tier_id)
    .eq('business_id', business_id)
    .single();

  if (tierError || !tier) {
    throw new APIError(404, 'Tier not found or access denied', 'TIER_NOT_FOUND');
  }

  // TODO: Consider archiving Stripe products instead of deleting
  // For now, we'll just delete the database record
  // The Stripe products will remain (to preserve payment history)
  
  const { error: deleteError } = await supabaseAdmin
    .from('membership_tiers')
    .delete()
    .eq('id', tier_id)
    .eq('business_id', business_id);

  if (deleteError) {
    throw new APIError(500, 'Failed to delete tier', 'DELETE_TIER_FAILED');
  }

  res.status(200).json({
    success: true,
    data: {
      message: 'Tier deleted successfully',
      deleted_tier_id: tier_id
    }
  });
}