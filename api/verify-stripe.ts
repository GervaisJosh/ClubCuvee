import { verifyStripeSetup } from './handlers/membershipHandler';
import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * API endpoint for verifying Stripe configuration
 * Tests connectivity to Stripe API and verifies environment variables
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Include deployment context to help with debugging
  const deployUrl = process.env.VERCEL_URL || process.env.FRONTEND_URL;
  
  try {
    // Instead of returning the response directly, we need to call the handler
    // and let it handle the response
    return await verifyStripeSetup(req, res);
  } catch (error: any) {
    console.error('Error in verify-stripe endpoint:', error);
    // Detailed error logging
    const errorDetails = {
      message: error.message || 'Internal server error',
      code: error.code,
      type: error.type,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };
    
    console.error('Detailed error:', JSON.stringify(errorDetails, null, 2));
    
    return res.status(500).json({
      status: 'error',
      error: error.message || 'Internal server error',
      deployment_url: deployUrl ? `https://${deployUrl}` : undefined,
      errorDetails: process.env.NODE_ENV === 'development' ? errorDetails : undefined
    });
  }
}