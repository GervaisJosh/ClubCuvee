import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

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

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
});

const handler = async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { sessionId, token } = req.body;

    if (!sessionId || !token) {
      res.status(400).json({ error: 'Session ID and token are required' });
      return;
    }

    // Get the Stripe checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'customer']
    });

    if (session.payment_status !== 'paid') {
      res.status(400).json({ error: 'Payment not completed' });
      return;
    }

    if (!session.subscription) {
      res.status(400).json({ error: 'No subscription found' });
      return;
    }

    // Validate the invitation token
    const { data: invitation, error: invitationError } = await supabaseAdmin
      .from('customer_invitations')
      .select(`
        *,
        businesses!inner (
          id,
          name,
          website
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

    const business = invitation.businesses;

    // Extract customer data from session metadata
    const metadata = session.metadata || {};
    const subscriptionMetadata = (session.subscription as Stripe.Subscription).metadata || {};

    // Combine metadata from both sources (session has priority)
    const customerData = {
      name: metadata.name || subscriptionMetadata.name || '',
      email: metadata.email || subscriptionMetadata.email || session.customer_email || '',
      phone: metadata.phone || subscriptionMetadata.phone || '',
      address: metadata.address || subscriptionMetadata.address || '',
      city: metadata.city || subscriptionMetadata.city || '',
      state: metadata.state || subscriptionMetadata.state || '',
      zip_code: metadata.zip_code || subscriptionMetadata.zip_code || '',
      wine_preferences: metadata.wine_preferences || subscriptionMetadata.wine_preferences || '',
      dietary_restrictions: metadata.dietary_restrictions || subscriptionMetadata.dietary_restrictions || '',
      special_requests: metadata.special_requests || subscriptionMetadata.special_requests || '',
      tier_id: metadata.tier_id || subscriptionMetadata.tier_id || ''
    };

    if (!customerData.email || !customerData.name || !customerData.tier_id) {
      res.status(400).json({ 
        error: 'Missing required customer data from payment session' 
      });
      return;
    }

    // Get the membership tier details
    const { data: tier, error: tierError } = await supabaseAdmin
      .from('membership_tiers')
      .select('*')
      .eq('id', customerData.tier_id)
      .eq('business_id', business.id)
      .single();

    if (tierError || !tier) {
      res.status(404).json({ 
        error: 'Membership tier not found' 
      });
      return;
    }

    // Check if customer already exists (prevent duplicates)
    const { data: existingCustomer } = await supabaseAdmin
      .from('customers')
      .select('id')
      .eq('email', customerData.email)
      .eq('business_id', business.id)
      .single();

    if (existingCustomer) {
      res.status(409).json({ 
        error: 'Customer already exists for this business' 
      });
      return;
    }

    // Create customer record
    const customerRecord = {
      business_id: business.id,
      tier_id: customerData.tier_id,
      name: customerData.name,
      email: customerData.email,
      phone: customerData.phone || null,
      address: customerData.address || null,
      city: customerData.city || null,
      state: customerData.state || null,
      zip_code: customerData.zip_code || null,
      wine_preferences: customerData.wine_preferences || null,
      dietary_restrictions: customerData.dietary_restrictions || null,
      special_requests: customerData.special_requests || null,
      stripe_customer_id: typeof session.customer === 'string' ? session.customer : session.customer?.id || null,
      stripe_subscription_id: (session.subscription as Stripe.Subscription).id,
      subscription_status: (session.subscription as Stripe.Subscription).status,
      subscription_start_date: new Date(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: customer, error: customerError } = await supabaseAdmin
      .from('customers')
      .insert([customerRecord])
      .select()
      .single();

    if (customerError) {
      console.error('Error creating customer:', customerError);
      res.status(500).json({ 
        error: 'Failed to create customer record' 
      });
      return;
    }

    // Mark the invitation as used
    await supabaseAdmin
      .from('customer_invitations')
      .update({ 
        status: 'used',
        used_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('token', token);

    // Prepare response data
    const subscription = session.subscription as Stripe.Subscription;
    const response = {
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        tier_name: tier.name,
        subscription_status: customer.subscription_status
      },
      business: {
        id: business.id,
        name: business.name,
        website: business.website
      },
      subscription: {
        id: subscription.id,
        status: subscription.status,
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        amount: subscription.items.data[0]?.price.unit_amount || 0
      }
    };

    res.status(200).json(response);
    return;
  } catch (error: any) {
    console.error('Error in verify-customer-payment:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
    return;
  }
};

export default withErrorHandling(handler);