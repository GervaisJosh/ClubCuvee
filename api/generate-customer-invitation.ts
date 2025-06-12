import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../lib/supabaseAdmin';
import { withErrorHandling } from './utils/errorHandler';
import crypto from 'crypto';

const handler = async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { businessId, customerEmail } = req.body;

    if (!businessId) {
      return res.status(400).json({ error: 'Business ID is required' });
    }

    // Verify that the business exists
    const { data: business, error: businessError } = await supabaseAdmin
      .from('restaurants')
      .select('id, name')
      .eq('id', businessId)
      .single();

    if (businessError || !business) {
      return res.status(404).json({ 
        error: 'Business not found' 
      });
    }

    // Generate a secure token
    const token = crypto.randomBytes(32).toString('hex');

    // Set expiration date (30 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Create the customer invitation
    const invitationData = {
      business_id: businessId,
      token: token,
      customer_email: customerEmail || null,
      status: 'pending',
      expires_at: expiresAt.toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: invitation, error: insertError } = await supabaseAdmin
      .from('customer_invitations')
      .insert([invitationData])
      .select()
      .single();

    if (insertError) {
      console.error('Error creating customer invitation:', insertError);
      return res.status(500).json({ 
        error: 'Failed to create customer invitation' 
      });
    }

    // Generate the customer registration URL
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.BASE_URL || 'http://localhost:3000';
    
    const customerUrl = `${baseUrl}/customer/join/${token}`;

    return res.status(200).json({
      success: true,
      invitation: {
        id: invitation.id,
        token: invitation.token,
        expires_at: invitation.expires_at,
        status: invitation.status,
        business: {
          id: business.id,
          name: business.name
        }
      },
      customerUrl
    });
  } catch (error: any) {
    console.error('Error in generate-customer-invitation:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};

export default withErrorHandling(handler);