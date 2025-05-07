import type { VercelResponse } from '@vercel/node';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function formatApiError(error: any) {
  if (error instanceof AppError) {
    return {
      status: 'error',
      error: error.message,
      details: error.details
    };
  }

  return {
    status: 'error',
    error: error.message || 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? error : undefined
  };
}

export function sendErrorResponse(res: VercelResponse, error: Error) {
  const statusCode = error instanceof AppError ? error.statusCode : 500;
  const formattedError = formatApiError(error);
  
  return res.status(statusCode).json(formattedError);
}

export function handleStripeError(error: any) {
  if (error.type === 'StripeAuthenticationError') {
    return new AppError(401, 'Invalid Stripe API key');
  } else if (error.type === 'StripeConnectionError') {
    return new AppError(503, 'Stripe API connection error');
  } else if (error.type === 'StripeAPIError') {
    return new AppError(502, 'Stripe API error');
  } else if (error.type === 'StripeInvalidRequestError') {
    return new AppError(400, error.message);
  } else if (error.type === 'StripeRateLimitError') {
    return new AppError(429, 'Too many requests to Stripe API');
  }
  
  return new AppError(500, 'Internal server error');
} 