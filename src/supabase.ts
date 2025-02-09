// supabase.ts
import { createClient } from '@supabase/supabase-js';

// Vite automatically loads your .env variables and exposes those prefixed with VITE_
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);
