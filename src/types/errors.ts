export class APIError extends Error {
  constructor(
    public status: number,
    message: string,
    public type: 'API_ERROR' | 'NETWORK_ERROR' | 'VALIDATION_ERROR',
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export interface ErrorResponse {
  error: string;
  details?: any;
  type?: string;
  status?: number;
} 