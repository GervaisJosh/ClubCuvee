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
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, stripePriceId } = req.body;

    if (!email || !stripePriceId) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Email and stripePriceId are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format'
      });
    }

    // Generate a secure token
    const token = crypto.randomUUID();
    
    // Set expiration to 24 hours from now
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    // Check if there's already a pending token for this email
    const { data: existingToken } = await supabase
      .from('onboarding_tokens')
      .select('*')
      .eq('email', email)
      .eq('status', 'pending')
      .single();

    if (existingToken) {
      // Update the existing token
      const { data, error } = await supabase
        .from('onboarding_tokens')
        .update({
          token,
          stripe_price_id: stripePriceId,
          expires_at: expiresAt.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', existingToken.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating onboarding token:', error);
        return res.status(500).json({
          error: 'Failed to update onboarding token',
          message: error.message
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          token: data.token,
          email: data.email,
          stripePriceId: data.stripe_price_id,
          expiresAt: data.expires_at,
          onboardingUrl: `${process.env.VITE_APP_URL || 'http://localhost:3000'}/onboard/${data.token}`
        }
      });
    }

    // Create new onboarding token
    const { data, error } = await supabase
      .from('onboarding_tokens')
      .insert({
        token,
        email,
        stripe_price_id: stripePriceId,
        expires_at: expiresAt.toISOString(),
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating onboarding token:', error);
      return res.status(500).json({
        error: 'Failed to create onboarding token',
        message: error.message
      });
    }

    return res.status(201).json({
      success: true,
      data: {
        token: data.token,
        email: data.email,
        stripePriceId: data.stripe_price_id,
        expiresAt: data.expires_at,
        onboardingUrl: `${process.env.VITE_APP_URL || 'http://localhost:3000'}/onboard/${data.token}`
      }
    });

  } catch (error: any) {
    console.error('Error in generate-onboarding-token:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}