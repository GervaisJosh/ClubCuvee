import { supabase } from '../supabase';

/**
 * Checks if the current user is an admin
 * @returns Object with isAdmin status and any error message
 */
export const checkIsAdmin = async (): Promise<{ isAdmin: boolean; error?: string }> => {
  try {
    // Get the current session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return { isAdmin: false, error: 'Not authenticated' };
    }
    
    // Call the admin API endpoint
    const response = await fetch('/api/admin', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { isAdmin: false, error: data.error || 'Failed to check admin status' };
    }
    
    return { isAdmin: data.isAdmin };
  } catch (error: any) {
    console.error('Error checking admin status:', error);
    return { isAdmin: false, error: error.message };
  }
};

/**
 * Sets admin status for a user
 * @param userId User ID to update
 * @param isAdmin Boolean indicating whether the user should be an admin
 * @returns Object with success status and any error message
 */
export const setAdminStatus = async (
  userId: string,
  isAdmin: boolean
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Get the current session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return { success: false, error: 'Not authenticated' };
    }
    
    // Call the admin API endpoint
    const response = await fetch('/api/admin', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId, isAdmin })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to update admin status' };
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Error setting admin status:', error);
    return { success: false, error: error.message };
  }
};