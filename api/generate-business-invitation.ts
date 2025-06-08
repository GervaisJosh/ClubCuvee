import { VercelRequest, VercelResponse } from '@vercel/node';
import { randomUUID } from 'crypto';
import { supabaseAdmin } from './utils/supabaseAdmin';
import { withErrorHandler, APIError } from './utils/error-handler';

export default withErrorHandler(async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  if (req.method !== 'POST') {
    throw new APIError(405, 'Method not allowed', 'METHOD_NOT_ALLOWED');
  }

  // Get authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new APIError(401, 'Missing or invalid authorization header', 'UNAUTHORIZED');
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    throw new APIError(401, 'Invalid authorization token format', 'UNAUTHORIZED');
  }

  // Verify the user session
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  
  if (authError || !user) {
    console.error('Auth error:', authError);
    throw new APIError(401, 'Invalid authentication token', 'UNAUTHORIZED');
  }

  // Check if user is admin by querying the user profile
  const { data: userProfile, error: profileError } = await supabaseAdmin
    .from('Users')
    .select('is_admin')
    .eq('auth_id', user.id)
    .single();

  if (profileError || !userProfile || !userProfile.is_admin) {
    console.error('Admin check failed:', { profileError, userProfile, userId: user.id });
    throw new APIError(403, 'Only admin users can generate business invitations', 'FORBIDDEN');
  }

  // Parse request body
  const { business_name, business_email, pricing_tier } = req.body;

  // Validate required fields
  if (!business_name || !business_email) {
    throw new APIError(400, 'Business name and email are required', 'VALIDATION_ERROR');
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(business_email)) {
    throw new APIError(400, 'Invalid email format', 'VALIDATION_ERROR');
  }

  // Validate pricing tier if provided (should be a UUID)
  if (pricing_tier) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(pricing_tier)) {
      throw new APIError(400, 'Invalid pricing tier ID format', 'VALIDATION_ERROR');
    }

    // Verify the pricing tier exists
    const { data: tierExists, error: tierError } = await supabaseAdmin
      .from('business_pricing_tiers')
      .select('id')
      .eq('id', pricing_tier)
      .eq('is_active', true)
      .single();

    if (tierError || !tierExists) {
      throw new APIError(400, 'Invalid pricing tier selected', 'VALIDATION_ERROR');
    }
  }

  // Generate invitation token and insert into restaurant_invitations
  const invitationToken = randomUUID();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
  
  const { data, error } = await supabaseAdmin
    .from('restaurant_invitations')
    .insert({
      token: invitationToken,
      email: business_email,
      restaurant_name: business_name,
      tier: pricing_tier || 'standard',
      expires_at: expiresAt.toISOString(),
      status: 'pending'
    })
    .select('token, expires_at')
    .single();

  if (error) {
    console.error('Error generating restaurant invitation:', error);
    throw new APIError(500, 'Failed to generate restaurant invitation', 'DATABASE_ERROR');
  }

  if (!data) {
    throw new APIError(500, 'Failed to generate invitation token', 'DATABASE_ERROR');
  }

  const invitationData = data;
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers.host;
  const fullInvitationUrl = `${protocol}://${host}/onboarding/${invitationData.token}`;

  res.status(200).json({
    success: true,
    data: {
      token: invitationData.token,
      invitation_url: fullInvitationUrl,
      expires_at: invitationData.expires_at
    }
  });
});