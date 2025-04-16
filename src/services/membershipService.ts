import { supabase } from '../supabase';
import { stripeService } from './stripeService';
import type { MembershipTier } from '../types';

export const membershipService = {
  async createMembershipTier(
    tierData: Omit<MembershipTier, 'id'>, 
    restaurantId: string
  ): Promise<MembershipTier> {
    try {
      // If we already have stripe IDs (reconnecting scenario), use them
      if (tierData.stripe_product_id && tierData.stripe_price_id) {
        const { data, error } = await supabase
          .from('membership_tiers')
          .insert([{
            name: tierData.name,
            price: tierData.price,
            description: tierData.description || '',
            restaurant_id: restaurantId,
            stripe_product_id: tierData.stripe_product_id,
            stripe_price_id: tierData.stripe_price_id,
            created_at: new Date().toISOString(),
          }])
          .select()
          .single();
          
        if (error) throw new Error(`Tier creation failed: ${error.message}`);
        return data;
      }

      // Otherwise create new Stripe product & price via API
      const response = await fetch('/api/membership-tiers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: tierData.name,
          price: tierData.price,
          description: tierData.description || '',
          restaurant_id: restaurantId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create membership tier');
      }

      const createdTier = await response.json();
      return createdTier;
    } catch (error: any) {
      console.error('Error creating membership tier:', error);
      throw error;
    }
  },
  
  async updateMembershipTier(tierData: MembershipTier): Promise<MembershipTier> {
    try {
      // Update through API to ensure Stripe syncing
      const response = await fetch('/api/membership-tiers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tierData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update membership tier');
      }

      const updatedTier = await response.json();
      return updatedTier;
    } catch (error: any) {
      console.error('Error updating membership tier:', error);
      throw error;
    }
  },
  
  async getMembershipTiersByRestaurant(restaurantId: string): Promise<MembershipTier[]> {
    try {
      const { data, error } = await supabase
        .from('membership_tiers')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('price', { ascending: true });
      
      if (error) throw new Error(`Failed to fetch tiers: ${error.message}`);
      return data || [];
    } catch (error: any) {
      console.error('Error fetching membership tiers:', error);
      throw error;
    }
  },
  
  async getMembershipTierById(tierId: string): Promise<MembershipTier> {
    try {
      const { data, error } = await supabase
        .from('membership_tiers')
        .select('*')
        .eq('id', tierId)
        .single();
      
      if (error) throw new Error(`Failed to fetch tier: ${error.message}`);
      return data;
    } catch (error: any) {
      console.error('Error fetching membership tier:', error);
      throw error;
    }
  },
};
