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
    const { invitationToken, tierId, stripePriceId } = req.body;

    if (!invitationToken || !tierId || !stripePriceId) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'invitationToken, tierId, and stripePriceId are required'
      });
    }

    // Validate the invitation token
    const { data: invitation, error: inviteError } = await supabase
      .from('customer_invitations')
      .select(`
        *,
        businesses!inner(id, name)
      `)
      .eq('token', invitationToken)
      .eq('status', 'pending')
      .single();

    if (inviteError || !invitation) {
      return res.status(404).json({
        error: 'Invalid invitation',
        message: 'Invitation not found or not valid'
      });
    }

    // Check if invitation has expired
    const now = new Date();
    const expiresAt = new Date(invitation.expires_at);
    if (now > expiresAt) {
      return res.status(400).json({
        error: 'Invitation expired',
        message: 'The invitation has expired'
      });
    }

    // Verify the tier belongs to this business and matches the price ID
    const { data: tier, error: tierError } = await supabase
      .from('membership_tiers')
      .select('*')
      .eq('id', tierId)
      .eq('business_id', invitation.business_id)
      .eq('stripe_price_id', stripePriceId)
      .eq('is_active', true)
      .single();

    if (tierError || !tier) {
      return res.status(400).json({
        error: 'Invalid tier',
        message: 'The selected tier is not valid for this business'
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      customer_email: invitation.email,
      success_url: `${process.env.VITE_APP_URL || 'http://localhost:3000'}/customer/membership-success?session_id={CHECKOUT_SESSION_ID}&token=${invitationToken}`,
      cancel_url: `${process.env.VITE_APP_URL || 'http://localhost:3000'}/join/${invitationToken}?canceled=true`,
      metadata: {
        invitation_token: invitationToken,
        business_id: invitation.business_id,
        tier_id: tierId,
        customer_email: invitation.email,
        customer_type: 'private_invitation'
      },
      subscription_data: {
        metadata: {
          invitation_token: invitationToken,
          business_id: invitation.business_id,
          tier_id: tierId,
          customer_email: invitation.email,
          customer_type: 'private_invitation'
        },
      },
      allow_promotion_codes: true,
    });

    // Update invitation with Stripe session ID
    const { error: updateError } = await supabase
      .from('customer_invitations')
      .update({
        updated_at: new Date().toISOString()
      })
      .eq('id', invitation.id);

    if (updateError) {
      console.error('Error updating invitation:', updateError);
      // Don't fail the request for this
    }

    return res.status(200).json({
      success: true,
      data: {
        sessionId: session.id,
        checkoutUrl: session.url,
        businessName: invitation.businesses.name,
        tierName: tier.name
      }
    });

  } catch (error: any) {
    console.error('Error creating private customer checkout session:', error);

    // Handle specific Stripe errors
    if (error.type === 'StripeCardError') {
      return res.status(400).json({
        error: 'Payment error',
        message: error.message
      });
    }

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