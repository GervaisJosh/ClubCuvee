import type { VercelResponse } from '@vercel/node';
import { ZodError } from 'zod';

export interface ApiErrorResponse {
  status: 'error';
  error: string;
  code?: number;
  type?: string;
  details?: any;
  deployment_url?: string;
  errorDetails?: any;
}

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

/**
 * Formats an error into a consistent API error response
 * 
 * @param error The error object to format
 * @param includeDetails Whether to include detailed error information (default: false)
 * @returns A structured API error response object
 */
export function formatApiError(error: any, includeDetails = false): ApiErrorResponse {
  // Extract common error properties
  const errorResponse: ApiErrorResponse = {
    status: 'error',
    error: error.message || 'Internal server error',
  };

  // Add error type if available
  if (error.type) {
    errorResponse.type = error.type;
  }

  // Add error code if available
  if (error.code || error.statusCode) {
    errorResponse.code = error.code || error.statusCode;
  }

  // Include deployment context to help with debugging
  const deployUrl = process.env.VERCEL_URL || process.env.FRONTEND_URL;
  if (deployUrl) {
    errorResponse.deployment_url = deployUrl.startsWith('http') ? deployUrl : `https://${deployUrl}`;
  }

  // Include detailed error information in development mode
  if (includeDetails || process.env.NODE_ENV === 'development') {
    errorResponse.errorDetails = {
      message: error.message,
      code: error.code,
      type: error.type,
      stack: error.stack,
      // Additional properties that might be useful
      name: error.name,
      cause: error.cause,
    };
  }

  return errorResponse;
}

/**
 * Sends a formatted error response
 * 
 * @param res The Vercel response object
 * @param error The error to format and send
 * @param statusCode The HTTP status code to use (default: 500)
 * @param includeDetails Whether to include detailed error information (default: false)
 */
export function sendApiError(
  res: VercelResponse,
  error: any,
  statusCode = 500,
  includeDetails = false
): void {
  // Log the error for server-side debugging
  console.error(`API Error (${statusCode}):`, error);
  
  // Send the formatted error response
  res.status(statusCode).json(formatApiError(error, includeDetails));
}

/**
 * Returns common error status codes based on error types
 * 
 * @param error The error to analyze
 * @returns An appropriate HTTP status code
 */
export function getErrorStatusCode(error: any): number {
  // Authentication errors
  if (
    error.type === 'StripeAuthenticationError' ||
    error.message?.toLowerCase().includes('authentication') ||
    error.message?.toLowerCase().includes('api key') ||
    error.code === 'auth_error'
  ) {
    return 401;
  }

  // Validation errors
  if (
    error.type === 'StripeInvalidRequestError' || 
    error.message?.toLowerCase().includes('validation') ||
    error.message?.toLowerCase().includes('invalid')
  ) {
    return 400;
  }

  // Resource not found
  if (
    error.type === 'StripeInvalidRequestError' && 
    error.message?.toLowerCase().includes('no such') ||
    error.code === 'resource_missing'
  ) {
    return 404;
  }

  // Rate limiting errors
  if (
    error.type === 'StripeRateLimitError' ||
    error.code === 'rate_limit_exceeded'
  ) {
    return 429;
  }

  // External service errors
  if (
    error.type === 'StripeAPIError' ||
    error.type === 'StripeConnectionError'
  ) {
    return 502;
  }

  // Default to internal server error
  return 500;
}

/**
 * Wrapper for API handler functions to catch and format errors consistently
 * 
 * @param handler The API handler function to wrap
 * @returns A wrapped handler function with error handling
 */
export function withErrorHandling(
  handler: (req: any, res: any) => Promise<any>
) {
  return async (req: any, res: any) => {
    try {
      return await handler(req, res);
    } catch (error: any) {
      const statusCode = getErrorStatusCode(error);
      sendApiError(res, error, statusCode);
    }
  };
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