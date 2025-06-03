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

    const authToken = authHeader.split(' ')[1];
    if (!authToken) {
      return Response.json(
        { success: false, error: 'Invalid authorization token format' },
        { status: 401 }
      );
    }

    // Verify the user session
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(authToken);
    
    if (authError || !user) {
      return Response.json(
        { success: false, error: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { token, business_id } = body;

    if (!token || !business_id) {
      return Response.json(
        { success: false, error: 'Token and business_id are required' },
        { status: 400 }
      );
    }

    // Validate token format (should be UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(token) || !uuidRegex.test(business_id)) {
      return Response.json(
        { success: false, error: 'Invalid token or business_id format' },
        { status: 400 }
      );
    }

    // Verify that the business belongs to the authenticated user
    const { data: businessData, error: businessError } = await supabaseAdmin
      .from('businesses')
      .select('id, admin_user_id')
      .eq('id', business_id)
      .eq('admin_user_id', user.id)
      .single();

    if (businessError || !businessData) {
      return Response.json(
        { success: false, error: 'Business not found or unauthorized' },
        { status: 403 }
      );
    }

    // Call the database function to mark business invitation as used
    const { data, error } = await supabaseAdmin.rpc('mark_business_invitation_used', {
      p_token: token,
      p_business_id: business_id
    });

    if (error) {
      console.error('Error marking business invitation as used:', error);
      return Response.json(
        { success: false, error: 'Failed to mark invitation as used' },
        { status: 500 }
      );
    }

    if (!data) {
      return Response.json(
        { success: false, error: 'Invitation token not found, already used, or expired' },
        { status: 400 }
      );
    }

    return Response.json({
      success: true,
      data: {
        marked_as_used: true
      }
    });

  } catch (error) {
    console.error('Error in mark-business-invitation-used:', error);
    return errorHandler(error);
  }
}