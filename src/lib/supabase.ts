import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

if (!import.meta.env.VITE_SUPABASE_URL) {
  throw new Error('VITE_SUPABASE_URL is required');
}

if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
  throw new Error('VITE_SUPABASE_ANON_KEY is required');
}

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
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );
  }
  
  // For browser environments, check window for existing instance
  if (window.__SUPABASE_INSTANCE) {
    return window.__SUPABASE_INSTANCE;
  }
  
  // Create a new instance and store it on the window
  const instance = createClient<Database>(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );
  window.__SUPABASE_INSTANCE = instance;
  
  return instance;
};

// Export the singleton instance
export const supabase = createSupabaseClient(); 