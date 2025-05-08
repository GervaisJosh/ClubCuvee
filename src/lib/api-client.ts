import { APIError } from '../types/errors';

interface FetchOptions extends RequestInit {
  baseUrl?: string;
}

const defaultOptions: FetchOptions = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

export class APIClient {
  private static instance: APIClient;
  private readonly baseUrl: string;

  private constructor() {
    this.baseUrl = import.meta.env.VITE_APP_URL || '';
    if (!this.baseUrl) {
      throw new Error('Missing required environment variable: VITE_APP_URL');
    }
  }

  public static getInstance(): APIClient {
    if (!APIClient.instance) {
      APIClient.instance = new APIClient();
    }
    return APIClient.instance;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    if (!response.ok) {
      let errorMessage = 'An error occurred';
      let errorDetails: unknown = null;

      try {
        if (contentType?.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
          errorDetails = errorData.details;
        } else {
          errorMessage = await response.text();
        }
      } catch (e) {
        console.error('Error parsing error response:', e);
      }

      throw new APIError(
        response.status,
        errorMessage,
        'API_ERROR',
        errorDetails
      );
    }

    if (contentType?.includes('application/json')) {
      return response.json();
    }

    return response.text() as Promise<T>;
  }

  public async fetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const mergedOptions: RequestInit = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, mergedOptions);
      return this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(
        500,
        error instanceof Error ? error.message : 'Network error',
        'NETWORK_ERROR'
      );
    }
  }

  public async get<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    return this.fetch<T>(endpoint, { ...options, method: 'GET' });
  }

  public async post<T>(endpoint: string, data: unknown, options: FetchOptions = {}): Promise<T> {
    return this.fetch<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async put<T>(endpoint: string, data: unknown, options: FetchOptions = {}): Promise<T> {
    return this.fetch<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  public async delete<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    return this.fetch<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = APIClient.getInstance(); 