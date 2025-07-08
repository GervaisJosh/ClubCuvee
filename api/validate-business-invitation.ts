import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { ZodError } from 'zod';

// Inline error handling and supabase client (no external dependencies)
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

  // Support both GET and POST methods for frontend compatibility
  if (!['GET', 'POST'].includes(req.method!)) {
    throw new APIError(405, 'Method not allowed', 'METHOD_NOT_ALLOWED');
  }

  // Get token from query params (GET) or body (POST)
  const token = req.method === 'GET' ? req.query.token as string : req.body?.token;

  if (!token) {
    throw new APIError(400, 'Token is required', 'VALIDATION_ERROR');
  }

  // Query restaurant_invitations table directly (the correct table)
  const { data: inviteDetails, error: detailsError } = await supabaseAdmin
    .from('restaurant_invitations')
    .select('restaurant_name, email, business_id, tier, expires_at, status')
    .eq('token', token)
    .single();

  if (detailsError || !inviteDetails) {
    console.error('Error fetching invitation details:', detailsError);
    throw new APIError(404, 'Invalid or expired invitation token', 'NOT_FOUND');
  }

  // Check if token is expired
  if (new Date(inviteDetails.expires_at) < new Date()) {
    throw new APIError(400, 'This invitation has expired', 'VALIDATION_ERROR');
  }

  // Check if token is already used
  if (inviteDetails.status === 'completed') {
    throw new APIError(400, 'This invitation has already been used', 'VALIDATION_ERROR');
  }

  // Get pricing tier UUID if tier name is provided
  let pricing_tier_id = null;
  if (inviteDetails.tier && inviteDetails.tier !== 'standard') {
    const { data: tierData, error: tierError } = await supabaseAdmin
      .from('business_pricing_tiers')
      .select('id')
      .eq('name', inviteDetails.tier)
      .eq('is_active', true)
      .single();
    
    if (!tierError && tierData) {
      pricing_tier_id = tierData.id;
    }
  }

  // If business_id exists, get the business details
  let businessSlug = null;
  if (inviteDetails.business_id) {
    const { data: businessData, error: businessError } = await supabaseAdmin
      .from('businesses')
      .select('slug')
      .eq('id', inviteDetails.business_id)
      .single();
    
    if (!businessError && businessData) {
      businessSlug = businessData.slug;
    }
  }

  // Return data in the format expected by OnboardToken.tsx
  res.status(200).json({
    success: true,
    data: {
      is_valid: true,
      business_name: inviteDetails.restaurant_name,  // Frontend expects business_name
      business_email: inviteDetails.email,           // Frontend expects business_email  
      business_id: inviteDetails.business_id,        // Return the business ID
      business_slug: businessSlug,                   // Return the business slug
      pricing_tier: pricing_tier_id,                 // Frontend expects UUID, not tier name
      expires_at: inviteDetails.expires_at
    }
  });
});