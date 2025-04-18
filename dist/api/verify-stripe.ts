import { verifyStripeSetup } from './handlers/membershipHandler.js';
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
    const response = await verifyStripeSetup(req, res);
    return response;
  } catch (error: any) {
    console.error('Error in verify-stripe endpoint:', error);
    return res.status(500).json({
      status: 'error',
      error: error.message || 'Internal server error',
      deployment_url: deployUrl ? `https://${deployUrl}` : undefined
    });
  }
}