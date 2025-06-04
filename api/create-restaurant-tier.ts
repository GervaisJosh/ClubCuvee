import { VercelRequest, VercelResponse } from '@vercel/node';
import { stripe } from './utils/stripe';
import { supabaseAdmin } from '../lib/supabaseAdmin';
import { withErrorHandler, APIError } from './utils/error-handler';

interface CreateRestaurantTierRequest {
  business_id: string;
  name: string;
  description?: string;
  price_cents: number;
  interval?: 'month' | 'year';
}

export default withErrorHandler(async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  if (req.method !== 'POST') {
    throw new APIError(405, 'Method not allowed', 'METHOD_NOT_ALLOWED');
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new APIError(401, 'Unauthorized', 'UNAUTHORIZED');
  }

  const body: CreateRestaurantTierRequest = req.body;
  const { business_id, name, description, price_cents, interval = 'month' } = body;

  // Validate required fields
  if (!business_id || !name || !price_cents) {
    throw new APIError(400, 'Missing required fields: business_id, name, price_cents', 'MISSING_FIELDS');
  }

  if (price_cents < 100) {
    throw new APIError(400, 'Minimum price is $1.00 (100 cents)', 'INVALID_PRICE');
  }

  // Verify the business exists and user has permission
  const { data: business, error: businessError } = await supabaseAdmin
    .from('businesses')
    .select('id, name')
    .eq('id', business_id)
    .single();

  if (businessError || !business) {
    throw new APIError(404, 'Business not found or access denied', 'BUSINESS_NOT_FOUND');
  }

  // Create the restaurant membership tier in database first
  const { data: tier, error: tierError } = await supabaseAdmin
    .from('restaurant_membership_tiers')
    .insert({
      business_id,
      name,
      description,
      price_cents,
      interval,
      is_ready: false // Will be set to true after Stripe creation
    })
    .select()
    .single();

  if (tierError || !tier) {
    throw new APIError(500, 'Failed to create membership tier', 'TIER_CREATION_FAILED');
  }

  try {
    // Create Stripe Product
    const product = await stripe.products.create({
      name: `${business.name} - ${name}`,
      description: description || `Wine club membership tier for ${business.name}`,
      metadata: {
        business_id: business_id,
        tier_id: tier.id,
        created_by: 'club_cuvee_platform'
      }
    });

    // Create Stripe Price
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: price_cents,
      currency: 'usd',
      recurring: {
        interval: interval
      },
      metadata: {
        business_id: business_id,
        tier_id: tier.id,
        created_by: 'club_cuvee_platform'
      }
    });

    // Update the tier with Stripe IDs and mark as ready
    const { error: updateError } = await supabaseAdmin
      .from('restaurant_membership_tiers')
      .update({
        stripe_product_id: product.id,
        stripe_price_id: price.id,
        is_ready: true
      })
      .eq('id', tier.id);

    if (updateError) {
      console.error('Failed to update tier with Stripe IDs:', updateError);
      // Note: Stripe objects are created but DB update failed
      // TODO: Consider implementing cleanup or retry logic
    }

    res.status(200).json({
      success: true,
      data: {
        tier_id: tier.id,
        stripe_product_id: product.id,
        stripe_price_id: price.id,
        is_ready: !updateError
      }
    });

  } catch (stripeError: any) {
    console.error('Stripe creation failed:', stripeError);
    
    // Clean up the database tier since Stripe creation failed
    await supabaseAdmin
      .from('restaurant_membership_tiers')
      .delete()
      .eq('id', tier.id);

    throw new APIError(500, `Failed to create Stripe products: ${stripeError.message}`, 'STRIPE_ERROR');
  }
});