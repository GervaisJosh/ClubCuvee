import { stripe } from '../utils/stripeClient';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { validateRequest } from '../utils/validation';
import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Create a Stripe checkout session for subscription payments
 */
export async function createCheckoutSession(req: VercelRequest, res: VercelResponse) {
  try {
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
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.errors,
      });
    }
    
    if (!tierId && !priceId && !createPrice) {
      return res.status(400).json({
        error: 'Either tierId, priceId, or createPrice must be provided'
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
      } catch (err) {
        console.error('Error creating price:', err);
        return res.status(500).json({
          error: 'Failed to create price'
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
        return res.status(404).json({
          error: tierError?.message || 'Tier not found'
        });
      }
      
      if (!tier.stripe_price_id) {
        return res.status(400).json({
          error: 'This membership tier is not properly configured for payments'
        });
      }
      
      finalPriceId = tier.stripe_price_id;
    } else {
      return res.status(400).json({
        error: 'Invalid request configuration'
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
    
    return res.status(200).json({ id: session.id });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    return createCheckoutSession(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
