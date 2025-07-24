import { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import { withErrorHandler, APIError } from './utils/error-handler';

// Inline Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Inline invite interface
interface InviteMetadata {
  token: string;
  email: string;
  tier: string;
  created_at: string;
  expires_at: string;
  used: boolean;
}

// Inline createInvite function
async function createInvite(email: string, tier: string): Promise<InviteMetadata> {
  const token = randomUUID();
  const created_at = new Date();
  const expires_at = new Date(created_at.getTime() + 24 * 60 * 60 * 1000); // 24h

  const { error } = await supabase
    .from('restaurant_invites')
    .insert([
      {
        token,
        email,
        tier,
        created_at: created_at.toISOString(),
        expires_at: expires_at.toISOString(),
        used: false,
      },
    ]);

  if (error) {
    throw new Error('Failed to create invite: ' + error.message);
  }

  return {
    token,
    email,
    tier,
    created_at: created_at.toISOString(),
    expires_at: expires_at.toISOString(),
    used: false,
  };
}

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