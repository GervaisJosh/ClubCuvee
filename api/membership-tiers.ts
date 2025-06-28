import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { ZodError } from 'zod';

// Inline error handling (no external dependencies)
class APIError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

const setCommonHeaders = (res: VercelResponse) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
};

const errorHandler = (
  error: unknown,
  req: VercelRequest,
  res: VercelResponse
) => {
  console.error('API Error:', error);
  setCommonHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (error instanceof APIError) {
    return res.status(error.statusCode).json({
      status: 'error',
      error: {
        message: error.message,
        code: error.code,
      },
    });
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      status: 'error',
      error: {
        message: 'Validation error',
        code: 'VALIDATION_ERROR',
        details: error.errors,
      },
    });
  }

  if (error instanceof Error && error.name === 'StripeError') {
    return res.status(400).json({
      status: 'error',
      error: {
        message: error.message,
        code: 'STRIPE_ERROR',
      },
    });
  }

  return res.status(500).json({
    status: 'error',
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_ERROR',
    },
  });
};

const withErrorHandler = (
  handler: (req: VercelRequest, res: VercelResponse) => Promise<void>
) => {
  return async (req: VercelRequest, res: VercelResponse) => {
    try {
      setCommonHeaders(res);
      if (req.method === 'OPTIONS') {
        return res.status(204).end();
      }
      await handler(req, res);
    } catch (error) {
      errorHandler(error, req, res);
    }
  };
};

const handler = async (req: VercelRequest, res: VercelResponse) => {
  // Create Supabase admin client directly in the API (no external dependencies)
  const supabaseAdmin = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  // Initialize Stripe client directly in the API
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia',
    typescript: true,
  });

  // Handle GET request to fetch pricing tiers
  if (req.method === 'GET') {
    // Get all business pricing tiers
    const { data: pricingTiers, error: tiersError } = await supabaseAdmin
      .from('business_pricing_tiers')
      .select('id, name, monthly_price_cents, stripe_price_id, description, is_active')
      .eq('is_active', true)
      .order('monthly_price_cents', { ascending: true });

    if (tiersError) {
      console.error('Error fetching pricing tiers:', tiersError);
      throw new APIError(500, 'Failed to fetch pricing tiers', 'DATABASE_ERROR');
    }

    // Format pricing tiers for frontend
    const formattedTiers = pricingTiers.map(tier => ({
      id: tier.id,
      name: tier.name,
      price: (tier.monthly_price_cents / 100).toFixed(2),
      price_cents: tier.monthly_price_cents,
      stripe_price_id: tier.stripe_price_id,
      description: tier.description || '',
    }));

    res.status(200).json({
      success: true,
      data: formattedTiers
    });
    return;
  }

  // Only allow POST (create) and PUT (update) requests for other operations
  if (req.method !== 'POST' && req.method !== 'PUT') {
    throw new APIError(405, 'Method not allowed', 'METHOD_NOT_ALLOWED');
  }

  const {
    id,               // Optional: If updating an existing tier
    name,             // Required: Tier name
    price,            // Required: Monthly price
    description,      // Optional: Tier description
    restaurant_id,    // Required: ID of the parent restaurant
  } = req.body;

  // Validate required fields
  if (!name || !price || !restaurant_id) {
    throw new APIError(400, 'Missing required fields: name, price, and restaurant_id are required', 'VALIDATION_ERROR');
  }

  // Validate price format
  const priceNumber = parseFloat(price);
  if (isNaN(priceNumber) || priceNumber <= 0) {
    throw new APIError(400, 'Price must be a positive number', 'VALIDATION_ERROR');
  }

  // Get restaurant info for product metadata/description
  const { data: restaurant, error: restaurantError } = await supabaseAdmin
    .from('restaurants')
    .select('name')
    .eq('id', restaurant_id)
    .single();

  if (restaurantError) {
    console.error('Error fetching restaurant:', restaurantError);
    throw new APIError(404, `Restaurant not found: ${restaurantError.message}`, 'NOT_FOUND');
  }

  // If restaurant doesn't exist, return error
  if (!restaurant) {
    throw new APIError(404, `Restaurant with ID ${restaurant_id} not found`, 'NOT_FOUND');
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
      throw new APIError(404, `Tier not found: ${fetchError.message}`, 'NOT_FOUND');
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
      throw new APIError(500, `Failed to update tier: ${updateError.message}`, 'DATABASE_ERROR');
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
      throw new APIError(500, `Failed to create tier: ${insertError.message}`, 'DATABASE_ERROR');
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
    res.status(200).json({
      tier,
      warning: `Tier saved but Stripe integration failed: ${stripeError.message}`
    });
    return;
  }

  // Return the tier with stripe_price_id & stripe_product_id
  res.status(200).json(tier);
};

export default withErrorHandler(handler);