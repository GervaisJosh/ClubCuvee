import { supabase } from '../supabase';
import type { Restaurant, RestaurantFormData, RestaurantInvitation } from '../types';

export const restaurantService = {
  async createRestaurant(data: RestaurantFormData): Promise<Restaurant> {
    // Create restaurant in Supabase
    const { data: restaurant, error } = await supabase
      .from('restaurants')
      .insert([{
        name: data.restaurantName,
        website: data.website || '',
        admin_email: data.email,
        subscription_tier: data.tier || 'basic',
        payment_session_id: data.sessionId || '',
        created_at: new Date().toISOString(),
      }])
      .select()
      .single();
    
    if (error) throw new Error(`Restaurant creation failed: ${error.message}`);
    return restaurant;
  },

  async uploadLogo(restaurantId: string, logoFile: File): Promise<string> {
    try {
      // Get file extension
      const fileExt = logoFile.name.split('.').pop();
      const fileName = `${restaurantId}/logo.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('restaurant-logos')
        .upload(fileName, logoFile, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data } = supabase.storage
        .from('restaurant-logos')
        .getPublicUrl(fileName);

      // Update restaurant with logo URL
      const { error: updateError } = await supabase
        .from('restaurants')
        .update({ logo_url: data.publicUrl })
        .eq('id', restaurantId);

      if (updateError) throw updateError;

      return data.publicUrl;
    } catch (error) {
      console.error('Logo upload error:', error);
      throw new Error('Failed to upload logo');
    }
  },
  
  async getRestaurantById(id: string): Promise<Restaurant> {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw new Error(`Failed to fetch restaurant: ${error.message}`);
    if (!data) throw new Error('Restaurant not found');
    
    return data;
  },
  
  async updateRestaurant(id: string, updateData: Partial<Restaurant>): Promise<Restaurant> {
    const { data, error } = await supabase
      .from('restaurants')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(`Failed to update restaurant: ${error.message}`);
    return data;
  },

  async createInvitation(email: string, restaurantName: string, website?: string, adminName?: string, tier: string = 'standard'): Promise<{ invitationUrl: string, token: string }> {
    try {
      // Check if email already has a pending invitation
      const { data: existingInvitation } = await supabase
        .from('restaurant_invitations')
        .select('token')
        .eq('email', email)
        .eq('status', 'pending')
        .maybeSingle();

      if (existingInvitation) {
        // Return the existing invitation link
        const baseUrl = window.location.origin;
        return {
          token: existingInvitation.token,
          invitationUrl: `${baseUrl}/onboarding/${existingInvitation.token}`
        };
      }

      // Generate a secure token (using crypto API)
      const token = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2);
      
      // Set expiration date (7 days)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      // Store in Supabase
      const { data, error } = await supabase
        .from('restaurant_invitations')
        .insert([{
          token,
          email,
          restaurant_name: restaurantName,
          website: website || '',
          admin_name: adminName || '',
          tier,
          created_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString(),
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw new Error(`Failed to create invitation: ${error.message}`);

      // Generate invitation URL
      const baseUrl = window.location.origin;
      const invitationUrl = `${baseUrl}/onboarding/${token}`;

      return { token, invitationUrl };
    } catch (error) {
      console.error('Error creating invitation:', error);
      throw error;
    }
  },

  async getInvitationByToken(token: string): Promise<RestaurantInvitation | null> {
    try {
      const { data, error } = await supabase
        .from('restaurant_invitations')
        .select('*')
        .eq('token', token)
        .single();

      if (error) {
        console.error('Error fetching invitation:', error);
        return null;
      }

      // Check if invitation has expired
      const now = new Date();
      const expiryDate = new Date(data.expires_at);

      if (now > expiryDate && data.status === 'pending') {
        // Update the status to expired
        await supabase
          .from('restaurant_invitations')
          .update({ status: 'expired' })
          .eq('id', data.id);

        return { ...data, status: 'expired' };
      }

      return data;
    } catch (error) {
      console.error('Error checking invitation:', error);
      return null;
    }
  },

  async updateInvitationStatus(token: string, status: 'accepted' | 'paid' | 'completed' | 'expired', restaurantId?: string): Promise<void> {
    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      };

      if (restaurantId) {
        updateData.restaurant_id = restaurantId;
      }

      const { error } = await supabase
        .from('restaurant_invitations')
        .update(updateData)
        .eq('token', token);

      if (error) throw new Error(`Failed to update invitation status: ${error.message}`);
    } catch (error) {
      console.error('Error updating invitation status:', error);
      throw error;
    }
  }
};