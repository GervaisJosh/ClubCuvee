import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/types/supabase';
import { corsMiddleware } from './utils/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-09-30.acacia',
});

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing required Supabase environment variables');
}

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Apply CORS middleware
  await corsMiddleware(req, res);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token, sessionId } = req.body;

    if (!token || !sessionId) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Token and sessionId are required'
      });
    }

    // Get the onboarding token data
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

    // Verify the session ID matches
    if (tokenData.stripe_session_id !== sessionId) {
      return res.status(400).json({
        error: 'Session mismatch',
        message: 'The session ID does not match the token'
      });
    }

    // Get the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status !== 'paid') {
      return res.status(400).json({
        error: 'Payment not completed',
        message: 'The payment has not been completed'
      });
    }

    // Get the subscription from Stripe
    const subscriptionId = session.subscription as string;
    if (!subscriptionId) {
      return res.status(400).json({
        error: 'No subscription found',
        message: 'No subscription found in the checkout session'
      });
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // Update token status to payment completed
    const { error: updateError } = await supabase
      .from('onboarding_tokens')
      .update({
        status: 'payment_completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', tokenData.id);

    if (updateError) {
      console.error('Error updating token status:', updateError);
    }

    return res.status(200).json({
      success: true,
      data: {
        subscription: {
          id: subscription.id,
          status: subscription.status,
          currentPeriodEnd: subscription.current_period_end,
        },
        tokenData: {
          email: tokenData.email,
        }
      }
    });

  } catch (error: any) {
    console.error('Error verifying subscription:', error);

    // Handle specific Stripe errors
    if (error.type === 'StripeInvalidRequestError') {
      return res.status(400).json({
        error: 'Invalid request',
        message: error.message
      });
    }

    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}