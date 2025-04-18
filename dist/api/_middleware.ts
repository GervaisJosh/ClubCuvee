import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function middleware(req: VercelRequest, res: VercelResponse, next: () => void) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Continue to the API route
  return next();
}