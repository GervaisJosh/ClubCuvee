// src/supabase.ts
import { createClient } from '@supabase/supabase-js';

console.log('[SUPABASE] Initializing Supabase client');

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);