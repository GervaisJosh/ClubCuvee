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
    const { token, sessionId } = body;

    if (!token || !sessionId) {
      return Response.json(
        { success: false, error: 'Token and session ID are required' },
        { status: 400 }
      );
    }

    // Validate the business invitation token first
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

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return Response.json(
        { success: false, error: 'Checkout session not found' },
        { status: 404 }
      );
    }

    // Verify the session is completed and matches our token
    if (session.payment_status !== 'paid' || session.metadata?.business_invitation_token !== token) {
      return Response.json(
        { success: false, error: 'Payment verification failed' },
        { status: 400 }
      );
    }

    // Get the subscription details
    let subscription = null;
    if (session.subscription) {
      subscription = await stripe.subscriptions.retrieve(session.subscription as string);
    }

    if (!subscription) {
      return Response.json(
        { success: false, error: 'Subscription not found' },
        { status: 404 }
      );
    }

    // Store the temporary business setup data for the business creation process
    const { error: tempDataError } = await supabaseAdmin
      .from('temp_business_setup')
      .upsert({
        invitation_token: token,
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: subscription.id,
        pricing_tier: session.metadata?.pricing_tier || 'neighborhood_cellar',
        setup_completed: false,
        created_at: new Date().toISOString()
      }, {
        onConflict: 'invitation_token'
      });

    if (tempDataError) {
      console.error('Error storing temp business setup data:', tempDataError);
      // Don't fail completely if temp data storage fails
    }

    return Response.json({
      success: true,
      data: {
        subscription: {
          id: subscription.id,
          status: subscription.status,
          currentPeriodEnd: subscription.current_period_end,
          customerId: session.customer
        },
        pricing_tier: session.metadata?.pricing_tier || 'neighborhood_cellar'
      }
    });

  } catch (error) {
    console.error('Error verifying business subscription:', error);
    return errorHandler(error);
  }
}