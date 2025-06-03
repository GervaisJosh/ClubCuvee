import { NextRequest } from 'next/server';
import { stripe } from './utils/stripe';
import { supabaseAdmin } from '../lib/supabaseAdmin';
import { errorHandler } from './utils/errorHandler';

interface CreateCustomerCheckoutRequest {
  business_id: string;
  tier_id: string;
  customer_email: string;
  customer_name?: string;
}

export default async function handler(req: NextRequest) {
  if (req.method !== 'POST') {
    return Response.json(
      { success: false, error: 'Method not allowed' },
      { status: 405 }
    );
  }

  try {
    const body: CreateCustomerCheckoutRequest = await req.json();
    const { business_id, tier_id, customer_email, customer_name } = body;

    // Validate required fields
    if (!business_id || !tier_id || !customer_email) {
      return Response.json(
        { success: false, error: 'Missing required fields: business_id, tier_id, customer_email' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer_email)) {
      return Response.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Get the business and tier details
    const { data: business, error: businessError } = await supabaseAdmin
      .from('businesses')
      .select('id, name')
      .eq('id', business_id)
      .single();

    if (businessError || !business) {
      return Response.json(
        { success: false, error: 'Business not found' },
        { status: 404 }
      );
    }

    // Get the membership tier details
    const { data: tier, error: tierError } = await supabaseAdmin
      .from('restaurant_membership_tiers')
      .select('*')
      .eq('id', tier_id)
      .eq('business_id', business_id)
      .eq('is_ready', true)
      .single();

    if (tierError || !tier) {
      return Response.json(
        { success: false, error: 'Membership tier not found or not ready for signup' },
        { status: 404 }
      );
    }

    if (!tier.stripe_price_id) {
      return Response.json(
        { success: false, error: 'Membership tier is not configured for online signup' },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: customer_email,
      line_items: [
        {
          price: tier.stripe_price_id,
          quantity: 1,
        },
      ],
      success_url: `${new URL(req.url).origin}/join/${business_id}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${new URL(req.url).origin}/join/${business_id}?canceled=true`,
      metadata: {
        business_id: business_id,
        tier_id: tier_id,
        customer_email: customer_email,
        customer_name: customer_name || '',
        type: 'customer_membership'
      },
      subscription_data: {
        metadata: {
          business_id: business_id,
          tier_id: tier_id,
          customer_email: customer_email,
          customer_name: customer_name || ''
        }
      },
      allow_promotion_codes: true, // Allow customers to use discount codes
      billing_address_collection: 'auto'
    });

    return Response.json({
      success: true,
      data: {
        sessionId: session.id,
        checkoutUrl: session.url,
        business: business,
        tier: {
          id: tier.id,
          name: tier.name,
          description: tier.description,
          price_cents: tier.price_cents,
          interval: tier.interval
        }
      }
    });

  } catch (error) {
    console.error('Error creating customer checkout session:', error);
    return errorHandler(error);
  }
}