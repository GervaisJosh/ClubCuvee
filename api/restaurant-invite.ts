import { createInvitationLink } from './handlers/membershipHandler';
import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Restaurant invitation API endpoint
 * 
 * Creates a secure, time-limited invitation token for restaurant onboarding
 * Vercel serverless function - handles POST requests only
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Validate that the request body has the required fields
    const { email, restaurant_name } = req.body || {};
    if (!email || !restaurant_name) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: {
          email: email ? undefined : 'Email is required',
          restaurant_name: restaurant_name ? undefined : 'Restaurant name is required'
        }
      });
    }
    
    // Call the handler with proper error handling
    return await createInvitationLink(req, res);
  } catch (error: any) {
    console.error('Error in restaurant-invite endpoint:', error);
    // Detailed error for debugging
    const errorDetails = {
      message: error.message || 'Internal server error',
      code: error.code,
      type: error.type,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };
    
    console.error('Detailed error:', JSON.stringify(errorDetails, null, 2));
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
      errorDetails: process.env.NODE_ENV === 'development' ? errorDetails : undefined
    });
  }
}