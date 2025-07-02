import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { ZodError } from 'zod';
import { randomUUID } from 'crypto';

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

interface CustomerTierData {
  name: string;
  description: string;
  monthlyPrice: number;
  benefits: string[];
}

interface StripeProductUpdate {
  tierId: string;
  stripeProductId: string;
  stripePriceId: string;
}

interface BusinessFormData {
  businessName: string;
  businessOwnerName: string;
  email: string;
  password: string;
  confirmPassword: string;
  businessAddress: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  website: string;
  description: string;
  customerTiers: CustomerTierData[];
}

export default withErrorHandler(async (req: VercelRequest, res: VercelResponse): Promise<void> => {
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

  // Initialize Stripe client
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia',
    typescript: true,
  });

  if (req.method !== 'POST') {
    throw new APIError(405, 'Method not allowed', 'METHOD_NOT_ALLOWED');
  }

  const { token, sessionId, businessData }: {
    token: string;
    sessionId: string;
    businessData: BusinessFormData;
  } = req.body;

  if (!token || !sessionId || !businessData) {
    throw new APIError(400, 'Token, sessionId, and businessData are required', 'VALIDATION_ERROR');
  }

  try {
    // 1. Validate the invitation token and verify payment was completed
    const { data: invite, error: inviteError } = await supabaseAdmin
      .from('restaurant_invitations')
      .select('id, restaurant_name, email, tier, expires_at, status, payment_session_id')
      .eq('token', token)
      .single();

    if (inviteError || !invite) {
      console.error('Error fetching invitation details:', inviteError);
      throw new APIError(404, 'Invalid invitation token', 'NOT_FOUND');
    }

    if (invite.status !== 'paid') {
      throw new APIError(400, 'Payment must be completed before creating business', 'PAYMENT_REQUIRED');
    }

    if (invite.payment_session_id !== sessionId) {
      throw new APIError(400, 'Session ID does not match invitation', 'VALIDATION_ERROR');
    }

    // 2. Verify the Stripe session exists and subscription is active
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session || session.payment_status !== 'paid') {
      throw new APIError(400, 'Invalid or incomplete payment session', 'PAYMENT_INCOMPLETE');
    }

    const subscriptionId = session.subscription as string;
    if (!subscriptionId) {
      throw new APIError(400, 'No subscription found for this session', 'NO_SUBSCRIPTION');
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    if (subscription.status !== 'active') {
      throw new APIError(400, 'Subscription is not active', 'SUBSCRIPTION_INACTIVE');
    }

    // 3. Get the pricing tier information
    const { data: pricingTier, error: tierError } = await supabaseAdmin
      .from('business_pricing_tiers')
      .select('id, name, stripe_price_id')
      .eq('stripe_price_id', subscription.items.data[0]?.price.id)
      .eq('is_active', true)
      .single();

    if (tierError || !pricingTier) {
      console.error('Error fetching pricing tier:', tierError);
      throw new APIError(400, 'Unable to determine pricing tier', 'TIER_NOT_FOUND');
    }

    // 4. Validate business data
    if (!businessData.businessName?.trim() || !businessData.businessOwnerName?.trim() || 
        !businessData.email?.trim() || !businessData.password?.trim()) {
      throw new APIError(400, 'Missing required business information', 'VALIDATION_ERROR');
    }

    if (businessData.password !== businessData.confirmPassword) {
      throw new APIError(400, 'Passwords do not match', 'VALIDATION_ERROR');
    }

    if (!businessData.customerTiers || businessData.customerTiers.length === 0) {
      throw new APIError(400, 'At least one customer tier is required', 'VALIDATION_ERROR');
    }

    // Validate each customer tier
    for (const tier of businessData.customerTiers) {
      if (!tier.name?.trim() || !tier.description?.trim()) {
        throw new APIError(400, 'Customer tier name and description are required', 'VALIDATION_ERROR');
      }
      if (tier.monthlyPrice < 10 || tier.monthlyPrice > 999) {
        throw new APIError(400, 'Customer tier price must be between $10 and $999', 'VALIDATION_ERROR');
      }
      if (!tier.benefits || tier.benefits.filter(b => b.trim()).length === 0) {
        throw new APIError(400, 'Each customer tier must have at least one benefit', 'VALIDATION_ERROR');
      }
    }

    // 5. Create the admin user account in Supabase Auth
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: businessData.email,
      password: businessData.password,
      email_confirm: true,
      user_metadata: {
        full_name: businessData.businessOwnerName,
        is_admin: true,
        business_name: businessData.businessName
      }
    });

    if (authError || !authUser.user) {
      console.error('Error creating auth user:', authError);
      throw new APIError(400, authError?.message || 'Failed to create user account', 'AUTH_ERROR');
    }

    // 6. Create the business record with slug
    const businessId = randomUUID();
    
    // Generate URL-friendly slug from business name
    const baseSlug = businessData.businessName.trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    // Make slug unique by adding a random suffix if needed
    const businessSlug = `${baseSlug}-${businessId.substring(0, 4)}`;
    
    const { error: businessError } = await supabaseAdmin
      .from('businesses')
      .insert({
        id: businessId,
        name: businessData.businessName.trim(),
        slug: businessSlug,
        owner_id: authUser.user.id,
        email: businessData.email.trim(),
        phone: businessData.phone?.trim() || null,
        website: businessData.website?.trim() || null,
        description: businessData.description?.trim() || null,
        business_address: businessData.businessAddress?.trim() || null,
        city: businessData.city?.trim() || null,
        state: businessData.state?.trim() || null,
        zip_code: businessData.zipCode?.trim() || null,
        pricing_tier_id: pricingTier.id,
        stripe_customer_id: subscription.customer as string,
        stripe_subscription_id: subscriptionId,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('id')
      .single();

    if (businessError) {
      console.error('Error creating business:', businessError);
      // Clean up the auth user if business creation fails
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      throw new APIError(500, 'Failed to create business record', 'DATABASE_ERROR');
    }

    // 7. Create the business admin user profile
    const { error: profileError } = await supabaseAdmin
      .from('business_users')
      .insert({
        auth_id: authUser.user.id,
        business_id: businessId,
        email: businessData.email.trim(),
        full_name: businessData.businessOwnerName.trim(),
        role: 'admin',
        is_active: true
      });

    if (profileError) {
      console.error('Error creating business user profile:', profileError);
      // Clean up created records if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      await supabaseAdmin.from('businesses').delete().eq('id', businessId);
      throw new APIError(500, 'Failed to create business user profile', 'DATABASE_ERROR');
    }

    // 8. Create membership tiers for this business
    const tierInserts = businessData.customerTiers.map((tier, index) => ({
      business_id: businessId,
      name: tier.name.trim(),
      description: tier.description.trim(),
      monthly_price_cents: Math.round(tier.monthlyPrice * 100),
      benefits: tier.benefits.filter(b => b.trim()).map(b => b.trim()), // Store benefits as JSONB array
      is_active: true
    }));

    console.log('📝 Creating membership tiers:', tierInserts);

    const { data: createdTiers, error: tiersError } = await supabaseAdmin
      .from('membership_tiers')
      .insert(tierInserts)
      .select();

    if (tiersError || !createdTiers) {
      console.error('❌ Error creating membership tiers:', tiersError);
      // Clean up created records if tier creation fails
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      await supabaseAdmin.from('businesses').delete().eq('id', businessId);
      throw new APIError(500, 'Failed to create membership tiers', 'DATABASE_ERROR');
    }
    
    console.log('✅ Created tiers:', createdTiers);

    // 9. Create Stripe products and prices for each tier
    const stripeProductUpdates: StripeProductUpdate[] = [];
    console.log('🔄 Creating Stripe products for', createdTiers.length, 'tiers');
    
    for (const tier of createdTiers) {
      try {
        console.log(`📦 Creating Stripe product for tier: ${tier.name} (ID: ${tier.id})`);
        
        // Create branded Stripe product
        const product = await stripe.products.create({
          name: `${businessData.businessName.trim()} Wine Club - ${tier.name}`,
          description: `${tier.description} | Curated by ${businessData.businessName.trim()}`,
          metadata: {
            platform: 'Club Cuvée',
            business_id: tier.business_id,
            tier_id: tier.id,
            business_name: businessData.businessName.trim()
          }
        });
        
        console.log(`✅ Created Stripe product: ${product.id}`);

        // Create recurring monthly price
        const price = await stripe.prices.create({
          product: product.id,
          unit_amount: tier.monthly_price_cents,
          currency: 'usd',
          recurring: {
            interval: 'month',
          },
          metadata: {
            business_id: tier.business_id,
            tier_name: tier.name,
            business_name: businessData.businessName.trim()
          }
        });
        
        console.log(`✅ Created Stripe price: ${price.id}`);

        // Queue update for Supabase record
        stripeProductUpdates.push({
          tierId: tier.id,
          stripeProductId: product.id,
          stripePriceId: price.id
        });

      } catch (stripeError) {
        console.error(`❌ Stripe product creation failed for tier ${tier.name}:`, stripeError);
        // Continue with business creation - allow manual Stripe setup later
        // Don't throw error to avoid blocking the entire onboarding process
      }
    }

    // 10. Update Supabase records with Stripe IDs
    console.log('🔄 Updating', stripeProductUpdates.length, 'tiers with Stripe IDs');
    
    for (const update of stripeProductUpdates) {
      try {
        console.log(`📝 Updating tier ${update.tierId} with Stripe IDs:`, {
          stripe_product_id: update.stripeProductId,
          stripe_price_id: update.stripePriceId
        });
        
        const { data: updateData, error: updateError } = await supabaseAdmin
          .from('membership_tiers')
          .update({
            stripe_product_id: update.stripeProductId,
            stripe_price_id: update.stripePriceId
          })
          .eq('id', update.tierId)
          .select();
          
        if (updateError) {
          console.error(`❌ Failed to update tier ${update.tierId} with Stripe IDs:`, updateError);
          console.error('Update error details:', updateError);
        } else {
          console.log(`✅ Successfully updated tier ${update.tierId}:`, updateData);
        }
      } catch (updateError) {
        console.error(`❌ Exception updating tier ${update.tierId}:`, updateError);
        // Log but continue - the tier exists, just without Stripe integration
      }
    }

    // 11. Mark the invitation as completed
    console.log('🔄 Updating invitation status to completed for token:', token);
    const { error: invitationUpdateError } = await supabaseAdmin
      .from('restaurant_invitations')
      .update({
        status: 'completed',
        business_id: businessId,
        updated_at: new Date().toISOString()
      })
      .eq('token', token);

    if (invitationUpdateError) {
      console.error('❌ Error updating invitation status:', invitationUpdateError);
      // Don't throw error - business was created successfully, just log the issue
    } else {
      console.log('✅ Successfully updated invitation status to completed');
    }

    // 12. Return success response
    res.status(200).json({
      success: true,
      data: {
        businessId: businessId,
        businessSlug: businessSlug,
        adminUserId: authUser.user.id,
        businessName: businessData.businessName,
        customerTiersCreated: tierInserts.length,
        stripeProductsCreated: stripeProductUpdates.length,
        stripeIntegrationComplete: stripeProductUpdates.length === createdTiers.length
      }
    });

  } catch (err) {
    if (err instanceof Stripe.errors.StripeError) {
      throw new APIError(400, err.message, 'STRIPE_ERROR');
    }
    throw err;
  }
});