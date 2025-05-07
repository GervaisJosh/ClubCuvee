import { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { withErrorHandler } from './utils/error-handler';
import { supabase } from './utils/supabase';
import { APIError } from './utils/error-handler';
import { randomUUID } from 'crypto';

const createInviteSchema = z.object({
  email: z.string().email(),
  restaurantName: z.string().min(1),
  invitedBy: z.string().email(),
});

const validateInviteSchema = z.object({
  token: z.string().uuid(),
});

export default withErrorHandler(async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  if (req.method === 'POST') {
    // Create new invite
    const body = createInviteSchema.parse(req.body);
    
    const token = randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    const { error } = await supabase
      .from('restaurant_invites')
      .insert([{
        token,
        email: body.email,
        restaurant_name: body.restaurantName,
        invited_by: body.invitedBy,
        status: 'pending',
        expires_at: expiresAt.toISOString(),
      }]);

    if (error) {
      throw new APIError(500, 'Failed to create invite', 'DATABASE_ERROR');
    }

    res.status(201).json({ token });
    return;
  }

  if (req.method === 'GET') {
    // Validate invite token
    const { token } = validateInviteSchema.parse(req.query);

    const { data, error } = await supabase
      .from('restaurant_invites')
      .select('*')
      .eq('token', token)
      .single();

    if (error) {
      throw new APIError(500, 'Failed to fetch invite', 'DATABASE_ERROR');
    }

    if (!data) {
      throw new APIError(404, 'Invite not found', 'INVITE_NOT_FOUND');
    }

    if (data.status !== 'pending') {
      throw new APIError(400, 'Invite has already been used', 'INVITE_USED');
    }

    if (new Date(data.expires_at) < new Date()) {
      throw new APIError(400, 'Invite has expired', 'INVITE_EXPIRED');
    }

    res.status(200).json({
      email: data.email,
      restaurantName: data.restaurant_name,
      invitedBy: data.invited_by,
    });
    return;
  }

  throw new APIError(405, 'Method not allowed', 'METHOD_NOT_ALLOWED');
});