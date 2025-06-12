import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../lib/supabaseAdmin';
import { withErrorHandling } from './utils/errorHandler';

const handler = async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    // Get customer invitation with business and tier data
    const { data: invitation, error: invitationError } = await supabaseAdmin
      .from('customer_invitations')
      .select(`
        *,
        businesses!inner (
          id,
          name,
          website,
          logo_url
        )
      `)
      .eq('token', token)
      .eq('status', 'pending')
      .single();

    if (invitationError || !invitation) {
      return res.status(404).json({ 
        error: 'Invalid or expired customer invitation' 
      });
    }

    // Check if invitation has expired
    const now = new Date();
    const expiryDate = new Date(invitation.expires_at);

    if (now > expiryDate) {
      // Update status to expired
      await supabaseAdmin
        .from('customer_invitations')
        .update({ 
          status: 'expired',
          updated_at: new Date().toISOString()
        })
        .eq('token', token);
        
      return res.status(410).json({ 
        error: 'This invitation has expired' 
      });
    }

    const business = invitation.businesses;

    // Get membership tiers for this business
    const { data: membershipTiers, error: tiersError } = await supabaseAdmin
      .from('membership_tiers')
      .select('*')
      .eq('restaurant_id', business.id)
      .eq('is_active', true)
      .order('price', { ascending: true });

    if (tiersError) {
      console.error('Error fetching membership tiers:', tiersError);
      return res.status(500).json({ 
        error: 'Failed to fetch membership tiers' 
      });
    }

    // Format the response
    const response = {
      business: {
        id: business.id,
        name: business.name,
        website: business.website,
        logo_url: business.logo_url
      },
      membershipTiers: membershipTiers?.map(tier => ({
        id: tier.id,
        name: tier.name,
        price: tier.price,
        description: tier.description,
        stripe_price_id: tier.stripe_price_id
      })) || [],
      invitation: {
        id: invitation.id,
        expires_at: invitation.expires_at,
        status: invitation.status
      }
    };

    return res.status(200).json(response);
  } catch (error: any) {
    console.error('Error in validate-customer-invitation:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};

export default withErrorHandling(handler);