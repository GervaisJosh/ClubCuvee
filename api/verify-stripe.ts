import { verifyStripeSetup } from './handlers/membershipHandler';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendApiError, withErrorHandling } from './utils/errorHandler';

/**
 * API endpoint for verifying Stripe configuration
 * Tests connectivity to Stripe API and verifies environment variables
 */
const handler = async (req: VercelRequest, res: VercelResponse) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      status: 'error',
      error: 'Method not allowed',
      allowed_methods: ['GET', 'OPTIONS']
    });
  }
  
  // Validate that the handler exists before calling it
  if (typeof verifyStripeSetup !== 'function') {
    return sendApiError(
      res, 
      new Error('Handler function not found or not properly imported'), 
      500
    );
  }
  
  // Let the handler function handle the response
  return await verifyStripeSetup(req, res);
};

// Export the handler with error handling wrapper
export default withErrorHandling(handler);