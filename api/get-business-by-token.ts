import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// INLINE Supabase client (no external imports)
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

// INLINE error handling (no external imports)
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

const withErrorHandling = (
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

const handler = async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    // Get business data through the invitation token
    const { data: invitation, error: invitationError } = await supabaseAdmin
      .from('restaurant_invitations')
      .select('*')
      .eq('token', token)
      .eq('status', 'completed')
      .single();

    if (invitationError || !invitation) {
      return res.status(404).json({ 
        error: 'Invitation not found or not completed' 
      });
    }

    // Get business data using business_id from invitation
    const { data: business, error: businessError } = await supabaseAdmin
      .from('businesses')
      .select('id, name, website, email, status, created_at, updated_at')
      .eq('id', invitation.business_id)
      .single();

    if (businessError || !business) {
      return res.status(404).json({ 
        error: 'Business not found' 
      });
    }

    // Get membership tiers for this business
    const { data: membershipTiers, error: tiersError } = await supabaseAdmin
      .from('membership_tiers')
      .select('*')
      .eq('business_id', business.id)
      .order('created_at', { ascending: true });

    if (tiersError) {
      console.error('Error fetching membership tiers:', tiersError);
      return res.status(500).json({ 
        error: 'Failed to fetch membership tiers' 
      });
    }

    // Format the response
    const response = {
      business: {
        id: business.id,
        name: business.name,
        website: business.website,
        email: business.email,
        status: business.status,
        created_at: business.created_at
      },
      membershipTiers: membershipTiers || [],
      invitation: {
        id: invitation.id,
        status: invitation.status,
        created_at: invitation.created_at
      }
    };

    return res.status(200).json(response);
  } catch (error: any) {
    console.error('Error in get-business-by-token:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};

export default withErrorHandling(handler);