import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../lib/supabaseAdmin';
import { withErrorHandler, APIError } from './utils/error-handler';

export default withErrorHandler(async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  if (req.method !== 'POST') {
    throw new APIError(405, 'Method not allowed', 'METHOD_NOT_ALLOWED');
  }

  const { token, business_id } = req.body;

  if (!token) {
    throw new APIError(400, 'Token is required', 'VALIDATION_ERROR');
  }

  // Validate token format (should be UUID)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(token)) {
    throw new APIError(400, 'Invalid token format', 'VALIDATION_ERROR');
  }

  // Call the database function to mark business invitation as used
  const { data, error } = await supabaseAdmin.rpc('mark_business_invitation_used', {
    p_token: token,
    p_business_id: business_id || null
  });

  if (error) {
    console.error('Error marking business invitation as used:', error);
    throw new APIError(500, 'Failed to mark invitation as used', 'DATABASE_ERROR');
  }

  res.status(200).json({
    success: data, // The function returns boolean
    data: {
      marked_used: data,
      token: token
    }
  });
});