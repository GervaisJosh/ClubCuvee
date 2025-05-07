import type { VercelResponse } from '@vercel/node';
import { ZodError } from 'zod';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const sendErrorResponse = (
  res: VercelResponse,
  error: Error | AppError | ZodError,
  statusCode = 500
) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (res.req?.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation Error',
      details: error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message
      }))
    });
  }

  // Handle operational errors (expected errors)
  if (error instanceof AppError && error.isOperational) {
    return res.status(error.statusCode).json({
      error: error.message
    });
  }

  // Handle unexpected errors
  console.error('Unexpected error:', error);
  return res.status(statusCode).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : error.message
  });
};

export const handleStripeError = (error: any) => {
  if (error.type?.startsWith('Stripe')) {
    throw new AppError(400, error.message);
  }
  throw error;
};

export const handleSupabaseError = (error: any) => {
  if (error.code) {
    throw new AppError(400, error.message);
  }
  throw error;
}; 