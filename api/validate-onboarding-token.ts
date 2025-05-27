import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/types/supabase';
import { corsMiddleware } from './utils/supabase';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing required Supabase environment variables');
}

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Apply CORS middleware
  await corsMiddleware(req, res);
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token } = req.query;

    if (!token || typeof token !== 'string') {
      return res.status(400).json({
        error: 'Missing token',
        message: 'Onboarding token is required'
      });
    }

    // Get the token data
    const { data: tokenData, error: tokenError } = await supabase
      .from('onboarding_tokens')
      .select('*')
      .eq('token', token)
      .single();

    if (tokenError || !tokenData) {
      return res.status(404).json({
        error: 'Token not found',
        message: 'The onboarding token does not exist'
      });
    }

    // Check if token has expired
    const now = new Date();
    const expiresAt = new Date(tokenData.expires_at);
    if (now > expiresAt) {
      // Update token status to expired if not already
      if (tokenData.status !== 'expired') {
        await supabase
          .from('onboarding_tokens')
          .update({ status: 'expired', updated_at: new Date().toISOString() })
          .eq('id', tokenData.id);
      }

      return res.status(400).json({
        error: 'Token expired',
        message: 'The onboarding token has expired'
      });
    }

    // Check token status
    if (tokenData.status === 'expired') {
      return res.status(400).json({
        error: 'Token expired',
        message: 'The onboarding token has expired'
      });
    }

    if (tokenData.status === 'business_created') {
      return res.status(400).json({
        error: 'Token already used',
        message: 'This onboarding token has already been used to create a business'
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        email: tokenData.email,
        expiresAt: tokenData.expires_at,
        status: tokenData.status,
        stripePriceId: tokenData.stripe_price_id
      }
    });

  } catch (error: any) {
    console.error('Error validating onboarding token:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}