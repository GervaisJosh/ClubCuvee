# Club Cuvee

A SaaS platform for personalized wine clubs, using vector search, wine theory, and guest purchasing behavior to recommend wines and manage wine club subscriptions.

## Development Workflow

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   Create a `.env` file with your credentials (see `.env.example` for required variables)

### Running the Application

#### Standard Development

```bash
npm run dev
```

This runs the Vite development server which:
- Serves the React frontend on port 3000
- Handles API routes in the `/api` directory
- No separate API server is needed - all API routes are handled through the same server

#### Production Build

```bash
npm run build
npm run preview
```

#### API Routes

- API routes are defined in the `/api` directory using Vercel-compatible format
- They follow the Vercel serverless function pattern
- For the most accurate simulation of the production environment, use `vercel dev`

### API Endpoints

#### Stripe Integration

- `/api/verify-stripe` - Verifies Stripe configuration
- `/api/restaurant-invite` - Generates restaurant invitation links
- `/api/membership-tiers` - Manages restaurant membership tiers
- `/api/stripe-webhook` - Handles Stripe webhook events

## Deployment

This application is designed to be deployed on Vercel, which automatically handles both the frontend and API routes.

```bash
vercel
```

## Troubleshooting

If API routes aren't working in development:
1. Make sure you're using relative paths (`/api/endpoint` not `http://localhost:3000/api/endpoint`)
2. Check environment variables are properly set (Stripe API keys, etc.)
3. For complete API simulation, install Vercel CLI and run `vercel dev`