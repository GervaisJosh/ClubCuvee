-- Fix admin check in business invitation function to use users table is_admin field
-- This migration updates the generate_business_invitation function to properly check admin status

CREATE OR REPLACE FUNCTION generate_business_invitation(
  p_business_name TEXT,
  p_business_email TEXT,
  p_pricing_tier TEXT DEFAULT NULL
)
RETURNS TABLE(
  token UUID,
  invitation_url TEXT,
  expires_at TIMESTAMPTZ
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_token UUID;
  v_expires_at TIMESTAMPTZ;
  v_user_id UUID;
BEGIN
  -- Get the current user ID
  v_user_id := auth.uid();
  
  -- Check if user exists and is admin using the users table
  IF NOT EXISTS (
    SELECT 1 FROM public.users 
    WHERE auth_id = v_user_id 
    AND is_admin = true
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Only admin users can generate business invitations';
  END IF;

  -- Validate required parameters
  IF p_business_name IS NULL OR p_business_name = '' THEN
    RAISE EXCEPTION 'Business name is required';
  END IF;
  
  IF p_business_email IS NULL OR p_business_email = '' THEN
    RAISE EXCEPTION 'Business email is required';
  END IF;

  -- Generate unique token
  v_token := gen_random_uuid();
  v_expires_at := now() + interval '30 days'; -- 30-day expiry for business invitations

  -- Insert invitation record
  INSERT INTO public.business_invites (
    token,
    business_name,
    business_email,
    pricing_tier,
    created_by,
    expires_at
  ) VALUES (
    v_token,
    p_business_name,
    p_business_email,
    p_pricing_tier,
    v_user_id,
    v_expires_at
  );

  -- Return token and URL
  RETURN QUERY SELECT 
    v_token,
    CONCAT('/onboarding/', v_token::text) as invitation_url,
    v_expires_at;
END;
$$;

-- Update the RLS policy to also use the users table admin check
DROP POLICY IF EXISTS "Only admins can manage business invitations" ON public.business_invites;

CREATE POLICY "Only admins can manage business invitations" ON public.business_invites
  FOR ALL USING (
    created_by = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_id = auth.uid() 
      AND is_admin = true
    )
  );