import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with service role key for admin operations
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);
