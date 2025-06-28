import { createClient } from '@supabase/supabase-js';
import { APIError } from './error-handler';

if (!process.env.SUPABASE_URL) {
  throw new Error('SUPABASE_URL is required');
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is required');
}

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export const getRestaurantInvite = async (token: string) => {
  const { data, error } = await supabase
    .from('restaurant_invitations')
    .select('*')
    .eq('token', token)
    .single();

  if (error) {
    throw new APIError(500, 'Failed to fetch restaurant invitation', 'DATABASE_ERROR');
  }

  if (!data) {
    throw new APIError(404, 'Invitation not found', 'INVITATION_NOT_FOUND');
  }

  return data;
};

export const createRestaurant = async (data: {
  name: string;
  email: string;
  subscription_id: string;
  membership_tier: string;
}) => {
  const { data: restaurant, error } = await supabase
    .from('restaurants')
    .insert([data])
    .select()
    .single();

  if (error) {
    throw new APIError(500, 'Failed to create restaurant', 'DATABASE_ERROR');
  }

  return restaurant;
};

export const updateRestaurantInvite = async (token: string, data: {
  status: 'accepted' | 'expired' | 'in_progress';
  accepted_at?: string;
}) => {
  const { error } = await supabase
    .from('restaurant_invitations')
    .update(data)
    .eq('token', token);

  if (error) {
    throw new APIError(500, 'Failed to update restaurant invitation', 'DATABASE_ERROR');
  }
}; 