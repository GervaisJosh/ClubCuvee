import { supabase } from '../supabase';
import type { Restaurant, RestaurantFormData } from '../types';

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
};
