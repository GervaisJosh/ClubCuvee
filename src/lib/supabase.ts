import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// Validate required environment variables
const requiredEnvVars = {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
};

Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

// Create a global type for the window object to include our supabase instance
declare global {
  interface Window {
    __SUPABASE_INSTANCE?: ReturnType<typeof createClient<Database>>;
  }
}

// Use a function that checks for an existing instance in the global window object
const createSupabaseClient = () => {
  // For SSR (server-side rendering) environments without window
  if (typeof window === 'undefined') {
    return createClient<Database>(
      requiredEnvVars.VITE_SUPABASE_URL,
      requiredEnvVars.VITE_SUPABASE_ANON_KEY,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true
        }
      }
    );
  }
  
  // For browser environments, check window for existing instance
  if (window.__SUPABASE_INSTANCE) {
    return window.__SUPABASE_INSTANCE;
  }
  
  // Create a new instance and store it on the window
  const instance = createClient<Database>(
    requiredEnvVars.VITE_SUPABASE_URL,
    requiredEnvVars.VITE_SUPABASE_ANON_KEY,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    }
  );
  window.__SUPABASE_INSTANCE = instance;
  
  return instance;
};

// Export the singleton instance
export const supabase = createSupabaseClient(); 