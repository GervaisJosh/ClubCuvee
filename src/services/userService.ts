import { supabase } from '../lib/supabase';
import { User } from '../api/users';

/**
 * Ensures a user_stats record exists for a given user
 * Creates one if it doesn't exist
 * Returns true if successful, false if failed
 */
export const ensureUserStatsExists = async (userId: string): Promise<boolean> => {
  try {
    console.log(`Ensuring user_stats exists for user ${userId}...`);
    
    // First verify the user_stats table exists
    try {
      const { count, error: tableCheckError } = await supabase
        .from('user_stats')
        .select('*', { count: 'exact', head: true });
      
      if (tableCheckError) {
        console.error('Error checking user_stats table:', tableCheckError);
        if (tableCheckError.code === '42P01') { // PostgreSQL code for undefined_table
          console.error('CRITICAL: user_stats table does not exist!');
          return false;
        }
      }
      
      console.log(`user_stats table exists, contains ${count} records`);
    } catch (tableError) {
      console.error('Exception checking user_stats table:', tableError);
    }
    
    // Check if stats already exist for this user
    const { data: existingStats, error: checkError } = await supabase
      .from('user_stats')
      .select('id, user_id')
      .eq('user_id', userId)
      .maybeSingle();
    
    // If stats already exist, log and return success
    if (existingStats) {
      console.log(`User stats already exist for user ${userId}, id: ${existingStats.id}`);
      return true;
    }
    
    // Handle error cases
    if (checkError) {
      console.log(`Check error code: ${checkError.code}, message: ${checkError.message}`);
      if (checkError.code !== 'PGRST116') { // Not just "no rows returned"
        console.error('Error checking user_stats:', checkError);
        // Continue anyway to try insertion
      }
    }
    
    console.log(`Creating new user_stats for user ${userId}...`);
    
    // Create default stats for this user with all required fields
    const { data: newStats, error: insertError } = await supabase
      .from('user_stats')
      .upsert({ 
        user_id: userId,
        wines_tasted: 0,
        average_rating: 0,
        upcoming_deliveries: 0,
        next_event: null, // Explicitly set optional fields to null
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, { 
        onConflict: 'user_id',
        returning: 'minimal' // Just get confirmation, not the whole record
      });
    
    if (insertError) {
      console.error('Error creating user_stats:', insertError);
      console.error(`Insert error code: ${insertError.code}, message: ${insertError.message}`);
      
      // Special handling for foreign key violations which might indicate a deeper issue
      if (insertError.code === '23503') { // Foreign key violation
        console.error('CRITICAL: Foreign key violation - user_id may not exist in Users table');
      }
      
      return false;
    } 
    
    console.log(`Successfully created user_stats for user ${userId}`);
    return true;
  } catch (error) {
    console.error('Unhandled error in ensureUserStatsExists:', error);
    return false;
  }
};

/**
 * Ensures a user profile exists in public.users table with proper auth_id mapping
 * Creates a new profile if one doesn't exist with the given auth_id
 * Or updates an existing profile with NULL auth_id if email matches
 */
export const ensureUserProfileExists = async (authUserId: string): Promise<User | null> => {
  try {
    // Get auth user data to populate or update profile
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Error getting auth user:', authError);
      throw authError;
    }
    
    if (!user || user.id !== authUserId) {
      throw new Error('Auth user not found or mismatch');
    }

    const userEmail = user.email || '';
    if (!userEmail) {
      console.error('User has no email address');
      throw new Error('User email not available');
    }

    // Step 1: Check if user profile already exists with this auth_id
    const { data: existingUserWithAuthId, error: checkAuthIdError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', authUserId)
      .single();

    // If user exists with correct auth_id, just return it
    if (existingUserWithAuthId) {
      console.log('User already exists with correct auth_id');
      return existingUserWithAuthId;
    }

    // If error is not "no rows returned", there's a different issue
    if (checkAuthIdError && checkAuthIdError.code !== 'PGRST116') {
      console.error('Error checking for existing user by auth_id:', checkAuthIdError);
      throw checkAuthIdError;
    }

    // Step 2: Check if user profile exists with same email but NULL auth_id
    const { data: existingUserByEmail, error: checkEmailError } = await supabase
      .from('users')
      .select('*')
      .eq('email', userEmail)
      .is('auth_id', null)
      .single();

    // Extract user metadata if available
    const metadata = user.user_metadata || {};
    const name = metadata.full_name || metadata.name || '';
    let firstName = name, lastName = '';
    
    // Try to split name into first and last parts
    if (name.includes(' ')) {
      const nameParts = name.split(' ');
      firstName = nameParts[0];
      lastName = nameParts.slice(1).join(' ');
    }

    // If user exists with NULL auth_id and matching email, update it
    if (existingUserByEmail) {
      console.log('Found existing user by email with NULL auth_id, updating it');
      
      // Only update the auth_id field to avoid overwriting other data
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({ auth_id: authUserId })
        .eq('local_id', existingUserByEmail.local_id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating existing user with auth_id:', updateError);
        throw updateError;
      }

      console.log('Successfully updated user with auth_id');
      
      // Ensure user_stats exists for this user
      await ensureUserStatsExists(existingUserByEmail.local_id);
      
      return updatedUser;
    }

    // Step 3: If no user exists with this auth_id or email, create a new one
    console.log('No existing user found, creating new user profile');
    
    // Construct default profile from auth data
    const defaultProfile: Omit<User, 'local_id' | 'created_at'> = {
      auth_id: authUserId,
      email: userEmail,
      wine_tier: 1,
      first_name: firstName,
      last_name: lastName,
      preferences: {},
      is_admin: metadata.role === 'admin' // Set admin flag based on auth metadata
    };

    // Create new user profile
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert(defaultProfile)
      .select()
      .single();

    if (insertError) {
      // Special handling for 409 Conflict errors - try a direct lookup by email as fallback
      if (insertError.code === '23505' || insertError.status === 409) {
        console.warn('Conflict when creating user, attempting final fallback lookup by email');
        
        // Final fallback: Try to find by email regardless of auth_id status
        const { data: fallbackUser, error: fallbackError } = await supabase
          .from('users')
          .select('*')
          .eq('email', userEmail)
          .single();
          
        if (fallbackError) {
          console.error('Final fallback lookup failed:', fallbackError);
          throw insertError; // Throw original error if fallback also fails
        }
        
        // If the user exists but still has NULL auth_id, update it
        if (fallbackUser && fallbackUser.auth_id === null) {
          const { data: finalUpdatedUser, error: finalUpdateError } = await supabase
            .from('users')
            .update({ auth_id: authUserId })
            .eq('local_id', fallbackUser.local_id)
            .select()
            .single();
            
          if (finalUpdateError) {
            console.error('Error in final auth_id update:', finalUpdateError);
            throw finalUpdateError;
          }
          
          console.log('Successfully updated user with auth_id in final fallback');
          return finalUpdatedUser;
        }
        
        // Ensure user_stats exists for this user even in fallback case
        await ensureUserStatsExists(fallbackUser.local_id);
        
        // Return the user even if we couldn't update auth_id
        return fallbackUser;
      }
      
      console.error('Error creating user profile:', insertError);
      throw insertError;
    }

    console.log('Successfully created new user profile');
    
    // Ensure user_stats exists for this user
    await ensureUserStatsExists(newUser.local_id);
    
    return newUser;
  } catch (error) {
    console.error('Error in ensureUserProfileExists:', error);
    return null;
  }
};

/**
 * Returns user profile by auth_id, creating one if it doesn't exist
 * or updating an existing one with NULL auth_id if email matches
 */
export const getUserProfileByAuthId = async (authUserId: string): Promise<User | null> => {
  try {
    // First try to get existing profile by auth_id
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', authUserId)
      .single();

    // If found directly by auth_id, return it
    if (data) {
      return data;
    }

    // If error is not "no rows returned", log it but continue to try alternatives
    if (error && error.code !== 'PGRST116') {
      console.warn('Error in initial profile lookup:', error);
      // We'll continue to try the ensure function as a fallback
    }

    // If we get here, either there was a PGRST116 error (no rows) or another error
    // In either case, we'll try to ensure a user profile exists
    console.log('User profile not found by auth_id, trying to ensure it exists');
    return ensureUserProfileExists(authUserId);
  } catch (error) {
    console.error('Error in getUserProfileByAuthId:', error);
    return null;
  }
};