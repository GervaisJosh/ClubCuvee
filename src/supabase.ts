// supabase.ts
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config(); // Load .env variables

export const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);