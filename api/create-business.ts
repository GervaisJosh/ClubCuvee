import { VercelRequest, VercelResponse } from '@vercel/node';
import { stripe } from './utils/stripe';
import { supabaseAdmin } from '../lib/supabaseAdmin';
import { withErrorHandler, APIError } from './utils/error-handler';

interface BusinessFormData {
  businessName: string;
  adminName: string;
  adminEmail: string;
  adminPassword: string;
  confirmPassword: string;
  tiers: TierFormData[];
}

interface TierFormData {
  name: string;
  description: string;
  priceMarkupPercentage: number;
}

export default withErrorHandler(async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  if (req.method !== 'POST') {
    throw new APIError(405, 'Method not allowed', 'METHOD_NOT_ALLOWED');
  }

  const { token, sessionId, businessData }: { 
    token: string; 
    sessionId: string; 
    businessData: BusinessFormData; 
  } = req.body;

  if (!token || !sessionId || !businessData) {
    throw new APIError(400, 'Token, session ID, and business data are required', 'VALIDATION_ERROR');
  }

  // Validate the business invitation token
  const { data: tokenValidation, error: validationError } = await supabaseAdmin.rpc('validate_business_invitation_token', {
    p_token: token
  });

  if (validationError || !tokenValidation || tokenValidation.length === 0) {
    throw new APIError(400, 'Invalid or expired business invitation token', 'VALIDATION_ERROR');
  }

  const tokenData = tokenValidation[0];
  if (!tokenData.is_valid) {
    throw new APIError(400, 'Business invitation token is not valid', 'VALIDATION_ERROR');
  }

  // Get temp business setup data to get Stripe details
  const { data: tempSetupData, error: tempError } = await supabaseAdmin
    .from('temp_business_setup')
    .select('stripe_customer_id, stripe_subscription_id, pricing_tier')
    .eq('invitation_token', token)
    .single();

  if (tempError || !tempSetupData) {
    throw new APIError(400, 'Business setup data not found. Please restart the process.', 'VALIDATION_ERROR');
  }

  // Get invitation details for business email
  const { data: inviteDetails, error: inviteError } = await supabaseAdmin
    .from('business_invites')
    .select('business_name, business_email, pricing_tier')
    .eq('token', token)
    .single();

  if (inviteError || !inviteDetails) {
    throw new APIError(400, 'Invitation details not found', 'VALIDATION_ERROR');
  }

  // Validate business data
  if (!businessData.businessName?.trim()) {
    throw new APIError(400, 'Business name is required', 'VALIDATION_ERROR');
  }

  if (!businessData.adminName?.trim()) {
    throw new APIError(400, 'Admin name is required', 'VALIDATION_ERROR');
  }

  if (!businessData.adminEmail?.trim()) {
    throw new APIError(400, 'Admin email is required', 'VALIDATION_ERROR');
  }

  if (!businessData.adminPassword) {
    throw new APIError(400, 'Admin password is required', 'VALIDATION_ERROR');
  }

  if (businessData.adminPassword.length < 8) {
    throw new APIError(400, 'Password must be at least 8 characters long', 'VALIDATION_ERROR');
  }

  if (businessData.adminPassword !== businessData.confirmPassword) {
    throw new APIError(400, 'Passwords do not match', 'VALIDATION_ERROR');
  }

  // Create admin user in Supabase Auth
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: businessData.adminEmail,
    password: businessData.adminPassword,
    user_metadata: {
      name: businessData.adminName,
      role: 'business_admin'
    },
    email_confirm: true
  });

  if (authError || !authData.user) {
    console.error('Error creating admin user:', authError);
    throw new APIError(500, 'Failed to create admin user account', 'DATABASE_ERROR');
  }

  // Get the pricing tier ID for the business
  const { data: pricingTierData, error: tierError } = await supabaseAdmin
    .from('business_pricing_tiers')
    .select('id')
    .eq('stripe_product_id', (await stripe.subscriptions.retrieve(tempSetupData.stripe_subscription_id)).items.data[0].price.product)
    .single();

  let pricingTierId = null;
  if (!tierError && pricingTierData) {
    pricingTierId = pricingTierData.id;
  }

  // Create business record
  const { data: businessData: newBusiness, error: businessError } = await supabaseAdmin
    .from('businesses')
    .insert({
      name: businessData.businessName,
      email: inviteDetails.business_email,
      owner_id: authData.user.id,
      stripe_customer_id: tempSetupData.stripe_customer_id,
      stripe_subscription_id: tempSetupData.stripe_subscription_id,
      subscription_status: 'active',
      pricing_tier_id: pricingTierId,
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  if (businessError || !newBusiness) {
    console.error('Error creating business:', businessError);
    
    // Clean up the auth user if business creation failed
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
    
    throw new APIError(500, 'Failed to create business record', 'DATABASE_ERROR');
  }

  // Create restaurant membership tiers for customers
  const tierInserts = businessData.tiers.map((tier, index) => ({
    business_id: newBusiness.id,
    name: tier.name,
    description: tier.description,
    price_cents: Math.round(2999 * (1 + tier.priceMarkupPercentage / 100)), // Base price $29.99 with markup
    interval: 'month',
    is_ready: false, // Will be set to true when Stripe products are created
    created_at: new Date().toISOString()
  }));

  const { error: tiersError } = await supabaseAdmin
    .from('restaurant_membership_tiers')
    .insert(tierInserts);

  if (tiersError) {
    console.error('Error creating membership tiers:', tiersError);
    // Don't fail the whole process for this
  }

  // Mark business invitation as used
  const { error: markUsedError } = await supabaseAdmin.rpc('mark_business_invitation_used', {
    p_token: token,
    p_business_id: newBusiness.id
  });

  if (markUsedError) {
    console.error('Error marking invitation as used:', markUsedError);
    // Don't fail for this
  }

  // Mark temp setup as completed
  await supabaseAdmin
    .from('temp_business_setup')
    .update({ setup_completed: true })
    .eq('invitation_token', token);

  res.status(200).json({
    success: true,
    data: {
      businessId: newBusiness.id,
      adminUserId: authData.user.id,
      business: newBusiness
    }
  });
});