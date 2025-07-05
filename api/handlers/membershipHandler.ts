import { stripe } from '../utils/stripeClient';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { validateRequest, validatePrice } from '../utils/validation';
import { sendApiError } from '../utils/errorHandler';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { randomUUID } from 'crypto';

import { ensurePriceString, ensurePriceNumber, convertPriceToStripeCents } from '@/src/utils/priceUtils';

// Type definitions for clarity and safety
interface MembershipTierData {
  name: string;
  price: string; // Always store as string, convert to number when needed for calculations
  description?: string;
  restaurant_id: string;
  stripe_product_id?: string;
  stripe_price_id?: string;
  created_at?: string;
  updated_at?: string;
}

interface InvitationData {
  email: string;
  restaurant_name: string;
  website?: string;
  admin_name?: string;
  tier?: string;
}

/**
 * Create a membership tier with Stripe product/price
 */
export async function createMembershipTier(req: VercelRequest, res: VercelResponse) {
  try {
    const { name, price, description, restaurant_id } = req.body;
    
    // Validate request
    const validation = validateRequest(
      req.body,
      ['name', 'price', 'restaurant_id'],
      {
        price: (value) => 
          validatePrice(value) 
            ? null 
            : { field: 'price', message: 'Price must be a positive number' },
      }
    );
    
    if (!validation.isValid) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.errors,
      });
    }
    
    // Get restaurant info
    const { data: restaurant, error: restaurantError } = await supabaseAdmin
      .from('restaurants')
      .select('name')
      .eq('id', restaurant_id)
      .single();
      
    if (restaurantError || !restaurant) {
      return res.status(404).json({
        error: `Restaurant not found: ${restaurantError?.message || "Unknown error"}`,
      });
    }
    
    // Create Stripe product with restaurant context
    const product = await stripe.products.create({
      name: `${restaurant.name} - ${name}`,
      description: description || `${name} membership tier`,
      metadata: { 
        restaurant_id,
      }
    });
    
    // Create price for the product
    const stripePrice = await stripe.prices.create({
      product: product.id,
      unit_amount: convertPriceToStripeCents(price),
      currency: 'usd',
      recurring: { interval: 'month' },
      metadata: { 
        restaurant_id,
      }
    });
    
    // Store in Supabase
    const tierData: MembershipTierData = {
      name,
      price: ensurePriceString(price),
      description: description || '',
      restaurant_id,
      stripe_product_id: product.id,
      stripe_price_id: stripePrice.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    const { data: tier, error } = await supabaseAdmin
      .from('membership_tiers')
      .insert([tierData])
      .select()
      .single();
      
    if (error) {
      // If database operation fails, we should clean up Stripe resources
      try {
        await stripe.prices.update(stripePrice.id, { active: false });
        await stripe.products.update(product.id, { active: false });
      } catch (cleanupError) {
        console.error('Error cleaning up Stripe resources:', cleanupError);
      }
      
      return res.status(500).json({
        error: `Database error: ${error.message}`,
      });
    }
    
    // Update Stripe metadata with tier_id now that we have it
    try {
      await stripe.products.update(product.id, {
        metadata: { tier_id: tier.id, restaurant_id },
      });
      
      await stripe.prices.update(stripePrice.id, {
        metadata: { tier_id: tier.id, restaurant_id },
      });
    } catch (metadataError) {
      console.error('Error updating Stripe metadata:', metadataError);
      // Non-critical error, continue
    }
    
    return res.status(200).json(tier);
  } catch (error: any) {
    console.error('Error creating membership tier:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error',
    });
  }
}

/**
 * Update a membership tier, potentially creating a new Stripe price
 */
export async function updateMembershipTier(req: VercelRequest, res: VercelResponse) {
  try {
    const { id, name, price, description, restaurant_id, stripe_product_id, stripe_price_id } = req.body;
    
    // Validate request
    const validation = validateRequest(
      req.body,
      ['id', 'name', 'price', 'restaurant_id'],
      {
        price: (value) => 
          validatePrice(value) 
            ? null 
            : { field: 'price', message: 'Price must be a positive number' },
      }
    );
    
    if (!validation.isValid) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.errors,
      });
    }
    
    // Verify the tier exists and belongs to this restaurant (security check)
    const { data: existingTier, error: fetchError } = await supabaseAdmin
      .from('membership_tiers')
      .select('*')
      .eq('id', id)
      .eq('restaurant_id', restaurant_id)
      .single();
      
    if (fetchError || !existingTier) {
      return res.status(404).json({
        error: `Tier not found: ${fetchError?.message || "Unknown error"}`,
      });
    }
    
    // Prepare tier data for update
    const updateData: Partial<MembershipTierData> = {
      name,
      price: ensurePriceString(price),
      description: description || '',
      updated_at: new Date().toISOString(),
    };
    
    // Update Stripe if we have Stripe IDs
    if (stripe_product_id && stripe_price_id) {
      // Check what needs to be updated in Stripe
      const hasNameChanged = existingTier.name !== name;
      const hasDescriptionChanged = existingTier.description !== description;
      const hasPriceChanged = ensurePriceNumber(existingTier.price) !== ensurePriceNumber(price);
      
      try {
        // 1. Update product if name or description changed
        if (hasNameChanged || hasDescriptionChanged) {
          // Get restaurant info for product name
          const { data: restaurant } = await supabaseAdmin
            .from('restaurants')
            .select('name')
            .eq('id', restaurant_id)
            .single();
          
          if (restaurant) {
            await stripe.products.update(stripe_product_id, {
              name: `${restaurant.name} - ${name}`,
              description: description || `${name} membership tier`,
            });
          }
        }
        
        // 2. Handle price update if needed
        if (hasPriceChanged) {
          // Stripe doesn't allow updating prices, so we create a new one
          // and mark the old one as inactive
          
          // Archive the old price
          await stripe.prices.update(stripe_price_id, {
            active: false,
          });
          
          // Create new price
          const newPrice = await stripe.prices.create({
            product: stripe_product_id,
            unit_amount: convertPriceToStripeCents(price),
            currency: 'usd',
            recurring: { interval: 'month' },
            metadata: {
              restaurant_id,
              tier_id: id,
            },
          });
          
          // Update our data object with new price ID
          updateData.stripe_price_id = newPrice.id;
        }
      } catch (stripeError: any) {
        console.error('Stripe update error:', stripeError);
        // Continue with Supabase update, but include warning
        return res.status(200).json({
          warning: `Stripe update failed: ${stripeError.message}`,
          tier: existingTier,
        });
      }
    }
    
    // Update the tier in Supabase
    const { data: updatedTier, error: updateError } = await supabaseAdmin
      .from('membership_tiers')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (updateError) {
      return res.status(500).json({
        error: `Failed to update tier: ${updateError.message}`,
      });
    }
    
    return res.status(200).json(updatedTier);
  } catch (error: any) {
    console.error('Error updating membership tier:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error',
    });
  }
}

/**
 * Generate a secure invitation link for a restaurant
 */
export async function createInvitationLink(req: VercelRequest, res: VercelResponse) {
  try {
    const { email, restaurant_name, website, admin_name, tier = 'standard' } = req.body as InvitationData;
    
    // Validate request
    const validation = validateRequest(
      req.body,
      ['email', 'restaurant_name'],
      {
        email: (value) => {
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          return emailRegex.test(value) 
            ? null 
            : { field: 'email', message: 'Invalid email format' };
        },
      }
    );
    
    if (!validation.isValid) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.errors,
      });
    }
    
    // Check if email is already registered
    const { data: existingUser } = await supabaseAdmin
      .from('restaurants')
      .select('id')
      .eq('admin_email', email)
      .maybeSingle();
    
    if (existingUser) {
      return res.status(400).json({
        error: 'This email is already associated with a restaurant account'
      });
    }
    
    // Generate a secure token
    const token = randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Token valid for 7 days
    
    // Create invitation data
    const invitationData = {
      token,
      email,
      restaurant_name,
      website: website || '',
      admin_name: admin_name || '',
      tier,
      created_at: new Date().toISOString(),
      expires_at: expiresAt.toISOString(),
      status: 'pending'
    };
    
    // Store invitation in the database
    const { data: invitation, error: inviteError } = await supabaseAdmin
      .from('restaurant_invitations')
      .insert([invitationData])
      .select()
      .single();
    
    if (inviteError) {
      return res.status(500).json({
        error: `Failed to create invitation: ${inviteError.message}`
      });
    }
    
    // Generate invitation URL using the deployment URL from Vercel
    // Or fallback to the FRONTEND_URL environment variable
    const deployUrl = process.env.VERCEL_URL || process.env.FRONTEND_URL;
    const baseUrl = deployUrl 
      ? (deployUrl.startsWith('http') ? deployUrl : `https://${deployUrl}`) 
      : 'https://your-deployment-url.vercel.app';
    
    const invitationUrl = `${baseUrl}/onboard/${token}`;
    
    // Here's where you'd send an email with the invitation link
    // Commented out for future implementation
    
    /*
    // Example implementation with SendGrid or similar email service
    const sendInvitationEmail = async (recipient: string, restaurantName: string, inviteUrl: string) => {
      try {
        // Using SendGrid (would require @sendgrid/mail package)
        // const sgMail = require('@sendgrid/mail');
        // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        
        // const msg = {
        //   to: recipient,
        //   from: 'noreply@clubcuvee.com',
        //   subject: `Join Club Cuvee - ${restaurantName} Restaurant Invitation`,
        //   text: `You've been invited to set up ${restaurantName} on Club Cuvee. Click this link to get started: ${inviteUrl}`,
        //   html: `
        //     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        //       <h2>Welcome to Club Cuvee</h2>
        //       <p>You've been invited to set up <strong>${restaurantName}</strong> on Club Cuvee's wine membership platform.</p>
        //       <p>Click the button below to start your onboarding:</p>
        //       <div style="text-align: center; margin: 30px 0;">
        //         <a href="${inviteUrl}" style="background-color: #872657; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
        //           Set Up Your Restaurant
        //         </a>
        //       </div>
        //       <p>This invitation link will expire in 7 days.</p>
        //     </div>
        //   `,
        // };
        
        // await sgMail.send(msg);
        return true;
      } catch (error) {
        console.error('Error sending invitation email:', error);
        return false;
      }
    };
    
    // Send the email
    const emailSent = await sendInvitationEmail(email, restaurant_name, invitationUrl);
    */
    
    // Return invitation data and URL
    return res.status(200).json({
      success: true,
      invitation: {
        id: invitation.id,
        token: invitation.token,
        email: invitation.email,
        restaurant_name: invitation.restaurant_name,
        status: invitation.status,
        expires_at: invitation.expires_at,
        created_at: invitation.created_at
      },
      invitation_url: invitationUrl,
      // email_sent: emailSent || false, // Would be included if email sending was implemented
      message: 'Invitation created successfully'
    });
  } catch (error: any) {
    console.error('Error creating invitation:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
}

/**
 * Verify Stripe configuration and connectivity
 */
export async function verifyStripeSetup(_req: VercelRequest, res: VercelResponse) {
  try {
    // First, validate that we have the necessary environment variables
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    
    if (!stripeSecretKey) {
      const configError = new Error('Missing Stripe configuration. STRIPE_SECRET_KEY is not set in environment variables.');
      Object.assign(configError, { 
        type: 'ConfigurationError',
        config: {
          STRIPE_SECRET_KEY: 'missing',
          STRIPE_WEBHOOK_SECRET: !!process.env.STRIPE_WEBHOOK_SECRET ? 'configured' : 'missing',
          VITE_STRIPE_PUBLIC_KEY: !!(process.env.VITE_STRIPE_PUBLIC_KEY || process.env.STRIPE_PUBLIC_KEY) ? 'configured' : 'missing',
        }
      });
      return sendApiError(res, configError, 500, true);
    }
    
    // Verify we can connect to Stripe API
    const balance = await stripe.balance.retrieve();
    
    // Check for required environment variables
    const configStatus = {
      STRIPE_SECRET_KEY: 'configured',
      STRIPE_WEBHOOK_SECRET: !!process.env.STRIPE_WEBHOOK_SECRET ? 'configured' : 'missing',
      VITE_STRIPE_PUBLIC_KEY: !!(process.env.VITE_STRIPE_PUBLIC_KEY || process.env.STRIPE_PUBLIC_KEY) ? 'configured' : 'missing',
    };
    
    return res.status(200).json({
      status: 'success',
      message: 'Stripe API connection successful',
      livemode: balance.livemode,
      config: configStatus,
      balance: {
        available: balance.available.map(b => ({ 
          amount: (b.amount / 100).toFixed(2),
          currency: b.currency 
        })),
        pending: balance.pending.map(b => ({ 
          amount: (b.amount / 100).toFixed(2),
          currency: b.currency 
        })),
      }
    });
  } catch (error: any) {
    console.error('Error verifying Stripe setup:', error);
    const statusCode = getErrorStatusCodeForStripe(error);
    return sendApiError(res, error, statusCode, true);
  }
}

/**
 * Helper function to determine the appropriate status code for Stripe-specific errors
 */
function getErrorStatusCodeForStripe(error: any): number {
  if (error.type === 'StripeAuthenticationError') {
    return 401; // Unauthorized
  } else if (error.type === 'StripeConnectionError') {
    return 503; // Service Unavailable
  } else if (error.type === 'StripeAPIError') {
    return 502; // Bad Gateway
  } else if (error.type === 'StripeInvalidRequestError') {
    return 400; // Bad Request
  } else if (error.type === 'StripeRateLimitError') {
    return 429; // Too Many Requests
  } else if (error.type === 'ConfigurationError') {
    return 500; // Internal Server Error due to misconfiguration
  }
  
  // Default to internal server error
  return 500;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST' && req.url?.includes('/invite')) {
    return createInvitationLink(req, res);
  } else if (req.method === 'POST') {
    return createMembershipTier(req, res);
  } else if (req.method === 'PUT') {
    return updateMembershipTier(req, res);
  } else if (req.method === 'GET' && req.url?.includes('/verify-stripe')) {
    return verifyStripeSetup(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}