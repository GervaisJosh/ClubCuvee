import { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { withErrorHandler, APIError } from './utils/error-handler';
import { validateInviteToken, markInviteUsed } from '../src/lib/services/inviteService';
import { registerUserWithSupabase, createBusinessRecord, assignBusinessRole, RegistrationData } from '../src/lib/services/registrationService';
import { createStripeCustomerAndSubscription } from '../src/lib/services/stripeService';

const registrationSchema = z.object({
  token: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  tier: z.string().min(1),
  contact: z.string().min(1),
  wineInventorySize: z.number().int().min(0),
});

export default withErrorHandler(async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  if (req.method !== 'POST') {
    throw new APIError(405, 'Method not allowed', 'METHOD_NOT_ALLOWED');
  }

  const body = registrationSchema.safeParse(req.body);
  if (!body.success) {
    throw new APIError(400, 'Invalid request data', 'VALIDATION_ERROR');
  }

  const { token, email, password, name, tier, contact, wineInventorySize } = body.data;

  // 1. Validate invite token
  const invite = await validateInviteToken(token);
  if (invite.email !== email) {
    throw new APIError(400, 'Invite email does not match registration email', 'EMAIL_MISMATCH');
  }
  if (invite.tier !== tier) {
    throw new APIError(400, 'Invite tier does not match registration tier', 'TIER_MISMATCH');
  }

  // 2. Register user in Supabase Auth
  const user = await registerUserWithSupabase(email, password);
  if (!user) {
    throw new APIError(500, 'Failed to create user', 'USER_CREATION_FAILED');
  }

  // 3. Create business record
  const business = await createBusinessRecord({ email, password, name, tier, contact, wineInventorySize }, user.id);

  // 4. Assign business role
  await assignBusinessRole(user.id, 'business');

  // 5. Mark invite as used
  await markInviteUsed(token);

  // 6. Create Stripe customer and subscription
  await createStripeCustomerAndSubscription(email, tier);

  // 7. Return dashboard URL
  res.status(201).json({ success: true, dashboardUrl: '/business/dashboard' });
}); 