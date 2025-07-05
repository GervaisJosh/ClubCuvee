import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './utils/validateEnvironment';

/**
 * Club Cuvee API Configuration Notes:
 * 
 * - API routes are defined in the /api directory using Vercel-compatible format
 * - In development, these routes are served directly by Vite (no separate API server)
 * - For the most accurate simulation of the production environment, use `vercel dev`
 * - API calls should use the format: '/api/endpoint' (e.g., '/api/verify-stripe')
 * 
 * This simplified setup ensures consistency between development and production.
 */

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
