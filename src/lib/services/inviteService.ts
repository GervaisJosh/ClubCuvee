import { supabase } from '../../lib/supabase';
import { randomUUID } from 'crypto';

export interface InviteMetadata {
  token: string;
  email: string;
  tier: string;
  created_at: string;
  expires_at: string;
  used: boolean;
}

export async function createInvite(email: string, tier: string): Promise<InviteMetadata> {
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

export async function validateInviteToken(token: string): Promise<InviteMetadata> {
  const { data, error } = await supabase
    .from('restaurant_invites')
    .select('*')
    .eq('token', token)
    .single();

  if (error || !data) {
    throw new Error('Invalid or missing invite token');
  }

  if (data.used) {
    throw new Error('Invite token has already been used');
  }

  if (new Date(data.expires_at) < new Date()) {
    throw new Error('Invite token has expired');
  }

  return data as InviteMetadata;
}

export async function markInviteUsed(token: string): Promise<void> {
  const { error } = await supabase
    .from('restaurant_invites')
    .update({ used: true })
    .eq('token', token);

  if (error) {
    throw new Error('Failed to mark invite as used: ' + error.message);
  }
} 