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
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        error: 'Missing token',
        message: 'Onboarding token is required'
      });
    }

    // Validate the token and get details
    const { data: tokenData, error: tokenError } = await supabase
      .from('onboarding_tokens')
      .select('*')
      .eq('token', token)
      .eq('status', 'pending')
      .single();

    if (tokenError || !tokenData) {
      return res.status(404).json({
        error: 'Invalid or expired token',
        message: 'The onboarding token is not valid or has expired'
      });
    }

    // Check if token has expired
    const now = new Date();
    const expiresAt = new Date(tokenData.expires_at);
    if (now > expiresAt) {
      // Update token status to expired
      await supabase
        .from('onboarding_tokens')
        .update({ status: 'expired' })
        .eq('id', tokenData.id);

      return res.status(400).json({
        error: 'Token expired',
        message: 'The onboarding token has expired. Please request a new one.'
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: tokenData.stripe_price_id,
          quantity: 1,
        },
      ],
      customer_email: tokenData.email,
      success_url: `${process.env.VITE_APP_URL || 'http://localhost:3000'}/onboard/${token}?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${process.env.VITE_APP_URL || 'http://localhost:3000'}/onboard/${token}?canceled=true`,
      metadata: {
        onboarding_token: token,
        business_email: tokenData.email,
      },
      subscription_data: {
        metadata: {
          onboarding_token: token,
          business_email: tokenData.email,
        },
      },
    });

    // Update the token with the Stripe session ID
    const { error: updateError } = await supabase
      .from('onboarding_tokens')
      .update({
        stripe_session_id: session.id,
        status: 'checkout_created',
        updated_at: new Date().toISOString()
      })
      .eq('id', tokenData.id);

    if (updateError) {
      console.error('Error updating onboarding token:', updateError);
      // Don't fail the request, as the Stripe session was created successfully
    }

    return res.status(200).json({
      success: true,
      data: {
        sessionId: session.id,
        checkoutUrl: session.url,
        tokenData: {
          email: tokenData.email,
          expiresAt: tokenData.expires_at
        }
      }
    });

  } catch (error: any) {
    console.error('Error creating onboarding checkout session:', error);

    // Handle specific Stripe errors
    if (error.type === 'StripeCardError') {
      return res.status(400).json({
        error: 'Payment error',
        message: error.message
      });
    }

    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}