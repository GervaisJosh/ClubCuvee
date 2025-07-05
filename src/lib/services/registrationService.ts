import { supabase } from '../../lib/supabase';

export interface RegistrationData {
  email: string;
  password: string;
  name: string;
  tier: string;
  contact: string;
  wineInventorySize: number;
}

export async function registerUserWithSupabase(email: string, password: string) {
  // This assumes you have a Supabase Auth function available
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) throw new Error('Failed to register user: ' + error.message);
  return data.user;
}

export async function createBusinessRecord({ name, tier, contact, wineInventorySize, email }: RegistrationData, userId: string) {
  const { data, error } = await supabase
    .from('restaurants')
    .insert([
      {
        name,
        tier,
        contact,
        wine_inventory_size: wineInventorySize,
        owner_id: userId,
        email,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();
  if (error) throw new Error('Failed to create business record: ' + error.message);
  return data;
}

export async function assignBusinessRole(userId: string, role: string) {
  // This assumes you have a roles table or mechanism in Supabase
  const { error } = await supabase
    .from('user_roles')
    .insert([
      {
        user_id: userId,
        role,
        created_at: new Date().toISOString(),
      },
    ]);
  if (error) throw new Error('Failed to assign business role: ' + error.message);
} 