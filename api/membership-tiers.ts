import type { VercelRequest, VercelResponse } from '@vercel/node';
import { stripe } from './utils/stripeClient';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withErrorHandling, sendApiError } from './utils/errorHandler';

const handler = async (req: VercelRequest, res: VercelResponse) => {
  // Only allow POST (create) and PUT (update) requests
  if (req.method !== 'POST' && req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      id,               // Optional: If updating an existing tier
      name,             // Required: Tier name
      price,            // Required: Monthly price
      description,      // Optional: Tier description
      restaurant_id,    // Required: ID of the parent restaurant
      stripe_price_id,  // Optional: Existing Stripe price ID (if reconnecting)
      stripe_product_id // Optional: Existing Stripe product ID (if reconnecting)
    } = req.body;

    // Validate required fields
    if (!name || !price || !restaurant_id) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, price, and restaurant_id are required' 
      });
    }

    // Validate price format
    const priceNumber = parseFloat(price);
    if (isNaN(priceNumber) || priceNumber <= 0) {
      return res.status(400).json({
        error: 'Price must be a positive number'
      });
    }

    // Get restaurant info for product metadata/description
    const { data: restaurant, error: restaurantError } = await supabaseAdmin
      .from('restaurants')
      .select('name')
      .eq('id', restaurant_id)
      .single();

    if (restaurantError) {
      console.error('Error fetching restaurant:', restaurantError);
      return res.status(404).json({ 
        error: `Restaurant not found: ${restaurantError.message}` 
      });
    }

    // If restaurant doesn't exist, return error
    if (!restaurant) {
      return res.status(404).json({ 
        error: `Restaurant with ID ${restaurant_id} not found` 
      });
    }

    // Prepare tier data for database
    const tierData = {
      name,
      price: priceNumber.toString(), // Store as string in database
      description: description || '',
      restaurant_id,
      updated_at: new Date().toISOString()
    };

    let tier: any;
    let existingTier: any = null;

    // UPDATE FLOW: If ID is provided, update an existing tier
    if (id) {
      // First fetch the existing tier
      const { data: fetchedTier, error: fetchError } = await supabaseAdmin
        .from('membership_tiers')
        .select('*')
        .eq('id', id)
        .eq('restaurant_id', restaurant_id) // Security check
        .single();
        
      if (fetchError) {
        return res.status(404).json({ 
          error: `Tier not found: ${fetchError.message}` 
        });
      }
      
      existingTier = fetchedTier;
      
      // Update the tier in Supabase
      const { data: updatedTier, error: updateError } = await supabaseAdmin
        .from('membership_tiers')
        .update(tierData)
        .eq('id', id)
        .select()
        .single();
      
      if (updateError) {
        return res.status(500).json({ 
          error: `Failed to update tier: ${updateError.message}` 
        });
      }
      
      tier = updatedTier;
    } 
    // CREATE FLOW: Insert a new tier
    else {
      // Create a new tier in Supabase
      const { data: newTier, error: insertError } = await supabaseAdmin
        .from('membership_tiers')
        .insert([{
          ...tierData,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (insertError) {
        return res.status(500).json({ 
          error: `Failed to create tier: ${insertError.message}` 
        });
      }
      
      tier = newTier;
    }

    // STRIPE INTEGRATION LOGIC
    try {
      // Case 1: Tier already has Stripe IDs
      if (existingTier && existingTier.stripe_product_id && existingTier.stripe_price_id) {
        // Check if we need to update Stripe product
        const hasNameChanged = existingTier.name !== name;
        const hasDescriptionChanged = existingTier.description !== description;
        
        if (hasNameChanged || hasDescriptionChanged) {
          // Update the product details in Stripe
          await stripe.products.update(existingTier.stripe_product_id, {
            name: `${restaurant.name} - ${name}`,
            description: description || `${name} membership tier`
          });
        }
        
        // Check if price has changed
        const hasPriceChanged = parseFloat(existingTier.price) !== priceNumber;
        
        if (hasPriceChanged) {
          // Stripe doesn't allow updating prices, so we create a new one
          // and mark the old one as inactive
          
          // 1. Archive the old price (don't delete it for history)
          await stripe.prices.update(existingTier.stripe_price_id, {
            active: false
          });
          
          // 2. Create new price
          const newPrice = await stripe.prices.create({
            product: existingTier.stripe_product_id,
            unit_amount: Math.round(priceNumber * 100), // Convert to cents
            currency: 'usd',
            recurring: { interval: 'month' },
            metadata: {
              restaurant_id,
              tier_id: tier.id
            }
          });
          
          // 3. Update the tier with the new price ID
          const { error: priceUpdateError } = await supabaseAdmin
            .from('membership_tiers')
            .update({ 
              stripe_price_id: newPrice.id,
              updated_at: new Date().toISOString()
            })
            .eq('id', tier.id);
            
          if (priceUpdateError) {
            console.error('Error updating tier with new price ID:', priceUpdateError);
          }
          
          // Update our return object
          tier.stripe_price_id = newPrice.id;
        }
      }
      // Case 2: Tier needs new Stripe product and price
      else {
        // Create a product in Stripe
        const product = await stripe.products.create({
          name: `${restaurant.name} - ${name}`,
          description: description || `${name} membership tier`,
          metadata: {
            tier_id: tier.id,
            restaurant_id
          }
        });

        // Create a price for the product
        const price = await stripe.prices.create({
          product: product.id,
          unit_amount: Math.round(priceNumber * 100), // Convert to cents
          currency: 'usd',
          recurring: { interval: 'month' },
          metadata: {
            tier_id: tier.id,
            restaurant_id
          }
        });

        // Update the tier with the Stripe IDs
        const { data: updatedTier, error: updateError } = await supabaseAdmin
          .from('membership_tiers')
          .update({ 
            stripe_product_id: product.id,
            stripe_price_id: price.id,
            updated_at: new Date().toISOString()
          })
          .eq('id', tier.id)
          .select()
          .single();
          
        if (updateError) {
          console.error('Error updating tier with Stripe IDs:', updateError);
        } else {
          // Update our return object
          tier = updatedTier;
        }
      }
    } catch (stripeError: any) {
      console.error('Stripe integration error:', stripeError);
      
      // Don't fail the request, but include the error in the response
      return res.status(200).json({
        tier,
        warning: `Tier saved but Stripe integration failed: ${stripeError.message}`
      });
    }

    // Return the tier with stripe_price_id & stripe_product_id
    return res.status(200).json(tier);
  } catch (error: any) {
    console.error('Error processing membership tier:', error);
    return sendApiError(res, error, 500);
  }
}

// Export with error handling wrapper
export default withErrorHandling(handler);