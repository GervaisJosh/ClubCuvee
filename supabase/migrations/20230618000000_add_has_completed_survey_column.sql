-- Add has_completed_survey column to users table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'has_completed_survey') THEN
        ALTER TABLE public.users ADD COLUMN has_completed_survey BOOLEAN DEFAULT FALSE;
    END IF;
END $$;