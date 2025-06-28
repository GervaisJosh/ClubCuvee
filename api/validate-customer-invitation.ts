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

const handler = async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { token } = req.body;

    if (!token) {
      res.status(400).json({ error: 'Token is required' });
      return;
    }

    // Get customer invitation with business and tier data
    const { data: invitation, error: invitationError } = await supabaseAdmin
      .from('customer_invitations')
      .select(`
        *,
        businesses!inner (
          id,
          name,
          website,
          logo_url
        )
      `)
      .eq('token', token)
      .eq('status', 'pending')
      .single();

    if (invitationError || !invitation) {
      res.status(404).json({ 
        error: 'Invalid or expired customer invitation' 
      });
      return;
    }

    // Check if invitation has expired
    const now = new Date();
    const expiryDate = new Date(invitation.expires_at);

    if (now > expiryDate) {
      // Update status to expired
      await supabaseAdmin
        .from('customer_invitations')
        .update({ 
          status: 'expired',
          updated_at: new Date().toISOString()
        })
        .eq('token', token);
        
      res.status(410).json({ 
        error: 'This invitation has expired' 
      });
      return;
    }

    const business = invitation.businesses;

    // Get membership tiers for this business
    const { data: membershipTiers, error: tiersError } = await supabaseAdmin
      .from('membership_tiers')
      .select('*')
      .eq('business_id', business.id)
      .eq('is_active', true)
      .order('monthly_price_cents', { ascending: true });

    if (tiersError) {
      console.error('Error fetching membership tiers:', tiersError);
      res.status(500).json({ 
        error: 'Failed to fetch membership tiers' 
      });
      return;
    }

    // Format the response
    const response = {
      business: {
        id: business.id,
        name: business.name,
        website: business.website,
        logo_url: business.logo_url
      },
      membershipTiers: membershipTiers?.map(tier => ({
        id: tier.id,
        name: tier.name,
        price: (tier.monthly_price_cents / 100).toFixed(2),
        description: tier.description,
        stripe_price_id: tier.stripe_price_id
      })) || [],
      invitation: {
        id: invitation.id,
        expires_at: invitation.expires_at,
        status: invitation.status
      }
    };

    res.status(200).json(response);
    return;
  } catch (error: any) {
    console.error('Error in validate-customer-invitation:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
    return;
  }
};

export default withErrorHandling(handler);