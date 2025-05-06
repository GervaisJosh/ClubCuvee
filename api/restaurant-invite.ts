import type { VercelRequest, VercelResponse } from '@vercel/node';
import { randomUUID } from 'crypto';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

interface InvitationData {
  email: string;
  restaurant_name: string;
  website?: string;
  admin_name?: string;
  tier?: string;
}

interface JsonResponse {
  status: 'success' | 'error';
  message?: string;
  error?: string;
  details?: any;
  [key: string]: any;
}

/**
 * Helper function to send JSON response with proper error handling
 */
function sendJsonResponse(res: VercelResponse, status: number, data: JsonResponse) {
  try {
    if (!res.headersSent) {
      res.setHeader('Content-Type', 'application/json');
    }
    return res.status(status).json(data);
  } catch (error) {
    console.error('Error sending JSON response:', error);
    if (!res.headersSent) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(500).json({
        status: 'error',
        error: 'Failed to send response',
        message: 'Internal server error'
      });
    }
  }
}

/**
 * Restaurant invitation API endpoint
 * 
 * Creates a secure, time-limited invitation token for restaurant onboarding
 * Production-ready with comprehensive error handling and consistent JSON responses
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  try {
    // Handle preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
      return sendJsonResponse(res, 200, { status: 'success' });
    }
    
    // Ensure method is POST
    if (req.method !== 'POST') {
      return sendJsonResponse(res, 405, {
        status: 'error',
        error: 'Method not allowed',
        message: 'Only POST requests are allowed',
        allowed_methods: ['POST', 'OPTIONS']
      });
    }
    
    // Parse and validate request body
    let body: Partial<InvitationData>;
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch (e) {
      return sendJsonResponse(res, 400, {
        status: 'error',
        error: 'Invalid JSON',
        message: 'Request body must be valid JSON'
      });
    }
    
    // Safely extract and validate required request body fields
    const { email, restaurant_name, website, admin_name, tier = 'standard' } = body;
    
    const validationErrors: Record<string, string> = {};
    
    // Validate email
    if (!email) {
      validationErrors.email = 'Email is required';
    } else if (typeof email !== 'string') {
      validationErrors.email = 'Email must be a string';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      validationErrors.email = 'Invalid email format';
    }
    
    // Validate restaurant_name
    if (!restaurant_name) {
      validationErrors.restaurant_name = 'Restaurant name is required';
    } else if (typeof restaurant_name !== 'string') {
      validationErrors.restaurant_name = 'Restaurant name must be a string';
    }
    
    if (Object.keys(validationErrors).length > 0) {
      return sendJsonResponse(res, 400, {
        status: 'error',
        error: 'Validation failed',
        message: 'Invalid input data',
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
      return sendJsonResponse(res, 500, {
        status: 'error',
        error: 'Database error',
        message: 'Failed to verify email'
      });
    }
    
    if (existingUser) {
      return sendJsonResponse(res, 400, {
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
      return sendJsonResponse(res, 500, {
        status: 'error',
        error: 'Database error',
        message: 'Failed to create invitation'
      });
    }
    
    // Generate invitation URL
    const deployUrl = process.env.VERCEL_URL || process.env.FRONTEND_URL;
    const baseUrl = deployUrl 
      ? (deployUrl.startsWith('http') ? deployUrl : `https://${deployUrl}`) 
      : 'https://clubcuvee.com';
    
    const invitationUrl = `${baseUrl}/onboarding/${token}`;
    
    // Return successful response with invitation details
    return sendJsonResponse(res, 200, {
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
    return sendJsonResponse(res, 500, {
      status: 'error',
      error: 'Internal server error',
      message: 'An unexpected error occurred while processing your request'
    });
  }
}