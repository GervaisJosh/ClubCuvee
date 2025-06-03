import { VercelRequest, VercelResponse } from '@vercel/node';
import { stripe } from './utils/stripe';
import { supabaseAdmin } from '../lib/supabaseAdmin';
import { withErrorHandler, APIError } from './utils/error-handler';

export default withErrorHandler(async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  if (req.method !== 'POST') {
    throw new APIError(405, 'Method not allowed', 'METHOD_NOT_ALLOWED');
  }

  const { token, sessionId } = req.body;

  if (!token || !sessionId) {
    throw new APIError(400, 'Token and session ID are required', 'VALIDATION_ERROR');
  }

  // Validate the business invitation token first
  const { data: tokenValidation, error: validationError } = await supabaseAdmin.rpc('validate_business_invitation_token', {
    p_token: token
  });

  if (validationError || !tokenValidation || tokenValidation.length === 0) {
    throw new APIError(400, 'Invalid or expired business invitation token', 'VALIDATION_ERROR');
  }

  const tokenData = tokenValidation[0];
  if (!tokenData.is_valid) {
    throw new APIError(400, 'Business invitation token is not valid', 'VALIDATION_ERROR');
  }

  // Retrieve the checkout session from Stripe
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (!session) {
    throw new APIError(404, 'Checkout session not found', 'NOT_FOUND');
  }

  // Verify the session is completed and matches our token
  if (session.payment_status !== 'paid' || session.metadata?.business_invitation_token !== token) {
    throw new APIError(400, 'Payment verification failed', 'VALIDATION_ERROR');
  }

  // Get the subscription details
  let subscription = null;
  if (session.subscription) {
    subscription = await stripe.subscriptions.retrieve(session.subscription as string);
  }

  if (!subscription) {
    throw new APIError(404, 'Subscription not found', 'NOT_FOUND');
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

  res.status(200).json({
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
});