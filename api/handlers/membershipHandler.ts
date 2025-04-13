import { stripe } from '../utils/stripeClient';
import { supabaseAdmin } from '../utils/supabaseAdmin';
import { validateRequest, validatePrice } from '../utils/validation';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export async function createMembershipTier(req: VercelRequest, res: VercelResponse) {
  try {
    const { name, price, description, restaurant_id } = req.body;
    
    // Validate request
    const validation = validateRequest(
      req.body,
      ['name', 'price', 'restaurant_id'],
      {
        price: (value) => 
          validatePrice(value) 
            ? null 
            : { field: 'price', message: 'Price must be a positive number' },
      }
    );
    
    if (!validation.isValid) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.errors,
      });
    }
    
    // Get restaurant info
    const { data: restaurant, error: restaurantError } = await supabaseAdmin
      .from('restaurants')
      .select('name')
      .eq('id', restaurant_id)
      .single();
      
    if (restaurantError) {
      return res.status(404).json({
        error: `Restaurant not found: ${restaurantError.message}`,
      });
    }
    
    // Create Stripe product with restaurant context
    const product = await stripe.products.create({
      name: `${restaurant.name} - ${name}`,
      description: description || `${name} membership tier`,
      metadata: { 
        restaurant_id,
      }
    });
    
    // Create price for the product
    const stripePrice = await stripe.prices.create({
      product: product.id,
      unit_amount: Math.round(parseFloat(price) * 100),
      currency: 'usd',
      recurring: { interval: 'month' },
      metadata: { 
        restaurant_id,
      }
    });
    
    // Store in Supabase
    const { data: tier, error } = await supabaseAdmin
      .from('membership_tiers')
      .insert([{
        name,
        price: parseFloat(price),
        description: description || '',
        restaurant_id,
        stripe_product_id: product.id,
        stripe_price_id: stripePrice.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();
      
    if (error) {
      // If database operation fails, we should clean up Stripe resources
      try {
        await stripe.prices.update(stripePrice.id, { active: false });
        await stripe.products.update(product.id, { active: false });
      } catch (cleanupError) {
        console.error('Error cleaning up Stripe resources:', cleanupError);
      }
      
      return res.status(500).json({
        error: `Database error: ${error.message}`,
      });
    }
    
    // Update Stripe metadata with tier_id now that we have it
    try {
      await stripe.products.update(product.id, {
        metadata: { tier_id: tier.id, restaurant_id },
      });
      
      await stripe.prices.update(stripePrice.id, {
        metadata: { tier_id: tier.id, restaurant_id },
      });
    } catch (metadataError) {
      console.error('Error updating Stripe metadata:', metadataError);
      // Non-critical error, continue
    }
    
    return res.status(200).json(tier);
  } catch (error: any) {
    console.error('Error creating membership tier:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error',
    });
  }
}

export async function updateMembershipTier(req: VercelRequest, res: VercelResponse) {
  try {
    const { id, name, price, description, restaurant_id, stripe_product_id, stripe_price_id } = req.body;
    
    // Validate request
    const validation = validateRequest(
      req.body,
      ['id', 'name', 'price', 'restaurant_id'],
      {
        price: (value) => 
          validatePrice(value) 
            ? null 
            : { field: 'price', message: 'Price must be a positive number' },
      }
    );
    
    if (!validation.isValid) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.errors,
      });
    }
    
    // Verify the tier exists and belongs to this restaurant (security check)
    const { data: existingTier, error: fetchError } = await supabaseAdmin
      .from('membership_tiers')
      .select('*')
      .eq('id', id)
      .eq('restaurant_id', restaurant_id)
      .single();
      
    if (fetchError) {
      return res.status(404).json({
        error: `Tier not found: ${fetchError.message}`,
      });
    }
    
    // Prepare tier data for update
    const priceNumber = parseFloat(price);
    const updateData = {
      name,
      price: priceNumber,
      description: description || '',
      updated_at: new Date().toISOString(),
    };
    
    // Update Stripe if we have Stripe IDs
    if (stripe_product_id && stripe_price_id) {
      // Check what needs to be updated in Stripe
      const hasNameChanged = existingTier.name !== name;
      const hasDescriptionChanged = existingTier.description !== description;
      const hasPriceChanged = parseFloat(existingTier.price) !== priceNumber;
      
      try {
        // 1. Update product if name or description changed
        if (hasNameChanged || hasDescriptionChanged) {
          // Get restaurant info for product name
          const { data: restaurant } = await supabaseAdmin
            .from('restaurants')
            .select('name')
            .eq('id', restaurant_id)
            .single();
          
          await stripe.products.update(stripe_product_id, {
            name: `${restaurant.name} - ${name}`,
            description: description || `${name} membership tier`,
          });
        }
        
        // 2. Handle price update if needed
        if (hasPriceChanged) {
          // Stripe doesn't allow updating prices, so we create a new one
          // and mark the old one as inactive
          
          // Archive the old price
          await stripe.prices.update(stripe_price_id, {
            active: false,
          });
          
          // Create new price
          const newPrice = await stripe.prices.create({
            product: stripe_product_id,
            unit_amount: Math.round(priceNumber * 100),
            currency: 'usd',
            recurring: { interval: 'month' },
            metadata: {
              restaurant_id,
              tier_id: id,
            },
          });
          
          // Update our data object with new price ID
          updateData.stripe_price_id = newPrice.id;
        }
      } catch (stripeError: any) {
        console.error('Stripe update error:', stripeError);
        // Continue with Supabase update, but include warning
        return res.status(200).json({
          warning: `Stripe update failed: ${stripeError.message}`,
          tier: existingTier,
        });
      }
    }
    
    // Update the tier in Supabase
    const { data: updatedTier, error: updateError } = await supabaseAdmin
      .from('membership_tiers')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (updateError) {
      return res.status(500).json({
        error: `Failed to update tier: ${updateError.message}`,
      });
    }
    
    return res.status(200).json(updatedTier);
  } catch (error: any) {
    console.error('Error updating membership tier:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error',
    });
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    return createMembershipTier(req, res);
  } else if (req.method === 'PUT') {
    return updateMembershipTier(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
