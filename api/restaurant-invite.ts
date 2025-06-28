import { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { withErrorHandler, APIError } from './utils/error-handler';
import { createInvite } from '../src/lib/services/inviteService';

const createInviteSchema = z.object({
  email: z.string().email(),
  tier: z.string().min(1),
});

const ALLOWED_TIERS = ['Neighborhood Cellar', 'World Class'];

export default withErrorHandler(async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  if (req.method !== 'POST') {
    throw new APIError(405, 'Method not allowed', 'METHOD_NOT_ALLOWED');
  }

  // TODO: Replace with your actual admin authentication check
  const isAdmin = req.headers['x-admin-auth'] === process.env.ADMIN_SECRET;
  if (!isAdmin) {
    throw new APIError(401, 'Unauthorized', 'UNAUTHORIZED');
  }

  const body = createInviteSchema.safeParse(req.body);
  if (!body.success) {
    throw new APIError(400, 'Invalid request data', 'VALIDATION_ERROR');
  }

  const { email, tier } = body.data;
  if (!ALLOWED_TIERS.includes(tier)) {
    throw new APIError(400, 'Invalid tier', 'INVALID_TIER');
  }

  const invite = await createInvite(email, tier);
  const inviteLink = `https://clubcuvee.com/restaurant/register?token=${invite.token}`;
  res.status(201).json({ success: true, inviteLink, expiresAt: invite.expires_at });
});