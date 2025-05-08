import { VercelRequest, VercelResponse } from '@vercel/node';
import { withErrorHandler, APIError } from './utils/error-handler';
import { supabase } from './utils/supabase';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-02-24.acacia',
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
    const { error } = await supabase.from('restaurant_invites').select('id').limit(1);
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
    const { error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 });
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