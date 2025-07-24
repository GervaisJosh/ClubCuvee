import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
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

// Inline Stripe utilities
const verifyStripeWebhook = (signature: string, payload: string) => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new APIError(500, 'STRIPE_SECRET_KEY is required', 'CONFIG_ERROR');
  }
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new APIError(500, 'STRIPE_WEBHOOK_SECRET is required', 'CONFIG_ERROR');
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-06-30.basil',
    typescript: true,
  });

  try {
    return stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    throw new APIError(400, 'Invalid webhook signature', 'INVALID_SIGNATURE');
  }
};

const getSubscription = async (subscriptionId: string) => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new APIError(500, 'STRIPE_SECRET_KEY is required', 'CONFIG_ERROR');
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-06-30.basil',
    typescript: true,
  });

  try {
    return await stripe.subscriptions.retrieve(subscriptionId);
  } catch (err) {
    if (err instanceof Stripe.errors.StripeError) {
      throw new APIError(400, err.message, 'STRIPE_ERROR');
    }
    throw err;
  }
};

// Inline Supabase utilities
const createRestaurant = async (data: {
  name: string;
  email: string;
  subscription_id: string;
  membership_tier: string;
}) => {
  const supabaseAdmin = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  const { data: restaurant, error } = await supabaseAdmin
    .from('restaurants')
    .insert([data])
    .select()
    .single();

  if (error) {
    throw new APIError(500, 'Failed to create restaurant', 'DATABASE_ERROR');
  }

  return restaurant;
};

const updateRestaurantInvite = async (token: string, data: {
  status: 'accepted' | 'expired' | 'in_progress';
  accepted_at?: string;
}) => {
  const supabaseAdmin = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  const { error } = await supabaseAdmin
    .from('restaurant_invitations')
    .update(data)
    .eq('token', token);

  if (error) {
    throw new APIError(500, 'Failed to update restaurant invitation', 'DATABASE_ERROR');
  }
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

  const signature = req.headers['stripe-signature'];
  if (!signature || typeof signature !== 'string') {
    throw new APIError(400, 'Missing stripe-signature header', 'MISSING_SIGNATURE');
  }

  // Verify webhook signature
  const event = verifyStripeWebhook(signature, req.body);

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Handle business onboarding checkout
      if (session.metadata?.type === 'business_onboarding') {
        if (!session.subscription || !session.metadata?.business_invitation_token) {
          throw new APIError(400, 'Invalid business onboarding session data', 'INVALID_SESSION');
        }

        // Get subscription details
        const subscription = await getSubscription(session.subscription as string);

        // Get the business invitation details to create the business
        const { data: inviteData, error: inviteError } = await supabaseAdmin.rpc('validate_business_invitation_token', {
          p_token: session.metadata.business_invitation_token
        });

        if (inviteError || !inviteData || inviteData.length === 0) {
          throw new APIError(400, 'Invalid business invitation token', 'INVALID_TOKEN');
        }

        const businessData = inviteData[0];

        // Create business record
        await createRestaurant({
          name: businessData.business_name,
          email: businessData.business_email,
          subscription_id: subscription.id,
          membership_tier: session.metadata.pricing_tier_key,
        });

        // Mark business invitation as used
        const { error: markUsedError } = await supabaseAdmin.rpc('mark_business_invitation_used', {
          p_token: session.metadata.business_invitation_token
        });

        if (markUsedError) {
          console.error('Error marking business invitation as used:', markUsedError);
        }
      } 
      // Handle legacy restaurant invitations (backward compatibility)
      else if (session.metadata?.restaurantName) {
        if (!session.subscription) {
          throw new APIError(400, 'Invalid session data', 'INVALID_SESSION');
        }

        // Get subscription details
        const subscription = await getSubscription(session.subscription as string);

        // Create restaurant record
        await createRestaurant({
          name: session.metadata.restaurantName,
          email: session.customer_email!,
          subscription_id: subscription.id,
          membership_tier: session.metadata.membershipTier,
        });

        // Mark invite as accepted
        if (session.metadata.inviteToken) {
          await updateRestaurantInvite(session.metadata.inviteToken, {
            status: 'accepted',
            accepted_at: new Date().toISOString(),
          });
        }
      } 
      // Handle customer membership signup
      else if (session.metadata?.type === 'customer_membership') {
        if (!session.subscription || !session.metadata?.business_id || !session.metadata?.tier_id) {
          throw new APIError(400, 'Invalid customer membership session data', 'INVALID_SESSION');
        }

        // Get subscription details
        const subscription = await getSubscription(session.subscription as string);

        // Create customer membership record
        const { error: membershipError } = await supabaseAdmin
          .from('customers')
          .insert({
            email: session.metadata.customer_email,
            name: session.metadata.customer_name || null,
            business_id: session.metadata.business_id,
            tier_id: session.metadata.tier_id,
            stripe_customer_id: subscription.customer as string,
            stripe_subscription_id: subscription.id,
            subscription_status: 'active',
            created_at: new Date().toISOString()
          });

        if (membershipError) {
          console.error('Error creating customer membership:', membershipError);
          throw new APIError(500, 'Failed to create customer membership', 'MEMBERSHIP_CREATION_FAILED');
        }
      } else {
        throw new APIError(400, 'Unknown checkout session type', 'INVALID_SESSION');
      }

      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.status(200).json({ received: true });
});