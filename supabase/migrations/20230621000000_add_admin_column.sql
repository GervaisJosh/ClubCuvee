-- Migration to add is_admin column to Users table

-- Add is_admin column to Users table if it doesn't exist
ALTER TABLE IF EXISTS public.Users
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Create index on is_admin column for faster queries
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON public.Users (is_admin);

-- Grant permissions (only if row level security is not already enabled)
DO $$
BEGIN
  -- Check if RLS is already enabled for the table
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'Users' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE public.Users ENABLE ROW LEVEL SECURITY;
  END IF;
END
$$;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view own data" ON public.Users;
DROP POLICY IF EXISTS "Only admins can update users' admin status" ON public.Users;
DROP POLICY IF EXISTS "Users can update own non-admin data" ON public.Users;

-- Create updated row level security policies
CREATE POLICY "Users can view own data" ON public.Users
    FOR SELECT
    USING (auth.uid() = id OR auth.uid() IN (SELECT id FROM public.Users WHERE is_admin = TRUE));

CREATE POLICY "Only admins can update users' admin status" ON public.Users
    FOR UPDATE
    USING (auth.uid() IN (SELECT id FROM public.Users WHERE is_admin = TRUE))
    WITH CHECK (auth.uid() IN (SELECT id FROM public.Users WHERE is_admin = TRUE));

CREATE POLICY "Users can update own non-admin data" ON public.Users
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id AND NOT(is_admin::text <> old.is_admin::text));