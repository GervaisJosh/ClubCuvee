import { NextRequest } from 'next/server';
import { stripe } from './utils/stripe';
import { supabaseAdmin } from '../lib/supabaseAdmin';
import { errorHandler } from './utils/errorHandler';

export default async function handler(req: NextRequest) {
  if (req.method !== 'POST') {
    return Response.json(
      { success: false, error: 'Method not allowed' },
      { status: 405 }
    );
  }

  try {
    const body = await req.json();
    const { token, tier_id } = body;

    if (!token) {
      return Response.json(
        { success: false, error: 'Token is required' },
        { status: 400 }
      );
    }

    if (!tier_id) {
      return Response.json(
        { success: false, error: 'Pricing tier ID is required' },
        { status: 400 }
      );
    }

    // Validate the business invitation token
    const { data: tokenValidation, error: validationError } = await supabaseAdmin.rpc('validate_business_invitation_token', {
      p_token: token
    });

    if (validationError || !tokenValidation || tokenValidation.length === 0) {
      return Response.json(
        { success: false, error: 'Invalid or expired business invitation token' },
        { status: 400 }
      );
    }

    const tokenData = tokenValidation[0];
    if (!tokenData.is_valid) {
      return Response.json(
        { success: false, error: 'Business invitation token is not valid' },
        { status: 400 }
      );
    }

    // Get pricing tier details from database
    const { data: tierData, error: tierError } = await supabaseAdmin.rpc('get_pricing_tier_details', {
      p_tier_id: tier_id
    });

    if (tierError || !tierData || tierData.length === 0) {
      return Response.json(
        { success: false, error: 'Invalid pricing tier selected' },
        { status: 400 }
      );
    }

    const selectedTier = tierData[0];

    // Prevent custom tiers from using online checkout
    if (selectedTier.tier_key === 'custom') {
      return Response.json(
        { success: false, error: 'Custom tier requires manual setup. Please contact us directly.' },
        { status: 400 }
      );
    }

    if (!selectedTier.stripe_price_id) {
      return Response.json(
        { success: false, error: 'Pricing tier is not configured for online checkout' },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: selectedTier.stripe_price_id,
          quantity: 1,
        },
      ],
      success_url: `${new URL(req.url).origin}/onboard/${token}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${new URL(req.url).origin}/onboard/${token}?canceled=true`,
      metadata: {
        business_invitation_token: token,
        pricing_tier_id: tier_id,
        pricing_tier_key: selectedTier.tier_key,
        type: 'business_onboarding'
      },
      subscription_data: {
        metadata: {
          business_invitation_token: token,
          pricing_tier_id: tier_id,
          pricing_tier_key: selectedTier.tier_key
        }
      }
    });

    return Response.json({
      success: true,
      data: {
        sessionId: session.id,
        checkoutUrl: session.url,
        tokenData: tokenData,
        selectedTier: selectedTier
      }
    });

  } catch (error) {
    console.error('Error creating business checkout session:', error);
    return errorHandler(error);
  }
}