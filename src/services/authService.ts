import { supabase } from '../supabase';
import type { CustomerFormData, RestaurantFormData } from '../types';

export const authService = {
  // Restaurant admin signup
  async restaurantSignUp(data: RestaurantFormData, restaurantId: string): Promise<{
    user: any;
    error: Error | null;
  }> {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.adminName,
            restaurant_id: restaurantId,
            role: 'admin',
          },
        },
      });

      if (error) throw error;
      if (!authData.user) throw new Error('User creation failed');
      
      return { user: authData.user, error: null };
    } catch (error: any) {
      console.error('Error during restaurant signup:', error);
      return { user: null, error };
    }
  },

  // Customer signup
  async customerSignUp(data: CustomerFormData, restaurantId: string): Promise<{
    user: any;
    customerId?: string;
    error: Error | null;
  }> {
    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            restaurant_id: restaurantId,
            phone: data.phone || '',
            role: 'customer',
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('User creation failed');

      // 2. Create customer record
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .insert([
          {
            user_id: authData.user.id,
            restaurant_id: restaurantId,
            name: data.fullName,
            email: data.email,
            phone: data.phone || '',
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (customerError) throw customerError;

      return {
        user: authData.user,
        customerId: customerData.id,
        error: null,
      };
    } catch (error: any) {
      console.error('Error during customer signup:', error);
      return { user: null, error };
    }
  },

  // Login for both restaurant admins and customers
  async login(email: string, password: string): Promise<{
    user: any;
    error: Error | null;
  }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // The user profile will be created automatically by AuthContext
      // via the getUserProfileByAuthId function after login
      
      return { user: data.user, error: null };
    } catch (error: any) {
      console.error('Error during login:', error);
      return { user: null, error };
    }
  },

  // Get current session
  async getCurrentSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  // Get current user
  async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },

  // Logout
  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  },
};
