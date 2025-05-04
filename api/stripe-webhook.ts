// File: /api/stripe-webhook.ts
import { handleWebhook } from './handlers/webhookHandler';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { withErrorHandling } from './utils/errorHandler';

/**
 * Stripe webhook endpoint - all logic is now contained in the modular webhookHandler
 * This provides a clean entry point for the Vercel serverless function
 * Uses the withErrorHandling wrapper for consistent error responses
 */
const handler = async (req: VercelRequest, res: VercelResponse) => {
  return handleWebhook(req, res);
};

// Export with error handling wrapper
export default withErrorHandling(handler);
