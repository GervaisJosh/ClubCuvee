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
  imageUrl?: string;
  imagePath?: string;
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
  logoUrl?: string;
  logoPath?: string;
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
    apiVersion: '2025-06-30.basil',
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
      .select('id, restaurant_name, email, business_id, tier, expires_at, status, payment_session_id')
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

    // 5. Determine business ID first (needed for metadata)
    let businessId = invite.business_id;
    if (!businessId) {
      businessId = randomUUID();
    }
    console.log('Business ID determined:', businessId);

    // 6. Create an auth account for the BUSINESS EMAIL (not the admin)
    // This gives them an auth_id immediately
    console.log('Creating auth account for business email:', businessData.email);
    
    let businessAuthUser: any;
    
    // First, create an auth user for the business email
    // CRITICAL: Must set user_metadata to identify this as a business owner
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: businessData.email.trim(),
      email_confirm: true, // Auto-confirm since admin is creating
      password: businessData.password, // Set the password they provided
      user_metadata: {
        role: 'business',
        user_type: 'business', // Backup identifier
        business_id: businessId, // Now we have the business ID
        name: businessData.businessOwnerName.trim()
      },
      // Ensure no admin metadata unless explicitly set
      app_metadata: {}
    });

    if (authError) {
      // Check if user already exists
      if (authError.message?.includes('already exists')) {
        console.log('Auth user already exists for email, updating metadata...');
        // Get existing user
        const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
        const existingUser = users.find(u => u.email === businessData.email.trim());
        
        if (existingUser) {
          // Update existing user's metadata to mark them as business owner
          const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            existingUser.id,
            { 
              user_metadata: {
                role: 'business',
                user_type: 'business',
                business_id: businessId,
                name: businessData.businessOwnerName.trim()
              },
              // Clear any conflicting app_metadata
              app_metadata: existingUser.app_metadata?.is_admin === true 
                ? existingUser.app_metadata // Keep admin status if they have it
                : {} // Otherwise clear app_metadata
            }
          );
          
          if (updateError) {
            console.error('Error updating user metadata:', updateError);
            throw new APIError(500, 'Failed to update user metadata', 'METADATA_UPDATE_ERROR');
          }
          
          businessAuthUser = existingUser;
          console.log('Updated existing auth user ID with business metadata:', businessAuthUser.id);
        } else {
          throw new APIError(400, 'Email already in use', 'EMAIL_EXISTS');
        }
      } else {
        console.error('Error creating auth user:', authError);
        throw new APIError(500, 'Failed to create business account', 'AUTH_ERROR');
      }
    } else {
      // CRITICAL FIX: Properly extract the user object from the response
      businessAuthUser = authData.user;
      console.log('Created new auth user with ID:', businessAuthUser?.id);
      
      // Validate that we have the user ID
      if (!businessAuthUser || !businessAuthUser.id) {
        console.error('CRITICAL: Auth user created but ID is missing', authData);
        throw new APIError(500, 'Auth user created but ID is missing', 'AUTH_ID_MISSING');
      }
    }

    // Final verification that we have a valid auth user ID
    if (!businessAuthUser?.id) {
      console.error('CRITICAL: Business auth user ID is undefined after creation/retrieval');
      throw new APIError(500, 'Business auth user ID is undefined', 'AUTH_USER_MISSING');
    }
    console.log('Proceeding with business auth user ID:', businessAuthUser.id);

    // 7. Update the existing business record (created during invitation)
    // businessId already determined above for metadata
    let businessSlug: string;
    
    // If no business_id in invitation (old invitations), create one
    if (!invite.business_id) {
      
      // Generate URL-friendly slug from business name
      const baseSlug = businessData.businessName.trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      // Make slug unique by adding a random suffix if needed
      businessSlug = `${baseSlug}-${businessId.substring(0, 4)}`;
      
      console.log('Creating new business with owner_id:', businessAuthUser.id);
      
      const { error: businessError } = await supabaseAdmin
        .from('businesses')
        .insert({
          id: businessId,
          name: businessData.businessName.trim(),
          slug: businessSlug,
          owner_id: businessAuthUser.id,
          email: businessData.email.trim(),
          phone: businessData.phone?.trim() || null,
          website: businessData.website?.trim() || null,
          description: businessData.description?.trim() || null,
          business_address: businessData.businessAddress?.trim() || null,
          city: businessData.city?.trim() || null,
          state: businessData.state?.trim() || null,
          zip_code: businessData.zipCode?.trim() || null,
          logo_url: businessData.logoUrl || null,
          logo_storage_path: businessData.logoPath || null,
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
        throw new APIError(500, 'Failed to create business record', 'DATABASE_ERROR');
      }
    } else {
      // Update existing business record
      const { data: existingBusiness, error: fetchError } = await supabaseAdmin
        .from('businesses')
        .select('slug')
        .eq('id', businessId)
        .single();
        
      if (fetchError || !existingBusiness) {
        console.error('Error fetching existing business:', fetchError);
        throw new APIError(500, 'Failed to fetch existing business', 'DATABASE_ERROR');
      }
      
      businessSlug = existingBusiness.slug;
      
      console.log('Updating existing business with owner_id:', businessAuthUser.id);
      
      const { error: businessError } = await supabaseAdmin
        .from('businesses')
        .update({
          owner_id: businessAuthUser.id,
          email: businessData.email.trim(),
          phone: businessData.phone?.trim() || null,
          website: businessData.website?.trim() || null,
          description: businessData.description?.trim() || null,
          business_address: businessData.businessAddress?.trim() || null,
          city: businessData.city?.trim() || null,
          state: businessData.state?.trim() || null,
          zip_code: businessData.zipCode?.trim() || null,
          logo_url: businessData.logoUrl || null,
          logo_storage_path: businessData.logoPath || null,
          pricing_tier_id: pricingTier.id,
          stripe_customer_id: subscription.customer as string,
          stripe_subscription_id: subscriptionId,
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', businessId);

      if (businessError) {
        console.error('Error updating business:', businessError);
        throw new APIError(500, 'Failed to update business record', 'DATABASE_ERROR');
      }
    }

    // 8. Create the business admin user profile with the new auth_id
    console.log('Creating business_users record with:', {
      business_id: businessId,
      auth_id: businessAuthUser.id,
      email: businessData.email,
      full_name: businessData.businessOwnerName
    });

    const { data: businessUserRecord, error: profileError } = await supabaseAdmin
      .from('business_users')
      .insert({
        auth_id: businessAuthUser.id, // The business email's auth ID
        business_id: businessId,
        email: businessData.email.trim(),
        full_name: businessData.businessOwnerName.trim(),
        role: 'business_admin',
        is_active: true,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (profileError) {
      console.error('CRITICAL: Failed to create business_users record:', profileError);
      console.error('Error details:', JSON.stringify(profileError, null, 2));
      
      if (!profileError.message?.includes('already exists')) {
        // Clean up business record if profile creation fails
        await supabaseAdmin.from('businesses').delete().eq('id', businessId);
        throw new APIError(500, 'Failed to create business user profile', 'DATABASE_ERROR');
      } else {
        console.log('Business user profile already exists, continuing...');
      }
    } else {
      console.log('Successfully created business_users record:', businessUserRecord);
    }

    // 9. Create membership tiers for this business
    const tierInserts = businessData.customerTiers.map((tier) => ({
      business_id: businessId,
      name: tier.name.trim(),
      description: tier.description.trim(),
      monthly_price_cents: Math.round(tier.monthlyPrice * 100),
      benefits: tier.benefits.filter(b => b.trim()).map(b => b.trim()), // Store benefits as JSONB array
      image_url: tier.imageUrl || null,
      image_storage_path: tier.imagePath || null,
      is_active: true
    }));

    console.log('📝 Creating membership tiers:', tierInserts);

    const { data: createdTiers, error: tiersError } = await supabaseAdmin
      .from('membership_tiers')
      .insert(tierInserts)
      .select();

    if (tiersError || !createdTiers) {
      console.error('❌ Error creating membership tiers:', tiersError);
      // Clean up created records if tier creation fails (don't delete the user)
      await supabaseAdmin.from('businesses').delete().eq('id', businessId);
      throw new APIError(500, 'Failed to create membership tiers', 'DATABASE_ERROR');
    }
    
    console.log('✅ Created tiers:', createdTiers);

    // 10. Create Stripe products and prices for each tier
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

    // 11. Update Supabase records with Stripe IDs
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

    // 12. Mark the invitation as completed
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

    // 13. Create test data for new businesses
    console.log('🔄 Creating test data for new business');
    try {
      // Create test customer
      const testCustomerId = randomUUID();
      const { error: customerError } = await supabaseAdmin
        .from('customers')
        .insert({
          id: testCustomerId,
          business_id: businessId,
          auth_id: randomUUID(), // Placeholder auth ID
          email: 'testmember@example.com',
          name: 'Test Member One',
          tier_id: createdTiers[0]?.id, // First tier they created
          subscription_status: 'active',
          created_at: new Date().toISOString()
        });

      if (customerError) {
        console.error('❌ Error creating test customer:', customerError);
      } else {
        console.log('✅ Created test customer');
      }

      // Create test wine
      const testWineId = randomUUID();
      const { error: wineError } = await supabaseAdmin
        .from('wines')
        .insert({
          id: testWineId,
          business_id: businessId,
          name: 'Delicious Red 1',
          type: 'Red Wine',
          varietal: 'Cabernet Sauvignon',
          vintage: new Date().getFullYear() - 2, // 2 years old vintage
          price_cents: 2500, // $25
          stock_quantity: 10,
          rating: 87,
          description: 'A smooth and elegant red wine with notes of blackberry and vanilla',
          created_at: new Date().toISOString()
        });

      if (wineError) {
        console.error('❌ Error creating test wine:', wineError);
      } else {
        console.log('✅ Created test wine');
      }

      // Create test order/sale
      if (!customerError && !wineError) {
        const { error: orderError } = await supabaseAdmin
          .from('orders')
          .insert({
            id: randomUUID(),
            business_id: businessId,
            customer_id: testCustomerId,
            status: 'completed',
            total_amount_cents: 2500,
            created_at: new Date().toISOString()
          });

        if (orderError) {
          console.error('❌ Error creating test order:', orderError);
        } else {
          console.log('✅ Created test order');
        }
      }
    } catch (testDataError) {
      console.error('❌ Error creating test data:', testDataError);
      // Don't fail the whole process if test data creation fails
    }

    // 14. Return success response
    res.status(200).json({
      success: true,
      data: {
        businessId: businessId,
        businessSlug: businessSlug,
        businessAuthUserId: businessAuthUser.id, // The business email's auth ID
        businessEmail: businessData.email,
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