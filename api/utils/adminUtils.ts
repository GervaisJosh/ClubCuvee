import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Admin Client
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

/**
 * Sets the is_admin flag for a user
 * @param userId The user ID to update
 * @param isAdmin Boolean indicating whether the user should be an admin
 * @returns Object with success status and data/error message
 */
export const setUserAdminStatus = async (userId: string, isAdmin: boolean) => {
  try {
    // Update the user profile
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({ is_admin: isAdmin })
      .eq('local_id', userId) // Changed from 'id' to 'local_id'
      .select()
      .single();
    
    if (error) {
      return { 
        success: false, 
        error: `Failed to update admin status: ${error.message}` 
      };
    }
    
    return {
      success: true,
      data
    };
  } catch (error: any) {
    return {
      success: false,
      error: `An unexpected error occurred: ${error.message}`
    };
  }
};

/**
 * Checks if a user is an admin by auth ID
 * @param authId The auth user ID to check
 * @returns Object with isAdmin status and error message if applicable
 */
export const checkUserAdminStatus = async (authId: string) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('is_admin')
      .eq('auth_id', authId) // Use auth_id to match the auth user
      .single();
    
    if (error) {
      return { 
        success: false, 
        isAdmin: false,
        error: `Failed to check admin status: ${error.message}` 
      };
    }
    
    return {
      success: true,
      isAdmin: !!data?.is_admin
    };
  } catch (error: any) {
    return {
      success: false,
      isAdmin: false,
      error: `An unexpected error occurred: ${error.message}`
    };
  }
};