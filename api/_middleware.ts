import { VercelRequest, VercelResponse } from '@vercel/node';
import { withErrorHandler } from './utils/error-handler';

const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] as const;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || ['*'];

export default withErrorHandler(async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  // Handle CORS
  const origin = req.headers.origin || '';
  if (origin && (ALLOWED_ORIGINS.includes('*') || ALLOWED_ORIGINS.includes(origin))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', ALLOWED_METHODS.join(','));
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  // Validate method
  if (!ALLOWED_METHODS.includes(req.method as typeof ALLOWED_METHODS[number])) {
    res.status(405).json({
      error: {
        message: `Method ${req.method} not allowed`,
        code: 'METHOD_NOT_ALLOWED',
      },
    });
    return;
  }

  // Set JSON content type for all responses
  res.setHeader('Content-Type', 'application/json');
});