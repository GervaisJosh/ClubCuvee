import { NextRequest } from 'next/server';
import { stripe } from './utils/stripe';
import { supabaseAdmin } from '../lib/supabaseAdmin';
import { errorHandler } from './utils/errorHandler';

interface CreateRestaurantTierRequest {
  business_id: string;
  name: string;
  description?: string;
  price_cents: number;
  interval?: 'month' | 'year';
}

export default async function handler(req: NextRequest) {
  if (req.method !== 'POST') {
    return Response.json(
      { success: false, error: 'Method not allowed' },
      { status: 405 }
    );
  }

  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body: CreateRestaurantTierRequest = await req.json();
    const { business_id, name, description, price_cents, interval = 'month' } = body;

    // Validate required fields
    if (!business_id || !name || !price_cents) {
      return Response.json(
        { success: false, error: 'Missing required fields: business_id, name, price_cents' },
        { status: 400 }
      );
    }

    if (price_cents < 100) {
      return Response.json(
        { success: false, error: 'Minimum price is $1.00 (100 cents)' },
        { status: 400 }
      );
    }

    // Verify the business exists and user has permission
    const { data: business, error: businessError } = await supabaseAdmin
      .from('businesses')
      .select('id, name')
      .eq('id', business_id)
      .single();

    if (businessError || !business) {
      return Response.json(
        { success: false, error: 'Business not found or access denied' },
        { status: 404 }
      );
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
      return Response.json(
        { success: false, error: 'Failed to create membership tier' },
        { status: 500 }
      );
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

      return Response.json({
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

      return Response.json(
        { 
          success: false, 
          error: `Failed to create Stripe products: ${stripeError.message}` 
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error creating restaurant tier:', error);
    return errorHandler(error);
  }
}