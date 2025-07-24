import { VercelRequest, VercelResponse } from '@vercel/node';
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

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-06-30.basil',
});

export default withErrorHandler(async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'GET') {
    throw new APIError(405, 'Method not allowed', 'METHOD_NOT_ALLOWED');
  }

  // Admin check
  const isAdmin = req.headers['x-admin-auth'] === process.env.ADMIN_SECRET;
  if (!isAdmin) {
    throw new APIError(401, 'Unauthorized', 'UNAUTHORIZED');
  }

  // Supabase check
  let supabaseStatus = 'green';
  try {
    const { error } = await supabaseAdmin.from('restaurant_invitations').select('id').limit(1);
    if (error) supabaseStatus = 'red';
  } catch {
    supabaseStatus = 'red';
  }

  // Stripe check
  let stripeStatus = 'green';
  try {
    await stripe.customers.list({ limit: 1 });
  } catch {
    stripeStatus = 'red';
  }

  // Auth check (optional, try to list users)
  let authStatus = 'green';
  try {
    // This will fail if not using service role key
    const { error } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1 });
    if (error) authStatus = 'red';
  } catch {
    authStatus = 'red';
  }

  res.status(200).json({
    success: true,
    systems: {
      supabase: supabaseStatus,
      stripe: stripeStatus,
      auth: authStatus,
    },
  });
}); 