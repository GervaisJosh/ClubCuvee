import { supabase } from '../supabase';
export const getUserProfile = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();
        if (error) {
            if (error.code === 'PGRST116') {
                console.log('User profile not found, creating a new one');
                return createDefaultUserProfile(userId);
            }
            throw error;
        }
        return data;
    }
    catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }
};
const createDefaultUserProfile = async (userId) => {
    const defaultProfile = {
        email: '',
        wine_tier: 1,
        first_name: '',
        last_name: '',
        preferences: {},
    };
    try {
        // First, check if the user already exists
        const { data: existingUser, error: checkError } = await supabase
            .from('users')
            .select('id')
            .eq('id', userId)
            .single();
        if (checkError && checkError.code !== 'PGRST116') {
            throw checkError;
        }
        if (existingUser) {
            // If the user exists, update their profile instead of creating a new one
            const { data, error } = await supabase
                .from('users')
                .update(defaultProfile)
                .eq('id', userId)
                .select()
                .single();
            if (error)
                throw error;
            return data;
        }
        else {
            // If the user doesn't exist, create a new profile
            const { data, error } = await supabase
                .from('users')
                .insert({ id: userId, ...defaultProfile })
                .select()
                .single();
            if (error)
                throw error;
            return data;
        }
    }
    catch (error) {
        console.error('Error creating/updating default user profile:', error);
        return null;
    }
};
export const updateUserProfile = async (userId, updates) => {
    const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
    if (error) {
        console.error('Error updating user profile:', error);
        return null;
    }
    return data;
};
export const createUser = async (userData) => {
    const { data, error } = await supabase
        .from('users')
        .insert(userData)
        .select()
        .single();
    if (error) {
        console.error('Error creating user:', error);
        return null;
    }
    return data;
};
