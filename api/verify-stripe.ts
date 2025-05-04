import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { formatApiError, sendApiError } from './utils/errorHandler';

/**
 * API endpoint for verifying Stripe configuration
 * Tests connectivity to Stripe API and verifies environment variables
 * Production-ready with comprehensive error handling
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
      return res.status(200).json({ status: 'success' });
    }
    
    // Ensure method is GET
    if (req.method !== 'GET') {
      return res.status(405).json({ 
        status: 'error',
        error: 'Method not allowed',
        allowed_methods: ['GET', 'OPTIONS']
      });
    }
    
    // Validate environment variables
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    
    if (!stripeSecretKey) {
      return res.status(500).json({
        status: 'error',
        error: 'Missing Stripe configuration',
        message: 'STRIPE_SECRET_KEY is not set in environment variables',
        config: {
          STRIPE_SECRET_KEY: 'missing',
          STRIPE_WEBHOOK_SECRET: !!process.env.STRIPE_WEBHOOK_SECRET ? 'configured' : 'missing',
          STRIPE_PUBLIC_KEY: !!(process.env.VITE_STRIPE_PUBLIC_KEY || process.env.STRIPE_PUBLIC_KEY) ? 'configured' : 'missing',
        }
      });
    }
    
    // Initialize Stripe client with test mode configuration
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      maxNetworkRetries: 3,
    });
    
    // Verify Stripe connection by retrieving account balance
    const balance = await stripe.balance.retrieve();
    
    // Return success response with configuration status
    return res.status(200).json({
      status: 'success',
      message: 'Stripe API connection successful',
      livemode: balance.livemode,
      config: {
        STRIPE_SECRET_KEY: 'configured',
        STRIPE_WEBHOOK_SECRET: !!process.env.STRIPE_WEBHOOK_SECRET ? 'configured' : 'missing',
        STRIPE_PUBLIC_KEY: !!(process.env.VITE_STRIPE_PUBLIC_KEY || process.env.STRIPE_PUBLIC_KEY) ? 'configured' : 'missing',
      },
      balance: {
        available: balance.available.map(b => ({ 
          amount: (b.amount / 100).toFixed(2),
          currency: b.currency 
        })),
        pending: balance.pending.map(b => ({ 
          amount: (b.amount / 100).toFixed(2),
          currency: b.currency 
        })),
      }
    });
  } catch (error: any) {
    // Log error for server-side debugging
    console.error('Stripe verification error:', error);
    
    // Determine appropriate status code based on error type
    let statusCode = 500;
    if (error.type === 'StripeAuthenticationError') {
      statusCode = 401;
    } else if (error.type === 'StripeConnectionError') {
      statusCode = 503;
    } else if (error.type === 'StripeAPIError') {
      statusCode = 502;
    }
    
    // Always return a properly formatted JSON error response
    return res.status(statusCode).json({
      status: 'error',
      error: error.message || 'Internal server error',
      type: error.type || 'unknown',
      details: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        code: error.code,
        type: error.type,
        name: error.name,
      } : undefined
    });
  }
}