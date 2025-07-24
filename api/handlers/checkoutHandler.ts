import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// Inline validation utility
const validateRequest = (body: any, requiredFields: string[]) => {
  const errors: string[] = [];
  
  for (const field of requiredFields) {
    if (!body[field]) {
      errors.push(`${field} is required`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Helper function to send JSON response with proper error handling
 */
function sendJsonResponse(res: VercelResponse, status: number, data: any) {
  try {
    if (!res.headersSent) {
      res.setHeader('Content-Type', 'application/json');
    }
    return res.status(status).json(data);
  } catch (error) {
    console.error('Error sending JSON response:', error);
    if (!res.headersSent) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(500).json({
        status: 'error',
        error: 'Failed to send response',
        message: 'Internal server error'
      });
    }
  }
}

/**
 * Create a Stripe checkout session for subscription payments
 */
export async function createCheckoutSession(req: VercelRequest, res: VercelResponse) {
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
    apiVersion: '2025-06-30.basil',
    typescript: true,
  });

  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  try {
    // Handle preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
      return sendJsonResponse(res, 200, { status: 'success' });
    }

    // Ensure method is POST
    if (req.method !== 'POST') {
      return sendJsonResponse(res, 405, {
        status: 'error',
        error: 'Method not allowed',
        message: 'Only POST requests are allowed',
        allowed_methods: ['POST', 'OPTIONS']
      });
    }

    const {
      tierId,         // ID of membership_tiers row
      priceId,        // Optional: Direct Stripe price ID
      customerId,     // ID from your "customers" table
      customerEmail,  // email for the checkout session
      restaurantId,   // ID of the restaurant
      successUrl,     // Redirect URL on success
      cancelUrl,      // Redirect URL on cancel
      createPrice,    // Whether to create a new price (rare)
      tierData,       // Data for creating a new price (rare)
      metadata,       // Additional metadata for the session
    } = req.body;
    
    // Validation - either tierId or priceId is required
    const validation = validateRequest(
      req.body,
      ['customerId', 'customerEmail', 'restaurantId', 'successUrl', 'cancelUrl']
    );
    
    if (!validation.isValid) {
      return sendJsonResponse(res, 400, {
        status: 'error',
        error: 'Validation failed',
        details: validation.errors,
      });
    }
    
    if (!tierId && !priceId && !createPrice) {
      return sendJsonResponse(res, 400, {
        status: 'error',
        error: 'Invalid request',
        message: 'Either tierId, priceId, or createPrice must be provided'
      });
    }
    
    // If no direct priceId provided, fetch from tier
    let finalPriceId: string;
    let createdPrice = false;
    
    if (priceId) {
      // Direct price ID provided
      finalPriceId = priceId;
    } else if (createPrice && tierData) {
      // Rare case: Create a new price on-the-fly 
      // (mainly for testing or reconnecting scenarios)
      try {
        // Create a temporary product
        const product = await stripe.products.create({
          name: tierData.name || 'Membership',
          description: tierData.description || 'Custom membership tier',
          metadata: {
            restaurant_id: restaurantId,
            customer_id: customerId,
            temporary: 'true'
          }
        });
        
        // Create a price for the product
        const price = await stripe.prices.create({
          product: product.id,
          unit_amount: Math.round(parseFloat(tierData.price as string) * 100),
          currency: 'usd',
          recurring: { interval: 'month' },
          metadata: {
            restaurant_id: restaurantId,
            customer_id: customerId,
            temporary: 'true'
          }
        });
        
        finalPriceId = price.id;
        createdPrice = true;
      } catch (err: any) {
        console.error('Error creating price:', err);
        return sendJsonResponse(res, 500, {
          status: 'error',
          error: 'Failed to create price',
          message: err.message || 'Could not create Stripe price'
        });
      }
    } else if (tierId) {
      // Normal case: Get price ID from tier
      const { data: tier, error: tierError } = await supabaseAdmin
        .from('membership_tiers')
        .select('stripe_price_id')
        .eq('id', tierId)
        .eq('restaurant_id', restaurantId) // Security check
        .single();

      if (tierError || !tier) {
        return sendJsonResponse(res, 404, {
          status: 'error',
          error: 'Tier not found',
          message: tierError?.message || 'Could not find membership tier'
        });
      }
      
      if (!tier.stripe_price_id) {
        return sendJsonResponse(res, 400, {
          status: 'error',
          error: 'Invalid tier configuration',
          message: 'This membership tier is not properly configured for payments'
        });
      }
      
      finalPriceId = tier.stripe_price_id;
    } else {
      return sendJsonResponse(res, 400, {
        status: 'error',
        error: 'Invalid request configuration',
        message: 'Could not determine price ID'
      });
    }
    
    // Create the checkout session
    const sessionMetadata = {
      restaurant_id: restaurantId,
      customer_id: customerId,
      tier_id: tierId || 'custom',
      created_price: createdPrice ? 'true' : 'false',
      ...(metadata || {}) // Spread any additional metadata from the request
    };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: finalPriceId,
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
      metadata: sessionMetadata,
      subscription_data: {
        metadata: {
          restaurant_id: restaurantId,
          customer_id: customerId,
          tier_id: tierId || 'custom',
          ...(metadata || {}) // Also add metadata to subscription
        }
      }
    });
    
    return sendJsonResponse(res, 200, {
      status: 'success',
      id: session.id,
      url: session.url
    });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return sendJsonResponse(res, 500, {
      status: 'error',
      error: 'Internal server error',
      message: error.message || 'Failed to create checkout session'
    });
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    return createCheckoutSession(req, res);
  } else {
    return sendJsonResponse(res, 405, {
      status: 'error',
      error: 'Method not allowed',
      message: 'Only POST requests are allowed',
      allowed_methods: ['POST', 'OPTIONS']
    });
  }
}