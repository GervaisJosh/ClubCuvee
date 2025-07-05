import { NavigateFunction } from 'react-router-dom';
import { getUserProfile } from '../api/supabaseQueries';
import { User } from '@supabase/supabase-js';

/**
 * Redirects a user to the appropriate dashboard based on their role
 * @param userId The user's ID
 * @param navigate The navigate function from useNavigate
 * @param fallbackPath Optional fallback path if role check fails
 */
export const redirectBasedOnRole = async (
  userId: string,
  navigate: NavigateFunction,
  fallbackPath: string = '/customer/dashboard',
  targetPath?: string
): Promise<void> => {
  try {
    if (!userId) {
      navigate('/login');
      return;
    }

    const profile = await getUserProfile(userId);
    
    // If the user has a specific target path, check if they can access it
    if (targetPath) {
      // Admin-only path check
      if (targetPath.startsWith('/admin') && !profile?.is_admin) {
        navigate(getHomePathFromProfile(profile));
        return;
      }
      
      // Business-only path check
      if (targetPath.startsWith('/business')) {
        const metadata = profile?.user_metadata || {};
        const hasRestaurantId = Boolean(metadata.restaurant_id || profile?.restaurant_id);
        const isBusinessRole = metadata.role === 'restaurant_admin' || metadata.role === 'business_owner';
        
        if (!hasRestaurantId && !isBusinessRole) {
          navigate(getHomePathFromProfile(profile));
          return;
        }
      }
      
      // If user can access the target path, navigate there
      navigate(targetPath);
      return;
    }
    
    // No specific target, do normal role-based redirection
    navigate(getHomePathFromProfile(profile));
  } catch (error) {
    console.error('Error redirecting based on role:', error);
    navigate(fallbackPath); // Default redirect if profile fetch fails
  }
};

/**
 * Determines the appropriate home path based on user profile
 * @param profile The user profile
 * @returns The appropriate home path
 */
export const getHomePathFromProfile = (profile: any | null): string => {
  if (!profile) {
    return '/login';
  }
  
  // Admin check
  if (profile.is_admin) {
    return '/admin/dashboard';
  }
  
  // Business owner check
  const metadata = profile.user_metadata || {};
  const hasRestaurantId = Boolean(metadata.restaurant_id || profile.restaurant_id);
  const isBusinessRole = metadata.role === 'restaurant_admin' || metadata.role === 'business_owner';
  
  if (hasRestaurantId || isBusinessRole) {
    return '/business/dashboard';
  }
  
  // Default to customer
  return '/customer/dashboard';
};

/**
 * Determines the appropriate home path based on user role
 * @param user The authenticated user object
 * @param isAdmin Whether the user has admin privileges
 * @returns The appropriate home path
 */
export const getHomePath = (user: User | null, isAdmin: boolean): string => {
  if (!user) {
    return '/login';
  }
  
  if (isAdmin) {
    return '/admin/dashboard';
  }
  
  // Business role check
  const metadata = user.user_metadata || {};
  const hasRestaurantId = Boolean(metadata.restaurant_id);
  const isBusinessRole = metadata.role === 'restaurant_admin' || metadata.role === 'business_owner';
  
  if (hasRestaurantId || isBusinessRole) {
    return '/business/dashboard';
  }
  
  return '/customer/dashboard';
};

/**
 * Redirects to the home page based on user role
 * @param navigate The navigate function from useNavigate
 * @param user The authenticated user object
 * @param isAdmin Whether the user has admin privileges
 */
export const redirectToHome = (
  navigate: NavigateFunction,
  user: User | null,
  isAdmin: boolean
): void => {
  const homePath = getHomePath(user, isAdmin);
  navigate(homePath);
};