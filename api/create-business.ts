import { NextRequest } from 'next/server';
import { stripe } from './utils/stripe';
import { supabaseAdmin } from '../lib/supabaseAdmin';
import { errorHandler } from './utils/errorHandler';

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

export default async function handler(req: NextRequest) {
  if (req.method !== 'POST') {
    return Response.json(
      { success: false, error: 'Method not allowed' },
      { status: 405 }
    );
  }

  try {
    const body = await req.json();
    const { token, sessionId, businessData }: { 
      token: string; 
      sessionId: string; 
      businessData: BusinessFormData; 
    } = body;

    if (!token || !sessionId || !businessData) {
      return Response.json(
        { success: false, error: 'Token, session ID, and business data are required' },
        { status: 400 }
      );
    }

    // Validate the business invitation token
    const { data: tokenValidation, error: validationError } = await supabaseAdmin.rpc('validate_business_invitation_token', {
      p_token: token
    });

    if (validationError || !tokenValidation || tokenValidation.length === 0) {
      return Response.json(
        { success: false, error: 'Invalid or expired business invitation token' },
        { status: 400 }
      );
    }

    const tokenData = tokenValidation[0];
    if (!tokenData.is_valid) {
      return Response.json(
        { success: false, error: 'Business invitation token is not valid' },
        { status: 400 }
      );
    }

    // Get temp business setup data to get Stripe details
    const { data: tempSetupData, error: tempError } = await supabaseAdmin
      .from('temp_business_setup')
      .select('stripe_customer_id, stripe_subscription_id, pricing_tier')
      .eq('invitation_token', token)
      .single();

    if (tempError || !tempSetupData) {
      return Response.json(
        { success: false, error: 'Business setup data not found. Please restart the process.' },
        { status: 400 }
      );
    }

    // Get invitation details for business email
    const { data: inviteDetails, error: inviteError } = await supabaseAdmin
      .from('business_invites')
      .select('business_name, business_email, pricing_tier')
      .eq('token', token)
      .single();

    if (inviteError || !inviteDetails) {
      return Response.json(
        { success: false, error: 'Invitation details not found' },
        { status: 400 }
      );
    }

    // Validate business data
    if (!businessData.businessName?.trim()) {
      return Response.json(
        { success: false, error: 'Business name is required' },
        { status: 400 }
      );
    }

    if (!businessData.adminName?.trim()) {
      return Response.json(
        { success: false, error: 'Admin name is required' },
        { status: 400 }
      );
    }

    if (!businessData.adminEmail?.trim()) {
      return Response.json(
        { success: false, error: 'Admin email is required' },
        { status: 400 }
      );
    }

    if (!businessData.adminPassword) {
      return Response.json(
        { success: false, error: 'Admin password is required' },
        { status: 400 }
      );
    }

    if (businessData.adminPassword.length < 8) {
      return Response.json(
        { success: false, error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    if (businessData.adminPassword !== businessData.confirmPassword) {
      return Response.json(
        { success: false, error: 'Passwords do not match' },
        { status: 400 }
      );
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
      return Response.json(
        { success: false, error: 'Failed to create admin user account' },
        { status: 500 }
      );
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
      
      return Response.json(
        { success: false, error: 'Failed to create business record' },
        { status: 500 }
      );
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

    return Response.json({
      success: true,
      data: {
        businessId: newBusiness.id,
        adminUserId: authData.user.id,
        business: newBusiness
      }
    });

  } catch (error) {
    console.error('Error creating business:', error);
    return errorHandler(error);
  }
}