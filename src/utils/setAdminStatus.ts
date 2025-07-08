import { createClient } from '@supabase/supabase-js';

// This utility requires Supabase service role key to modify app_metadata
// It should be run from a secure backend environment, not from the frontend

export async function setAdminStatus(userId: string, isAdmin: boolean) {
  // Service role key is required to modify app_metadata
  const supabaseUrl = process.env.SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing required Supabase credentials for admin operations');
  }

  // Create admin client with service role key
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  // Update user's app_metadata
  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
    userId,
    {
      app_metadata: { is_admin: isAdmin }
    }
  );

  if (error) {
    console.error('Error updating admin status:', error);
    throw error;
  }

  console.log(`Successfully updated admin status for user ${userId} to ${isAdmin}`);
  return data;
}

// Example usage (from a secure backend):
// await setAdminStatus('user-uuid-here', true);