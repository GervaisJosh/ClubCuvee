import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/types/supabase';
import { corsMiddleware } from './utils/supabase';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing required Supabase environment variables');
}

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Apply CORS middleware
  await corsMiddleware(req, res);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { businessId, customerEmail, tierId } = req.body;
    const authHeader = req.headers.authorization;

    if (!businessId || !customerEmail) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'businessId and customerEmail are required'
      });
    }

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Missing authorization',
        message: 'Bearer token required'
      });
    }

    const token = authHeader.substring(7);

    // Verify the user is authenticated and is the business admin
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Authentication failed'
      });
    }

    // Verify the user is the admin of this business
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('id, name')
      .eq('id', businessId)
      .eq('admin_user_id', user.id)
      .single();

    if (businessError || !business) {
      return res.status(403).json({
        error: 'Unauthorized',
        message: 'You are not authorized to manage this business'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      return res.status(400).json({
        error: 'Invalid email format'
      });
    }

    // If tier is specified, verify it belongs to this business
    if (tierId) {
      const { data: tier, error: tierError } = await supabase
        .from('membership_tiers')
        .select('id, name')
        .eq('id', tierId)
        .eq('business_id', businessId)
        .eq('is_active', true)
        .single();

      if (tierError || !tier) {
        return res.status(400).json({
          error: 'Invalid tier',
          message: 'The specified tier does not exist or is not active'
        });
      }
    }

    // Check for existing pending invitation for this email and business
    const { data: existingInvitation } = await supabase
      .from('customer_invitations')
      .select('id, expires_at')
      .eq('business_id', businessId)
      .eq('email', customerEmail)
      .eq('status', 'pending')
      .single();

    if (existingInvitation) {
      const expiresAt = new Date(existingInvitation.expires_at);
      if (expiresAt > new Date()) {
        return res.status(409).json({
          error: 'Invitation already exists',
          message: 'A pending invitation already exists for this email'
        });
      } else {
        // Mark expired invitation as expired
        await supabase
          .from('customer_invitations')
          .update({ status: 'expired' })
          .eq('id', existingInvitation.id);
      }
    }

    // Generate secure token
    const invitationToken = crypto.randomUUID();
    
    // Set expiration to 7 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Create customer invitation
    const { data: invitation, error: inviteError } = await supabase
      .from('customer_invitations')
      .insert({
        token: invitationToken,
        business_id: businessId,
        email: customerEmail,
        tier_id: tierId || null,
        expires_at: expiresAt.toISOString(),
        status: 'pending'
      })
      .select()
      .single();

    if (inviteError) {
      console.error('Error creating customer invitation:', inviteError);
      return res.status(500).json({
        error: 'Failed to create invitation',
        message: inviteError.message
      });
    }

    return res.status(201).json({
      success: true,
      data: {
        token: invitation.token,
        email: invitation.email,
        businessName: business.name,
        expiresAt: invitation.expires_at,
        invitationUrl: `${process.env.VITE_APP_URL || 'http://localhost:3000'}/join/${invitation.token}`
      }
    });

  } catch (error: any) {
    console.error('Error in generate-customer-invitation:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}