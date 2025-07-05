import { supabase } from '../supabase';
import { setAdminStatus } from '../services/adminService';

/**
 * This utility function can be used to make the current logged-in user an admin
 * Note: This should only be used by the developer/owner of the application
 */
export const makeCurrentUserAdmin = async (): Promise<{ success: boolean; message: string }> => {
  try {
    // Check if user is logged in
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session || !session.user) {
      return { 
        success: false, 
        message: 'No user is currently logged in. Please log in first.' 
      };
    }
    
    // Make the current user an admin
    const result = await setAdminStatus(session.user.id, true);
    
    if (!result.success) {
      return { 
        success: false, 
        message: `Failed to set admin status: ${result.error}` 
      };
    }
    
    return { 
      success: true, 
      message: `User ${session.user.email} is now an admin. Please refresh the page.` 
    };
  } catch (error: any) {
    console.error('Error making user admin:', error);
    return { 
      success: false, 
      message: `An unexpected error occurred: ${error.message}` 
    };
  }
};

// To use this function, you can run the following in the console:
// import { makeCurrentUserAdmin } from './src/utils/makeAdmin';
// makeCurrentUserAdmin().then(console.log);