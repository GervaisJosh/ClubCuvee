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
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token } = req.query;

    if (!token || typeof token !== 'string') {
      return res.status(400).json({
        error: 'Missing token',
        message: 'Customer invitation token is required'
      });
    }

    // Get the invitation data with business and tier information
    const { data: invitation, error: inviteError } = await supabase
      .from('customer_invitations')
      .select(`
        *,
        businesses!inner(id, name),
        membership_tiers(id, name, description, price_markup_percentage, stripe_price_id)
      `)
      .eq('token', token)
      .single();

    if (inviteError || !invitation) {
      return res.status(404).json({
        error: 'Invitation not found',
        message: 'The customer invitation does not exist'
      });
    }

    // Check if invitation has expired
    const now = new Date();
    const expiresAt = new Date(invitation.expires_at);
    if (now > expiresAt) {
      // Update invitation status to expired
      await supabase
        .from('customer_invitations')
        .update({ status: 'expired', updated_at: new Date().toISOString() })
        .eq('id', invitation.id);

      return res.status(400).json({
        error: 'Invitation expired',
        message: 'The customer invitation has expired'
      });
    }

    // Check invitation status
    if (invitation.status === 'expired') {
      return res.status(400).json({
        error: 'Invitation expired',
        message: 'The customer invitation has expired'
      });
    }

    if (invitation.status === 'used') {
      return res.status(400).json({
        error: 'Invitation already used',
        message: 'This invitation has already been used'
      });
    }

    // Get all available tiers for this business
    const { data: availableTiers, error: tiersError } = await supabase
      .from('membership_tiers')
      .select('id, name, description, price_markup_percentage, stripe_price_id')
      .eq('business_id', invitation.business_id)
      .eq('is_active', true)
      .order('price_markup_percentage', { ascending: true });

    if (tiersError) {
      console.error('Error fetching membership tiers:', tiersError);
      // Don't fail completely if tiers can't be fetched
    }

    // Format response
    const responseData = {
      token: invitation.token,
      businessId: invitation.business_id,
      businessName: invitation.businesses.name,
      email: invitation.email,
      tierId: invitation.tier_id,
      tierName: invitation.membership_tiers?.name,
      tierDescription: invitation.membership_tiers?.description,
      expiresAt: invitation.expires_at
    };

    return res.status(200).json({
      success: true,
      data: responseData,
      availableTiers: availableTiers || []
    });

  } catch (error: any) {
    console.error('Error validating customer invitation:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}