// File: /api/stripe-webhook.ts
import { handleWebhook } from './handlers/webhookHandler';
import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Stripe webhook endpoint - all logic is now contained in the modular webhookHandler
 * This provides a clean entry point for the Vercel serverless function
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  return handleWebhook(req, res);
}
