-- Create User_Stats table if it doesn't exist
-- This table stores aggregated statistics for users

DO $$
BEGIN
  -- Check if the table already exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'user_stats'
  ) THEN
    -- Create the table
    CREATE TABLE public.User_Stats (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES public.Users(local_id) ON DELETE CASCADE,
      wines_tasted INTEGER DEFAULT 0,
      average_rating NUMERIC DEFAULT 0,
      upcoming_deliveries INTEGER DEFAULT 0,
      next_event TEXT DEFAULT NULL,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );
    
    -- Add indexes for performance
    CREATE INDEX idx_user_stats_user_id ON public.User_Stats(user_id);
    
    -- Add a trigger to update the updated_at timestamp
    CREATE OR REPLACE FUNCTION update_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
    
    CREATE TRIGGER update_user_stats_timestamp
    BEFORE UPDATE ON public.User_Stats
    FOR EACH ROW
    EXECUTE PROCEDURE update_timestamp();
  END IF;
END
$$;