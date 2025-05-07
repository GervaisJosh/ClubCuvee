import { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { withErrorHandler } from './utils/error-handler';
import { createCheckoutSession } from './utils/stripe';
import { getRestaurantInvite, updateRestaurantInvite } from './utils/supabase';
import { APIError } from './utils/error-handler';

const createCheckoutSchema = z.object({
  token: z.string().uuid(),
  membershipTier: z.string(),
});

export default withErrorHandler(async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  if (req.method !== 'POST') {
    throw new APIError(405, 'Method not allowed', 'METHOD_NOT_ALLOWED');
  }

  const { token, membershipTier } = createCheckoutSchema.parse(req.body);

  // Validate invite token
  const invite = await getRestaurantInvite(token);

  // Create Stripe checkout session
  const session = await createCheckoutSession({
    restaurantName: invite.restaurant_name,
    email: invite.email,
    membershipTier,
    successUrl: `${process.env.FRONTEND_URL}/onboarding/${token}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${process.env.FRONTEND_URL}/onboarding/${token}`,
  });

  // Mark invite as in progress
  await updateRestaurantInvite(token, {
    status: 'in_progress',
  });

  res.status(200).json({
    url: session.url,
  });
});