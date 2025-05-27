import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/types/supabase';
import { corsMiddleware } from './utils/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-09-30.acacia',
});

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing required Supabase environment variables');
}

// Create admin client for user creation
const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey);

interface BusinessFormData {
  businessName: string;
  adminName: string;
  adminEmail: string;
  adminPassword: string;
  tiers: {
    name: string;
    description: string;
    priceMarkupPercentage: number;
  }[];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Apply CORS middleware
  await corsMiddleware(req, res);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token, sessionId, businessData }: {
      token: string;
      sessionId: string;
      businessData: BusinessFormData;
    } = req.body;

    if (!token || !sessionId || !businessData) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Token, sessionId, and businessData are required'
      });
    }

    // Validate the onboarding token
    const { data: tokenData, error: tokenError } = await supabaseAdmin
      .from('onboarding_tokens')
      .select('*')
      .eq('token', token)
      .eq('status', 'payment_completed')
      .single();

    if (tokenError || !tokenData) {
      return res.status(404).json({
        error: 'Invalid token',
        message: 'Token not found or payment not completed'
      });
    }

    // Verify the Stripe session and get subscription details
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session.subscription) {
      return res.status(400).json({
        error: 'No subscription found',
        message: 'No subscription found in the checkout session'
      });
    }

    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
    const customer = await stripe.customers.retrieve(session.customer as string);

    // Start a transaction
    const businessId = crypto.randomUUID();

    // 1. Create admin user in Supabase Auth
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: businessData.adminEmail,
      password: businessData.adminPassword,
      email_confirm: true,
      user_metadata: {
        full_name: businessData.adminName,
        role: 'business_admin',
        business_id: businessId
      }
    });

    if (authError || !authUser.user) {
      console.error('Error creating admin user:', authError);
      return res.status(500).json({
        error: 'Failed to create admin user',
        message: authError?.message || 'Unknown error'
      });
    }

    // 2. Create business record
    const { data: business, error: businessError } = await supabaseAdmin
      .from('businesses')
      .insert({
        id: businessId,
        name: businessData.businessName,
        email: businessData.adminEmail,
        admin_user_id: authUser.user.id,
        stripe_customer_id: session.customer as string,
        subscription_status: subscription.status
      })
      .select()
      .single();

    if (businessError) {
      console.error('Error creating business:', businessError);
      // Clean up auth user if business creation failed
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      return res.status(500).json({
        error: 'Failed to create business',
        message: businessError.message
      });
    }

    // 3. Create subscription record
    const { error: subscriptionError } = await supabaseAdmin
      .from('subscriptions')
      .insert({
        business_id: businessId,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: session.customer as string,
        stripe_price_id: tokenData.stripe_price_id,
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
      });

    if (subscriptionError) {
      console.error('Error creating subscription record:', subscriptionError);
      // This is not critical, so we'll log but not fail
    }

    // 4. Create membership tiers and corresponding Stripe products/prices
    const tierInserts = [];
    for (const tierData of businessData.tiers) {
      try {
        // Create Stripe product for this tier
        const product = await stripe.products.create({
          name: `${businessData.businessName} - ${tierData.name}`,
          description: tierData.description,
          metadata: {
            business_id: businessId,
            tier_name: tierData.name,
            markup_percentage: tierData.priceMarkupPercentage.toString()
          }
        });

        // Create a base price (we'll update this when they set up their wine inventory)
        const price = await stripe.prices.create({
          product: product.id,
          unit_amount: 2999, // $29.99 as default monthly price
          currency: 'usd',
          recurring: {
            interval: 'month'
          },
          metadata: {
            business_id: businessId,
            tier_name: tierData.name
          }
        });

        tierInserts.push({
          business_id: businessId,
          name: tierData.name,
          description: tierData.description,
          price_markup_percentage: tierData.priceMarkupPercentage,
          stripe_product_id: product.id,
          stripe_price_id: price.id,
          is_active: true
        });
      } catch (stripeError: any) {
        console.error('Error creating Stripe product/price for tier:', stripeError);
        // Continue with other tiers
      }
    }

    if (tierInserts.length > 0) {
      const { error: tiersError } = await supabaseAdmin
        .from('membership_tiers')
        .insert(tierInserts);

      if (tiersError) {
        console.error('Error creating membership tiers:', tiersError);
        // This is not critical for the basic setup
      }
    }

    // 5. Update onboarding token status
    const { error: updateTokenError } = await supabaseAdmin
      .from('onboarding_tokens')
      .update({
        business_id: businessId,
        status: 'business_created',
        updated_at: new Date().toISOString()
      })
      .eq('id', tokenData.id);

    if (updateTokenError) {
      console.error('Error updating token status:', updateTokenError);
    }

    return res.status(201).json({
      success: true,
      data: {
        businessId: business.id,
        adminUserId: authUser.user.id,
        tiersCreated: tierInserts.length
      }
    });

  } catch (error: any) {
    console.error('Error creating business:', error);

    // Handle specific Stripe errors
    if (error.type?.startsWith('Stripe')) {
      return res.status(400).json({
        error: 'Stripe error',
        message: error.message
      });
    }

    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}