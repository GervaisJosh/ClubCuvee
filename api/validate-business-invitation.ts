import { NextRequest } from 'next/server';
import { supabaseAdmin } from '../lib/supabaseAdmin';
import { errorHandler } from './utils/errorHandler';

export default async function handler(req: NextRequest) {
  if (req.method !== 'POST') {
    return Response.json(
      { success: false, error: 'Method not allowed' },
      { status: 405 }
    );
  }

  try {
    // Parse request body
    const body = await req.json();
    const { token } = body;

    if (!token) {
      return Response.json(
        { success: false, error: 'Token is required' },
        { status: 400 }
      );
    }

    // Validate token format (should be UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(token)) {
      return Response.json(
        { success: false, error: 'Invalid token format' },
        { status: 400 }
      );
    }

    // Call the database function to validate business invitation token
    const { data, error } = await supabaseAdmin.rpc('validate_business_invitation_token', {
      p_token: token
    });

    if (error) {
      console.error('Error validating business invitation token:', error);
      return Response.json(
        { success: false, error: 'Failed to validate invitation token' },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return Response.json(
        { success: false, error: 'Invalid or expired invitation token' },
        { status: 404 }
      );
    }

    const tokenData = data[0];

    // Check if token is valid
    if (!tokenData.is_valid) {
      let reason = 'Invalid invitation token';
      
      if (tokenData.used) {
        reason = 'This invitation has already been used';
      } else if (new Date(tokenData.expires_at) < new Date()) {
        reason = 'This invitation has expired';
      }

      return Response.json(
        { success: false, error: reason },
        { status: 400 }
      );
    }

    // Get additional invitation details
    const { data: inviteDetails, error: detailsError } = await supabaseAdmin
      .from('business_invites')
      .select('business_name, business_email, pricing_tier, expires_at')
      .eq('token', token)
      .single();

    if (detailsError) {
      console.error('Error fetching invitation details:', detailsError);
      return Response.json(
        { success: false, error: 'Failed to fetch invitation details' },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      data: {
        is_valid: true,
        business_name: inviteDetails.business_name,
        business_email: inviteDetails.business_email,
        pricing_tier: inviteDetails.pricing_tier,
        expires_at: inviteDetails.expires_at
      }
    });

  } catch (error) {
    console.error('Error in validate-business-invitation:', error);
    return errorHandler(error);
  }
}