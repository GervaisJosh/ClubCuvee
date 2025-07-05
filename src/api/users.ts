import { supabase } from '../supabase';

export interface User {
  local_id: string; // Primary key in Users table
  auth_id?: string; // Reference to auth.users.id (Supabase auth user ID)
  email: string;
  wine_tier: number;
  first_name: string;
  last_name: string;
  preferences: any;
  created_at: string;
  is_admin?: boolean;
}

export const getUserProfile = async (authUserId: string): Promise<User | null> => {
  try {
    // First try to find by auth_id
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', authUserId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('User profile not found by auth_id, creating a new one');
        return createDefaultUserProfile(authUserId);
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

const createDefaultUserProfile = async (authUserId: string): Promise<User | null> => {
  try {
    // Get auth user data to populate default profile
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Error getting auth user:', authError);
      throw authError;
    }
    
    if (!user || user.id !== authUserId) {
      throw new Error('Auth user not found or mismatch');
    }
    
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
    
    const defaultProfile: Omit<User, 'local_id' | 'created_at'> = {
      auth_id: authUserId, // Store the auth.users.id for future reference
      email: user.email || '',
      wine_tier: 1,
      first_name: firstName,
      last_name: lastName,
      preferences: {},
      is_admin: metadata.role === 'admin' // Set admin flag based on auth metadata
    };

    // Check if user already exists by auth_id
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('local_id')
      .eq('auth_id', authUserId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    if (existingUser) {
      // If the user exists, update their profile instead of creating a new one
      const { data, error } = await supabase
        .from('users')
        .update(defaultProfile)
        .eq('local_id', existingUser.local_id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // If the user doesn't exist, create a new profile
      const { data, error } = await supabase
        .from('users')
        .insert(defaultProfile)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  } catch (error) {
    console.error('Error creating/updating default user profile:', error);
    return null;
  }
}

export const updateUserProfile = async (userId: string, updates: Partial<User>): Promise<User | null> => {
  // First determine if userId is auth_id or local_id
  let query = supabase.from('users');
  
  if (userId.length === 36) { // UUID length check (likely auth_id)
    // Try to find by auth_id first
    const { data: userByAuthId } = await supabase
      .from('users')
      .select('local_id')
      .eq('auth_id', userId)
      .single();
      
    if (userByAuthId) {
      // If found, update by local_id
      query = query.update(updates).eq('local_id', userByAuthId.local_id);
    } else {
      // Fallback to update by local_id
      query = query.update(updates).eq('local_id', userId);
    }
  } else {
    // If not UUID format, assume it's local_id
    query = query.update(updates).eq('local_id', userId);
  }
  
  const { data, error } = await query.select().single();

  if (error) {
    console.error('Error updating user profile:', error);
    return null;
  }

  return data;
}

export const createUser = async (userData: Omit<User, 'local_id' | 'created_at'>): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .insert(userData)
    .select()
    .single()

  if (error) {
    console.error('Error creating user:', error)
    return null
  }

  return data
}