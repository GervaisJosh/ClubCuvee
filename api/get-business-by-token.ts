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
  console.log('=== GET BUSINESS BY TOKEN DEBUG ===');
  console.log('Request method:', req.method);
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  console.log('Environment check:', {
    hasSupabaseUrl: !!process.env.SUPABASE_URL,
    hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
  });

  if (req.method !== 'POST') {
    console.log('❌ Method not allowed:', req.method);
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { token } = req.body;

    console.log('Token received:', token);

    if (!token) {
      console.log('❌ No token provided');
      res.status(400).json({ error: 'Token is required' });
      return;
    }

    // Get business data through the invitation token
    console.log('🔍 Querying restaurant_invitations for token:', token);
    const { data: invitation, error: invitationError } = await supabaseAdmin
      .from('restaurant_invitations')
      .select('*')
      .eq('token', token)
      .eq('status', 'completed')
      .single();

    console.log('Invitation query result:', {
      invitation: invitation ? {
        id: invitation.id,
        restaurant_name: invitation.restaurant_name,
        email: invitation.email,
        status: invitation.status,
        business_id: invitation.business_id,
        token: invitation.token
      } : null,
      error: invitationError
    });

    if (invitationError || !invitation) {
      console.log('❌ Invitation not found or not completed');
      
      // Also try to find the invitation without status filter for debugging
      const { data: anyInvitation, error: anyError } = await supabaseAdmin
        .from('restaurant_invitations')
        .select('*')
        .eq('token', token)
        .single();
      
      console.log('Debug - Any invitation with this token:', {
        invitation: anyInvitation,
        error: anyError
      });

      res.status(404).json({ 
        error: 'Invitation not found or not completed',
        debug: {
          tokenProvided: token,
          invitationFound: !!anyInvitation,
          invitationStatus: anyInvitation?.status,
          hasBusinessId: !!anyInvitation?.business_id
        }
      });
      return;
    }

    console.log('✅ Found invitation, checking business_id:', invitation.business_id);

    // Handle case where business hasn't been created yet
    if (!invitation.business_id) {
      console.log('⚠️ No business_id yet - invitation exists but business not created');
      res.status(200).json({
        invitation: {
          id: invitation.id,
          email: invitation.email,
          restaurant_name: invitation.restaurant_name,
          status: invitation.status,
          created_at: invitation.created_at
        },
        business: null,
        membershipTiers: [],
        message: 'Invitation found but business not created yet'
      });
      return;
    }

    // Get business data using business_id from invitation
    console.log('🔍 Querying businesses table for business_id:', invitation.business_id);
    const { data: business, error: businessError } = await supabaseAdmin
      .from('businesses')
      .select('id, name, website, email, status, created_at, updated_at, pricing_tier_id')
      .eq('id', invitation.business_id)
      .single();

    console.log('Business query result:', {
      business: business ? {
        id: business.id,
        name: business.name,
        email: business.email,
        status: business.status
      } : null,
      error: businessError
    });

    if (businessError || !business) {
      console.log('❌ Business not found for business_id:', invitation.business_id);
      res.status(404).json({ 
        error: 'Business not found',
        debug: {
          business_id: invitation.business_id,
          businessError: businessError
        }
      });
      return;
    }

    // Get pricing tier details separately
    let pricingTierName = 'Unknown';
    if (business.pricing_tier_id) {
      const { data: pricingTier, error: pricingTierError } = await supabaseAdmin
        .from('business_pricing_tiers')
        .select('name')
        .eq('id', business.pricing_tier_id)
        .single();
      
      if (!pricingTierError && pricingTier) {
        pricingTierName = pricingTier.name;
      }
    }

    // Get membership tiers for this business
    console.log('🔍 Querying membership_tiers for business_id:', business.id);
    const { data: membershipTiers, error: tiersError } = await supabaseAdmin
      .from('membership_tiers')
      .select('id, name, description, monthly_price_cents, stripe_product_id, stripe_price_id, created_at')
      .eq('business_id', business.id)
      .order('created_at', { ascending: true });

    console.log('Membership tiers query result:', {
      tierCount: membershipTiers?.length || 0,
      tiers: membershipTiers?.map(t => ({ id: t.id, name: t.name, price: t.monthly_price_cents })) || [],
      error: tiersError
    });

    if (tiersError) {
      console.error('❌ Error fetching membership tiers:', tiersError);
      res.status(500).json({ 
        error: 'Failed to fetch membership tiers',
        debug: { tiersError }
      });
      return;
    }

    // Format the response to match frontend interface
    const response = {
      business: {
        id: business.id,
        name: business.name,
        website: business.website,
        admin_email: business.email,
        logo_url: null, // TODO: Add logo support later
        subscription_tier: pricingTierName,
        created_at: business.created_at
      },
      membershipTiers: (membershipTiers || []).map(tier => ({
        id: tier.id,
        name: tier.name,
        price: (tier.monthly_price_cents / 100).toFixed(2), // Convert cents to dollars as string
        description: tier.description,
        stripe_product_id: tier.stripe_product_id || '',
        stripe_price_id: tier.stripe_price_id || '',
        created_at: tier.created_at
      })),
      invitation: {
        id: invitation.id,
        status: invitation.status,
        created_at: invitation.created_at
      }
    };

    console.log('✅ Sending successful response:', {
      businessName: response.business.name,
      tierCount: response.membershipTiers.length,
      invitationStatus: response.invitation.status
    });

    res.status(200).json(response);
    return;
  } catch (error: any) {
    console.error('❌ Error in get-business-by-token:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      stack: error.stack
    });
    return;
  }
};

export default withErrorHandling(handler);