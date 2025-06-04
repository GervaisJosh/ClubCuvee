-- FIX ADMIN POLICIES SCRIPT
-- This script updates RLS policies to use the users.is_admin column instead of raw_user_meta_data
-- Run this in your Supabase SQL Editor

-- 1. Drop and recreate admin policies for business_pricing_tiers
DROP POLICY IF EXISTS "Only admins can manage business pricing tiers" ON public.business_pricing_tiers;

CREATE POLICY "Only admins can manage business pricing tiers" ON public.business_pricing_tiers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_id = auth.uid() 
      AND is_admin = true
    )
  );

-- 2. Drop and recreate admin policies for business_invites (if exists)
DROP POLICY IF EXISTS "Only admins can create business invites" ON public.business_invites;

CREATE POLICY "Only admins can create business invites" ON public.business_invites
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_id = auth.uid() 
      AND is_admin = true
    )
  );

DROP POLICY IF EXISTS "Only admins can manage business invites" ON public.business_invites;

CREATE POLICY "Only admins can manage business invites" ON public.business_invites
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_id = auth.uid() 
      AND is_admin = true
    )
  );

-- 3. Update any other admin-only policies that might exist
-- Check if restaurant_invitations table has admin policies
DROP POLICY IF EXISTS "Only admins can manage restaurant invitations" ON public.restaurant_invitations;

-- Add a policy for restaurant_invitations if it doesn't exist
CREATE POLICY "Only admins can manage restaurant invitations" ON public.restaurant_invitations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_id = auth.uid() 
      AND is_admin = true
    )
  );

-- 4. Create a helper function for admin checks (optional but recommended)
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE auth_id = auth.uid() 
    AND is_admin = true
  );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION is_admin_user() TO authenticated;

-- Comment the function
COMMENT ON FUNCTION is_admin_user() IS 'Helper function to check if current user is admin based on users.is_admin column';

-- Add any missing businesses owner_id column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'businesses' 
        AND column_name = 'owner_id'
    ) THEN
        ALTER TABLE public.businesses ADD COLUMN owner_id UUID REFERENCES auth.users(id);
        COMMENT ON COLUMN public.businesses.owner_id IS 'The auth user who owns this business (usually the admin who set it up)';
    END IF;
END $$;