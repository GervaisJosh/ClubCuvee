import { supabase } from '../supabase';
import Stripe from 'stripe';
import type { Restaurant, RestaurantInvitation, MembershipTier } from '../types';

// Validate required environment variables
const requiredEnvVars = {
  VITE_STRIPE_PUBLIC_KEY: import.meta.env.VITE_STRIPE_PUBLIC_KEY,
};

Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

// Initialize Stripe with the public key
const stripe = new Stripe(requiredEnvVars.VITE_STRIPE_PUBLIC_KEY, {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
  maxNetworkRetries: 3,
});

// Interfaces for service operations
interface OnboardingResult {
  success: boolean;
  restaurantId?: string;
  error?: string;
  stripeProductIds?: {
    productId: string;
    priceId: string;
    tier: string;
  }[];
}

interface RestaurantCreationData {
  name: string;
  website?: string;
  admin_email: string;
  logo_url?: string;
}

interface MembershipTierConfig {
  name: string;
  price: string; // Always as string, convert to number for Stripe
  description: string;
}

// Business Onboarding Service
export const BusinessOnboardingService = {
  /**
   * Validates an invitation token and checks if it's still valid
   */
  async validateInvitationToken(token: string): Promise<RestaurantInvitation | null> {
    try {
      const { data, error } = await supabase
        .from('restaurant_invitations')
        .select('*')
        .eq('token', token)
        .single();

      if (error) {
        console.error('Error validating invitation token:', error);
        return null;
      }

      // Check if invitation is still valid (not expired or already used)
      if (!data || data.status !== 'pending') {
        return null;
      }

      // Check if invitation has expired
      const now = new Date();
      const expiryDate = new Date(data.expires_at);

      if (now > expiryDate) {
        // Update status to expired
        await supabase
          .from('restaurant_invitations')
          .update({ 
            status: 'expired',
            updated_at: new Date().toISOString()
          })
          .eq('token', token);
          
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in validateInvitationToken:', error);
      return null;
    }
  },

  /**
   * Complete the restaurant onboarding process
   * This is the main method that orchestrates the 4-step process
   */
  async completeOnboarding(
    token: string, 
    restaurantData: RestaurantCreationData,
    membershipTiers: MembershipTierConfig[],
    pricingTier: string
  ): Promise<OnboardingResult> {
    let restaurantId: string | undefined;
    let stripeProductIds: { productId: string; priceId: string; tier: string }[] = [];
    let rollbackNeeded = false;
    
    try {
      // Step 1: Validate the invitation token
      const invitation = await this.validateInvitationToken(token);
      if (!invitation) {
        return { 
          success: false, 
          error: 'Invalid or expired invitation token' 
        };
      }

      // Step 2: Create the restaurant record with the business pricing tier
      const { data: restaurant, error: restaurantError } = await supabase
        .from('restaurants')
        .insert([{
          name: restaurantData.name,
          website: restaurantData.website || '',
          admin_email: restaurantData.admin_email,
          logo_url: restaurantData.logo_url || null,
          subscription_tier: pricingTier, // Store the business pricing tier
          created_at: new Date().toISOString(),
          registration_complete: false,
        }])
        .select()
        .single();

      if (restaurantError || !restaurant) {
        return { 
          success: false, 
          error: `Failed to create restaurant: ${restaurantError?.message || 'Unknown error'}` 
        };
      }

      restaurantId = restaurant.id;
      rollbackNeeded = true;

      // Step 3: Create Stripe products and prices for customer-facing membership tiers
      stripeProductIds = await Promise.all(membershipTiers.map(async (tier) => {
        // Create product in Stripe with restaurant branding
        const product = await stripe.products.create({
          name: `${restaurant.name} - ${tier.name} Membership`,
          description: tier.description,
          metadata: {
            restaurant_id: restaurantId!,
            restaurant_name: restaurant.name,
            tier_type: tier.name.toLowerCase().replace(/\s+/g, '_')
          }
        });

        // Create price for the product
        const price = await stripe.prices.create({
          product: product.id,
          unit_amount: Math.round(parseFloat(tier.price) * 100), // Convert to cents
          currency: 'usd',
          recurring: {
            interval: 'month' // Default to monthly
          },
          metadata: {
            restaurant_id: restaurantId!,
            tier_name: tier.name
          }
        });

        return {
          productId: product.id,
          priceId: price.id,
          tier: tier.name
        };
      }));

      // Step 4: Store customer-facing membership tiers in Supabase
      const tiersToInsert = membershipTiers.map((tier, index) => ({
        name: tier.name,
        price: tier.price,
        description: tier.description,
        restaurant_id: restaurantId,
        stripe_product_id: stripeProductIds[index].productId,
        stripe_price_id: stripeProductIds[index].priceId,
        created_at: new Date().toISOString()
      }));

      const { error: tierError } = await supabase
        .from('membership_tiers')
        .insert(tiersToInsert);

      if (tierError) {
        throw new Error(`Failed to store membership tiers: ${tierError.message}`);
      }

      // Update the invitation status
      await supabase
        .from('restaurant_invitations')
        .update({
          status: 'completed',
          restaurant_id: restaurantId,
          updated_at: new Date().toISOString()
        })
        .eq('token', token);

      // Mark restaurant registration as complete
      await supabase
        .from('restaurants')
        .update({
          registration_complete: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', restaurantId);

      return {
        success: true,
        restaurantId,
        stripeProductIds
      };
    } catch (error: any) {
      console.error('Error in completeOnboarding:', error);
      
      // Perform rollback if needed
      if (rollbackNeeded) {
        await this.rollbackOnboarding(restaurantId!, stripeProductIds);
      }
      
      return {
        success: false,
        error: error.message || 'An error occurred during onboarding'
      };
    }
  },

  /**
   * If something fails during onboarding, roll back all changes
   */
  async rollbackOnboarding(restaurantId: string, stripeProductIds: { productId: string; priceId: string; tier: string }[]) {
    try {
      // Delete Stripe products and prices
      await Promise.all(stripeProductIds.map(async ({ productId }) => {
        try {
          await stripe.products.del(productId);
        } catch (error) {
          console.error(`Failed to delete Stripe product ${productId}:`, error);
        }
      }));

      // Delete restaurant record from Supabase
      const { error: restaurantError } = await supabase
        .from('restaurants')
        .delete()
        .eq('id', restaurantId);

      if (restaurantError) {
        console.error('Failed to delete restaurant record:', restaurantError);
      }

      // Delete associated membership tiers
      const { error: tierError } = await supabase
        .from('membership_tiers')
        .delete()
        .eq('restaurant_id', restaurantId);

      if (tierError) {
        console.error('Failed to delete membership tiers:', tierError);
      }

      // Update invitation status to failed
      const { error: inviteError } = await supabase
        .from('restaurant_invitations')
        .update({
          status: 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('restaurant_id', restaurantId);

      if (inviteError) {
        console.error('Failed to update invitation status:', inviteError);
      }
    } catch (error) {
      console.error('Error during rollback:', error);
      throw new Error('Failed to complete rollback: ' + (error as Error).message);
    }
  },

  /**
   * Retrieves business pricing tiers available for restaurants
   */
  async getBusinessPricingTiers(): Promise<string[]> {
    return [
      'NeighborhoodCellar',
      'EstablishedShop', 
      'PremiumCollection',
      'LuxuryVintage'
    ];
  },

  /**
   * Validates that a pricing tier is valid
   */
  validatePricingTier(tier: string): boolean {
    const validTiers = [
      'NeighborhoodCellar',
      'EstablishedShop', 
      'PremiumCollection',
      'LuxuryVintage'
    ];
    
    return validTiers.includes(tier);
  },

  /**
   * Retrieves a restaurant by ID
   */
  async getRestaurantById(id: string): Promise<Restaurant | null> {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) {
      console.error('Error fetching restaurant:', error);
      return null;
    }
    
    return data;
  },
  
  /**
   * Gets all membership tiers for a restaurant
   */
  async getRestaurantMembershipTiers(restaurantId: string): Promise<MembershipTier[]> {
    const { data, error } = await supabase
      .from('membership_tiers')
      .select('*')
      .eq('restaurant_id', restaurantId);
    
    if (error) {
      console.error('Error fetching membership tiers:', error);
      return [];
    }
    
    return data || [];
  },

  /**
   * Gets information about a business pricing tier
   */
  getBusinessPricingTierInfo(pricingTier: string): {
    name: string;
    monthlyPrice: string;
    description: string;
  } {
    // Define pricing tier details
    const pricingTiers: Record<string, { name: string; monthlyPrice: string; description: string }> = {
      'NeighborhoodCellar': {
        name: 'Neighborhood Cellar',
        monthlyPrice: '199.00',
        description: 'Perfect for smaller wine bars with limited selections'
      },
      'EstablishedShop': {
        name: 'Established Shop',
        monthlyPrice: '349.00',
        description: 'For mid-size establishments with growing wine programs'
      },
      'PremiumCollection': {
        name: 'Premium Collection',
        monthlyPrice: '599.00',
        description: 'For restaurants with extensive wine lists and sommelier services'
      },
      'LuxuryVintage': {
        name: 'Luxury Vintage',
        monthlyPrice: '999.00',
        description: 'For high-end establishments with rare wines and collector selections'
      }
    };
    
    return pricingTiers[pricingTier] || pricingTiers['EstablishedShop']; // Default to mid-tier if invalid
  }
};

export default BusinessOnboardingService;