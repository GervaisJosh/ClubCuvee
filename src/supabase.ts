// supabase.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types/supabase';

// Use a singleton pattern to prevent multiple GoTrueClient instances
// https://supabase.com/docs/reference/javascript/initializing

// Fix for "Multiple GoTrueClient instances detected" warning:
// 1. Ensure we use the exact same URL and key in all imports
// 2. Use a global singleton that's only instantiated once
// 3. Add a global window property to ensure browser contexts share the instance

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL!;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY!;

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
    return createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  
  // For browser environments, check window for existing instance
  if (window.__SUPABASE_INSTANCE) {
    return window.__SUPABASE_INSTANCE;
  }
  
  // Create a new instance and store it on the window
  const instance = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
  window.__SUPABASE_INSTANCE = instance;
  
  return instance;
};

// Export the singleton instance
export const supabase = createSupabaseClient();