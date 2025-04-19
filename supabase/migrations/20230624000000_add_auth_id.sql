-- Add auth_id column to Users table if it doesn't exist
-- This maps between Supabase auth.users and our public.users table

DO $$
BEGIN
  -- Check if the column already exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'auth_id'
  ) THEN
    -- Add the column
    ALTER TABLE public.Users 
    ADD COLUMN auth_id UUID REFERENCES auth.users(id);
    
    -- Index for performance
    CREATE INDEX idx_users_auth_id ON public.Users(auth_id);
  END IF;
END
$$;