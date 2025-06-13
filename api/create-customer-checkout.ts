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
  token?: string;  // New token-based flow
  business_id?: string;  // Legacy flow
  tier_id?: string;  // Legacy flow  
  customer_email?: string;  // Legacy flow
  customer_name?: string;  // Legacy flow
  customerData?: {  // New token-based flow
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip_code: string;
    wine_preferences: string;
    dietary_restrictions: string;
    special_requests: string;
    selected_tier_id: string;
  };
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
  const { token, business_id, tier_id, customer_email, customer_name, customerData } = body;

  let business: any;
  let tier: any;
  let finalCustomerEmail: string;
  let finalCustomerName: string;
  let customerMetadata: any = {};

  // TOKEN-BASED FLOW (new)
  if (token && customerData) {
    // Validate customer invitation token
    const { data: invitation, error: invitationError } = await supabaseAdmin
      .from('customer_invitations')
      .select(`
        *,
        businesses!inner (
          id,
          name
        )
      `)
      .eq('token', token)
      .eq('status', 'pending')
      .single();

    if (invitationError || !invitation) {
      throw new APIError(404, 'Invalid or expired customer invitation', 'INVALID_INVITATION');
    }

    // Check if invitation has expired
    const now = new Date();
    const expiryDate = new Date(invitation.expires_at);
    if (now > expiryDate) {
      throw new APIError(410, 'Customer invitation has expired', 'INVITATION_EXPIRED');
    }

    business = invitation.businesses;
    finalCustomerEmail = customerData.email;
    finalCustomerName = customerData.name;

    // Get the selected tier
    const { data: selectedTier, error: tierError } = await supabaseAdmin
      .from('membership_tiers')
      .select('*')
      .eq('id', customerData.selected_tier_id)
      .eq('restaurant_id', business.id)
      .eq('is_active', true)
      .single();

    if (tierError || !selectedTier) {
      throw new APIError(404, 'Selected membership tier not found', 'TIER_NOT_FOUND');
    }

    tier = selectedTier;

    // Store customer data for post-checkout processing
    customerMetadata = {
      type: 'customer_membership',
      token: token,
      invitation_id: invitation.id,
      name: customerData.name,
      email: customerData.email,
      phone: customerData.phone || '',
      address: customerData.address,
      city: customerData.city,
      state: customerData.state,
      zip_code: customerData.zip_code,
      wine_preferences: customerData.wine_preferences || '',
      dietary_restrictions: customerData.dietary_restrictions || '',
      special_requests: customerData.special_requests || '',
      business_id: business.id,
      tier_id: tier.id
    };
  }
  // LEGACY FLOW (existing)
  else if (business_id && tier_id && customer_email) {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer_email)) {
      throw new APIError(400, 'Invalid email format', 'INVALID_EMAIL');
    }

    // Get the business and tier details
    const { data: businessData, error: businessError } = await supabaseAdmin
      .from('businesses')
      .select('id, name')
      .eq('id', business_id)
      .single();

    if (businessError || !businessData) {
      throw new APIError(404, 'Business not found', 'BUSINESS_NOT_FOUND');
    }

    // Get the membership tier details
    const { data: tierData, error: tierError } = await supabaseAdmin
      .from('membership_tiers')
      .select('*')
      .eq('id', tier_id)
      .eq('business_id', business_id)
      .eq('is_active', true)
      .single();

    if (tierError || !tierData) {
      throw new APIError(404, 'Membership tier not found or not ready for signup', 'TIER_NOT_FOUND');
    }

    business = businessData;
    tier = tierData;
    finalCustomerEmail = customer_email;
    finalCustomerName = customer_name || '';

    customerMetadata = {
      type: 'customer_membership',
      business_id: business_id,
      tier_id: tier_id,
      customer_email: customer_email,
      customer_name: customer_name || ''
    };
  } else {
    throw new APIError(400, 'Invalid request: provide either token+customerData or business_id+tier_id+customer_email', 'INVALID_REQUEST');
  }

  if (!tier.stripe_price_id) {
    throw new APIError(400, 'Membership tier is not configured for online signup', 'TIER_NOT_CONFIGURED');
  }

  // Determine success and cancel URLs based on flow type
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : process.env.BASE_URL || 'http://localhost:3000';

  let successUrl: string;
  let cancelUrl: string;

  if (token && customerData) {
    // New token-based flow
    successUrl = `${baseUrl}/customer/welcome?session_id={CHECKOUT_SESSION_ID}&token=${token}`;
    cancelUrl = `${baseUrl}/customer/join/${token}?canceled=true`;
  } else {
    // Legacy flow
    successUrl = `${baseUrl}/join/${business_id}/success?session_id={CHECKOUT_SESSION_ID}`;
    cancelUrl = `${baseUrl}/join/${business_id}?canceled=true`;
  }

  // Create Stripe checkout session
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: finalCustomerEmail,
    customer_creation: 'always',
    line_items: [
      {
        price: tier.stripe_price_id,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      ...customerMetadata,
      customer_name: finalCustomerName
    },
    subscription_data: {
      metadata: {
        ...customerMetadata,
        customer_name: finalCustomerName
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