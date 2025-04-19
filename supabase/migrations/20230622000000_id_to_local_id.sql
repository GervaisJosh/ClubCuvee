-- Migration to rename the id column to local_id in the users table
-- This makes it clear that this is a local ID separate from auth.id

-- Check if the table still has the old id column structure
DO $$
BEGIN
  -- Check if the id column exists and local_id doesn't exist
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'id'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'local_id'
  ) THEN
    -- Rename the id column to local_id
    ALTER TABLE public.Users RENAME COLUMN id TO local_id;
    
    -- Update foreign key constraints for tables that reference users.id
    -- Orders table
    IF EXISTS (
      SELECT 1 FROM information_schema.table_constraints
      WHERE constraint_name = 'orders_user_id_fkey'
    ) THEN
      ALTER TABLE public.Orders 
      DROP CONSTRAINT orders_user_id_fkey,
      ADD CONSTRAINT orders_user_id_fkey 
      FOREIGN KEY (user_id) REFERENCES public.Users(local_id);
    END IF;
    
    -- Wine_Ratings_Reviews table
    IF EXISTS (
      SELECT 1 FROM information_schema.table_constraints
      WHERE constraint_name = 'wine_ratings_reviews_user_id_fkey'
    ) THEN
      ALTER TABLE public.Wine_Ratings_Reviews 
      DROP CONSTRAINT wine_ratings_reviews_user_id_fkey,
      ADD CONSTRAINT wine_ratings_reviews_user_id_fkey 
      FOREIGN KEY (user_id) REFERENCES public.Users(local_id);
    END IF;
    
    -- User_Recommendations table (if it exists)
    IF EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_name = 'user_recommendations'
    ) AND EXISTS (
      SELECT 1 FROM information_schema.table_constraints
      WHERE constraint_name = 'user_recommendations_user_id_fkey'
    ) THEN
      ALTER TABLE public.User_Recommendations 
      DROP CONSTRAINT user_recommendations_user_id_fkey,
      ADD CONSTRAINT user_recommendations_user_id_fkey 
      FOREIGN KEY (user_id) REFERENCES public.Users(local_id);
    END IF;
    
    -- User_Stats table (if it exists)
    IF EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_name = 'user_stats'
    ) AND EXISTS (
      SELECT 1 FROM information_schema.table_constraints
      WHERE constraint_name = 'user_stats_user_id_fkey'
    ) THEN
      ALTER TABLE public.User_Stats
      DROP CONSTRAINT user_stats_user_id_fkey,
      ADD CONSTRAINT user_stats_user_id_fkey 
      FOREIGN KEY (user_id) REFERENCES public.Users(local_id);
    END IF;
  END IF;
END
$$;