-- Add has_seen_tutorial column to users table
ALTER TABLE public.users ADD COLUMN has_seen_tutorial BOOLEAN DEFAULT FALSE;