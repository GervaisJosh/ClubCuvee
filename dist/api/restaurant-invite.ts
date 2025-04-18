import { createInvitationLink } from './handlers/membershipHandler.js';
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
  
  return createInvitationLink(req, res);
}