import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../lib/supabaseAdmin';
import { withErrorHandler, APIError } from './utils/error-handler';

export default withErrorHandler(async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  if (req.method !== 'POST') {
    throw new APIError(405, 'Method not allowed', 'METHOD_NOT_ALLOWED');
  }

  // Parse request body
  const { token } = req.body;

  if (!token) {
    throw new APIError(400, 'Token is required', 'VALIDATION_ERROR');
  }

  // Validate token format (should be UUID)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(token)) {
    throw new APIError(400, 'Invalid token format', 'VALIDATION_ERROR');
  }

  // Call the database function to validate business invitation token
  const { data, error } = await supabaseAdmin.rpc('validate_business_invitation_token', {
    p_token: token
  });

  if (error) {
    console.error('Error validating business invitation token:', error);
    throw new APIError(500, 'Failed to validate invitation token', 'DATABASE_ERROR');
  }

  if (!data || data.length === 0) {
    throw new APIError(404, 'Invalid or expired invitation token', 'NOT_FOUND');
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

    throw new APIError(400, reason, 'VALIDATION_ERROR');
  }

  // Get additional invitation details
  const { data: inviteDetails, error: detailsError } = await supabaseAdmin
    .from('business_invites')
    .select('business_name, business_email, pricing_tier, expires_at')
    .eq('token', token)
    .single();

  if (detailsError) {
    console.error('Error fetching invitation details:', detailsError);
    throw new APIError(500, 'Failed to fetch invitation details', 'DATABASE_ERROR');
  }

  res.status(200).json({
    success: true,
    data: {
      is_valid: true,
      business_name: inviteDetails.business_name,
      business_email: inviteDetails.business_email,
      pricing_tier: inviteDetails.pricing_tier,
      expires_at: inviteDetails.expires_at
    }
  });
});