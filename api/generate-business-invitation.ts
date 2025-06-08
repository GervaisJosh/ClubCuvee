import { VercelRequest, VercelResponse } from '@vercel/node';
import { randomUUID } from 'crypto';
import { createClient } from '@supabase/supabase-js';
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

  if (error instanceof Error && error.name === 'StripeError') {
    return res.status(400).json({
      status: 'error',
      error: {
        message: error.message,
        code: 'STRIPE_ERROR',
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

  if (req.method !== 'POST') {
    throw new APIError(405, 'Method not allowed', 'METHOD_NOT_ALLOWED');
  }

  // Parse request body
  const { business_name, business_email, pricing_tier } = req.body;

  // Validate required fields
  if (!business_name || !business_email) {
    throw new APIError(400, 'Business name and email are required', 'VALIDATION_ERROR');
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(business_email)) {
    throw new APIError(400, 'Invalid email format', 'VALIDATION_ERROR');
  }

  // Validate pricing tier if provided (should be a UUID)
  if (pricing_tier) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(pricing_tier)) {
      throw new APIError(400, 'Invalid pricing tier ID format', 'VALIDATION_ERROR');
    }

    // Verify the pricing tier exists
    const { data: tierExists, error: tierError } = await supabaseAdmin
      .from('business_pricing_tiers')
      .select('id')
      .eq('id', pricing_tier)
      .eq('is_active', true)
      .single();

    if (tierError || !tierExists) {
      throw new APIError(400, 'Invalid pricing tier selected', 'VALIDATION_ERROR');
    }
  }

  // Generate invitation token and insert into restaurant_invitations
  const invitationToken = randomUUID();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
  
  const { data, error } = await supabaseAdmin
    .from('restaurant_invitations')
    .insert({
      token: invitationToken,
      email: business_email,
      restaurant_name: business_name,
      tier: pricing_tier || 'standard',
      expires_at: expiresAt.toISOString(),
      status: 'pending'
    })
    .select('token, expires_at')
    .single();

  if (error) {
    console.error('Error generating restaurant invitation:', error);
    throw new APIError(500, 'Failed to generate restaurant invitation', 'DATABASE_ERROR');
  }

  if (!data) {
    throw new APIError(500, 'Failed to generate invitation token', 'DATABASE_ERROR');
  }

  const invitationData = data;
  
  // Environment variable priority: BASE_URL -> NEXT_PUBLIC_BASE_URL -> production fallback
  // Note: VERCEL_URL is preview/branch deployments, we want production domain for invitations
  const baseUrl = process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://club-cuvee.com';
  const fullInvitationUrl = `${baseUrl}/onboarding/${invitationData.token}`;

  res.status(200).json({
    success: true,
    data: {
      token: invitationData.token,
      invitation_url: fullInvitationUrl,
      expires_at: invitationData.expires_at
    }
  });
});