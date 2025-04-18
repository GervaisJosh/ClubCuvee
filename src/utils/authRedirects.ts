import { NavigateFunction } from 'react-router-dom';
import { getUserProfile } from '../api/supabaseQueries';
import { User } from '@supabase/supabase-js';

/**
 * Redirects a user to the appropriate dashboard based on their admin status
 * @param userId The user's ID
 * @param navigate The navigate function from useNavigate
 * @param fallbackPath Optional fallback path if the admin check fails
 */
export const redirectBasedOnRole = async (
  userId: string,
  navigate: NavigateFunction,
  fallbackPath: string = '/dashboard',
  targetPath?: string
): Promise<void> => {
  try {
    // If we have a specific target path, check if it's an admin path
    if (targetPath && targetPath.startsWith('/admin')) {
      // For admin paths, we need to check if the user is an admin
      const profile = await getUserProfile(userId);
      
      if (profile?.is_admin) {
        // Admin user accessing admin path, allow it
        navigate(targetPath);
      } else {
        // Non-admin user trying to access admin path, redirect to dashboard
        navigate(fallbackPath);
      }
    } else if (targetPath && !targetPath.startsWith('/admin')) {
      // Non-admin path that user was trying to access, allow direct navigation
      navigate(targetPath);
    } else {
      // No specific target, do normal role-based redirection
      const profile = await getUserProfile(userId);
      
      if (profile?.is_admin) {
        navigate('/admin/dashboard');
      } else {
        navigate(fallbackPath);
      }
    }
  } catch (error) {
    console.error('Error redirecting based on role:', error);
    navigate(fallbackPath); // Default redirect if profile fetch fails
  }
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
  
  return isAdmin ? '/admin/dashboard' : '/dashboard';
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