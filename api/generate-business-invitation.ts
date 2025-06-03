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
    // Get authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json(
        { success: false, error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return Response.json(
        { success: false, error: 'Invalid authorization token format' },
        { status: 401 }
      );
    }

    // Verify the user session
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      return Response.json(
        { success: false, error: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    // Check if user is admin by querying the user profile
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('is_admin')
      .eq('auth_id', user.id)
      .single();

    if (profileError || !userProfile || !userProfile.is_admin) {
      console.error('Admin check failed:', { profileError, userProfile, userId: user.id });
      return Response.json(
        { success: false, error: 'Only admin users can generate business invitations' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { business_name, business_email, pricing_tier } = body;

    // Validate required fields
    if (!business_name || !business_email) {
      return Response.json(
        { success: false, error: 'Business name and email are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(business_email)) {
      return Response.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate pricing tier if provided (should be a UUID)
    if (pricing_tier) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(pricing_tier)) {
        return Response.json(
          { success: false, error: 'Invalid pricing tier ID format' },
          { status: 400 }
        );
      }

      // Verify the pricing tier exists
      const { data: tierExists, error: tierError } = await supabaseAdmin
        .from('business_pricing_tiers')
        .select('id')
        .eq('id', pricing_tier)
        .eq('is_active', true)
        .single();

      if (tierError || !tierExists) {
        return Response.json(
          { success: false, error: 'Invalid pricing tier selected' },
          { status: 400 }
        );
      }
    }

    // Call the database function to generate business invitation
    const { data, error } = await supabaseAdmin.rpc('generate_business_invitation', {
      p_business_name: business_name,
      p_business_email: business_email,
      p_pricing_tier: pricing_tier || null
    });

    if (error) {
      console.error('Error generating business invitation:', error);
      return Response.json(
        { success: false, error: 'Failed to generate business invitation' },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return Response.json(
        { success: false, error: 'Failed to generate invitation token' },
        { status: 500 }
      );
    }

    const invitationData = data[0];
    const fullInvitationUrl = `${new URL(req.url).origin}/join/${invitationData.token}`;

    return Response.json({
      success: true,
      data: {
        token: invitationData.token,
        invitation_url: fullInvitationUrl,
        expires_at: invitationData.expires_at
      }
    });

  } catch (error) {
    console.error('Error in generate-business-invitation:', error);
    return errorHandler(error);
  }
}