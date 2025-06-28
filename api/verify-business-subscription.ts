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

  // Initialize Stripe client
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia',
    typescript: true,
  });

  if (req.method !== 'POST') {
    throw new APIError(405, 'Method not allowed', 'METHOD_NOT_ALLOWED');
  }

  const { token, sessionId } = req.body;

  if (!token || !sessionId) {
    throw new APIError(400, 'Token and sessionId are required', 'VALIDATION_ERROR');
  }

  try {
    // 1. Validate the invitation token
    const { data: invite, error: inviteError } = await supabaseAdmin
      .from('restaurant_invitations')
      .select('restaurant_name, email, tier, expires_at, status, payment_session_id')
      .eq('token', token)
      .single();

    if (inviteError || !invite) {
      console.error('Error fetching invitation details:', inviteError);
      throw new APIError(404, 'Invalid invitation token', 'NOT_FOUND');
    }

    // 2. Verify the session belongs to this invitation
    if (invite.payment_session_id !== sessionId) {
      throw new APIError(400, 'Session ID does not match invitation', 'VALIDATION_ERROR');
    }

    // 3. Retrieve the Stripe checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      throw new APIError(404, 'Checkout session not found', 'NOT_FOUND');
    }

    // 4. Check if payment was successful
    if (session.payment_status !== 'paid') {
      throw new APIError(400, 'Payment not completed', 'PAYMENT_INCOMPLETE');
    }

    // 5. Retrieve the subscription details
    const subscriptionId = session.subscription as string;
    if (!subscriptionId) {
      throw new APIError(400, 'No subscription found for this session', 'NO_SUBSCRIPTION');
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // 6. Update invitation status to show payment completed
    await supabaseAdmin
      .from('restaurant_invitations')
      .update({
        status: 'paid',
        updated_at: new Date().toISOString()
      })
      .eq('token', token);

    // 7. Return subscription and pricing tier details
    res.status(200).json({
      success: true,
      data: {
        subscription: {
          id: subscription.id,
          status: subscription.status,
          currentPeriodEnd: subscription.current_period_end,
          customerId: subscription.customer,
          priceId: subscription.items.data[0]?.price.id
        },
        pricing_tier: invite.tier,
        session: {
          id: session.id,
          payment_status: session.payment_status,
          customer_email: session.customer_details?.email
        }
      }
    });

  } catch (err) {
    if (err instanceof Stripe.errors.StripeError) {
      throw new APIError(400, err.message, 'STRIPE_ERROR');
    }
    throw err;
  }
});