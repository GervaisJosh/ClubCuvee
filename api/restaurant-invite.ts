import type { VercelRequest, VercelResponse } from '@vercel/node';
import { randomUUID } from 'crypto';
import { supabaseAdmin } from './utils/supabaseAdmin';

interface InvitationData {
  email: string;
  restaurant_name: string;
  website?: string;
  admin_name?: string;
  tier?: string;
}

/**
 * Restaurant invitation API endpoint
 * 
 * Creates a secure, time-limited invitation token for restaurant onboarding
 * Production-ready with comprehensive error handling and consistent JSON responses
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
      return res.status(200).json({ status: 'success' });
    }
    
    // Ensure method is POST
    if (req.method !== 'POST') {
      return res.status(405).json({ 
        status: 'error',
        error: 'Method not allowed',
        allowed_methods: ['POST', 'OPTIONS']
      });
    }
    
    // Validate required request body fields
    const { email, restaurant_name, website, admin_name, tier = 'standard' } = req.body || {} as InvitationData;
    
    const validationErrors: Record<string, string> = {};
    
    if (!email) {
      validationErrors.email = 'Email is required';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      validationErrors.email = 'Invalid email format';
    }
    
    if (!restaurant_name) {
      validationErrors.restaurant_name = 'Restaurant name is required';
    }
    
    if (Object.keys(validationErrors).length > 0) {
      return res.status(400).json({
        status: 'error',
        error: 'Validation failed',
        details: validationErrors
      });
    }
    
    // Check if email is already registered
    const { data: existingUser, error: userError } = await supabaseAdmin
      .from('restaurants')
      .select('id')
      .eq('admin_email', email)
      .maybeSingle();
    
    if (userError) {
      console.error('Database error checking existing user:', userError);
      return res.status(500).json({
        status: 'error',
        error: 'Failed to verify email',
        message: 'Internal database error'
      });
    }
    
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        error: 'Email already in use',
        message: 'This email is already associated with a restaurant account'
      });
    }
    
    // Generate a secure token using UUID
    const token = randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Token valid for 7 days
    
    // Create invitation data
    const invitationData = {
      token,
      email,
      restaurant_name,
      website: website || '',
      admin_name: admin_name || '',
      tier,
      created_at: new Date().toISOString(),
      expires_at: expiresAt.toISOString(),
      status: 'pending'
    };
    
    // Store invitation in the database
    const { data: invitation, error: inviteError } = await supabaseAdmin
      .from('restaurant_invitations')
      .insert([invitationData])
      .select()
      .single();
    
    if (inviteError) {
      console.error('Database error creating invitation:', inviteError);
      return res.status(500).json({
        status: 'error',
        error: 'Failed to create invitation',
        message: inviteError.message || 'Internal database error'
      });
    }
    
    // Generate invitation URL
    const deployUrl = process.env.VERCEL_URL || process.env.FRONTEND_URL;
    const baseUrl = deployUrl 
      ? (deployUrl.startsWith('http') ? deployUrl : `https://${deployUrl}`) 
      : 'https://clubcuvee.com';
    
    const invitationUrl = `${baseUrl}/onboarding/${token}`;
    
    // Return successful response with invitation details
    return res.status(200).json({
      status: 'success',
      message: 'Invitation created successfully',
      invitation: {
        id: invitation.id,
        token: invitation.token,
        email: invitation.email,
        restaurant_name: invitation.restaurant_name,
        status: invitation.status,
        expires_at: invitation.expires_at,
        created_at: invitation.created_at
      },
      invitation_url: invitationUrl
    });
    
  } catch (error: any) {
    // Log error for server-side debugging
    console.error('Error in restaurant-invite endpoint:', error);
    
    // Always return a properly formatted JSON error response
    return res.status(500).json({
      status: 'error',
      error: 'Internal server error',
      message: error.message || 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? {
        error: error.message,
        name: error.name,
        code: error.code,
        hint: error.hint,
      } : undefined
    });
  }
}