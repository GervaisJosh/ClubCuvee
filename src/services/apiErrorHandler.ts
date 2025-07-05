/**
 * Client-side API error handling utilities
 * Used to standardize error handling across frontend services
 */

/**
 * API error handling utility for client-side code.
 * Formats errors consistently across the application
 */
export class ApiError extends Error {
  status: number;
  statusText: string;
  data: any;
  type?: string;
  
  constructor(message: string, status: number, statusText: string, data?: any, type?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.data = data;
    this.type = type;
  }
  
  static fromResponse(response: Response, data?: any): ApiError {
    // Use provided data or default to empty object
    const errorData = data || {};
    return new ApiError(
      errorData.error || `API Error: ${response.status} ${response.statusText}`,
      response.status,
      response.statusText,
      errorData,
      errorData.type
    );
  }
}

/**
 * Standard API error response structure
 * Should match the structure returned by the backend
 */
export interface ApiErrorResponse {
  status: 'error';
  error: string;
  code?: number;
  type?: string;
  details?: any;
  deployment_url?: string;
  errorDetails?: any;
}

/**
 * Typed interface for a successful API response
 */
export interface ApiSuccessResponse<T = any> {
  status: 'success';
  message?: string;
  data?: T;
  [key: string]: any; // Allow for additional properties
}

/**
 * Safely parses JSON from an API response with error handling
 */
export async function safeJsonParse(response: Response): Promise<any> {
  const contentType = response.headers.get('content-type');
  
  // Check if response is JSON
  if (!contentType || !contentType.includes('application/json')) {
    const textResponse = await response.text();
    console.error(`Non-JSON response (${response.status}):`, textResponse);
    throw new ApiError(
      `Invalid response format: ${contentType || 'unknown'}`,
      response.status,
      response.statusText,
      { rawResponse: textResponse }
    );
  }
  
  try {
    return await response.json();
  } catch (error) {
    console.error('JSON parse error:', error);
    throw new ApiError(
      'Failed to parse JSON response',
      response.status,
      response.statusText,
      { parseError: (error as Error).message }
    );
  }
}

/**
 * Generic API request handler with consistent error handling
 */
export async function apiRequest<T = any>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });
    
    const data = await safeJsonParse(response);
    
    if (!response.ok) {
      // Handle API error responses (status >= 400)
      throw ApiError.fromResponse(response, data);
    }
    
    return data as T;
  } catch (error) {
    // Re-throw API errors
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Handle network errors, CORS issues, etc.
    console.error('Network or connection error:', error);
    throw new ApiError(
      (error as Error).message || 'Network connection error',
      0, // 0 indicates a connection error rather than an HTTP status
      'NETWORK_ERROR',
      { originalError: error }
    );
  }
}

/**
 * Type guard to check if a response is an error
 */
export function isApiError(response: any): response is ApiErrorResponse {
  return response && response.status === 'error';
}

/**
 * Type guard to check if a response is successful
 */
export function isApiSuccess<T>(response: any): response is ApiSuccessResponse<T> {
  return response && response.status === 'success';
}