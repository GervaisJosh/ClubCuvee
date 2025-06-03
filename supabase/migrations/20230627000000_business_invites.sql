-- Business invitation system for private business onboarding
-- This migration creates the business_invites table for secure business registration

-- Create business invitation tokens table
CREATE TABLE IF NOT EXISTS public.business_invites (
  token UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  business_email TEXT NOT NULL,
  pricing_tier TEXT,
  used BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT (now() + interval '30 days'), -- 30-day expiry for business invites
  business_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL -- Set after successful business creation
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS business_invites_token_idx ON public.business_invites(token);
CREATE INDEX IF NOT EXISTS business_invites_created_by_idx ON public.business_invites(created_by);
CREATE INDEX IF NOT EXISTS business_invites_used_idx ON public.business_invites(used);

-- Enable Row Level Security
ALTER TABLE public.business_invites ENABLE ROW LEVEL SECURITY;

-- RLS Policy for Business Invites
-- Only admins can manage business invitations
CREATE POLICY "Only admins can manage business invitations" ON public.business_invites
  FOR ALL USING (
    created_by = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Create function to generate business invitation links
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
BEGIN
  -- Only allow admin users to generate business invitations
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND raw_user_meta_data->>'role' = 'admin'
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
    auth.uid(),
    v_expires_at
  );

  -- Return token and URL
  RETURN QUERY SELECT 
    v_token,
    CONCAT('/join/', v_token::text) as invitation_url,
    v_expires_at;
END;
$$;

-- Create function to validate business invitation tokens
CREATE OR REPLACE FUNCTION validate_business_invitation_token(
  p_token TEXT
)
RETURNS TABLE(
  is_valid BOOLEAN,
  pricing_tier TEXT,
  expires_at TIMESTAMPTZ,
  used BOOLEAN
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if token exists and is valid
  RETURN QUERY 
  SELECT 
    CASE 
      WHEN bi.token IS NOT NULL 
        AND bi.used = FALSE 
        AND bi.expires_at > now() 
      THEN TRUE 
      ELSE FALSE 
    END as is_valid,
    bi.pricing_tier,
    bi.expires_at,
    bi.used
  FROM public.business_invites bi
  WHERE bi.token = p_token::uuid;
  
  -- If no record found, return false
  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, NULL::TEXT, NULL::TIMESTAMPTZ, NULL::BOOLEAN;
  END IF;
END;
$$;

-- Create function to mark business invitation as used
CREATE OR REPLACE FUNCTION mark_business_invitation_used(
  p_token TEXT,
  p_business_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update the invitation to mark as used and link to business
  UPDATE public.business_invites 
  SET 
    used = TRUE,
    business_id = p_business_id
  WHERE token = p_token::uuid
    AND used = FALSE
    AND expires_at > now();
  
  -- Return whether the update was successful
  RETURN FOUND;
END;
$$;

-- Create temporary business setup table for handling payment flow
CREATE TABLE IF NOT EXISTS public.temp_business_setup (
  invitation_token UUID PRIMARY KEY REFERENCES public.business_invites(token) ON DELETE CASCADE,
  stripe_customer_id TEXT NOT NULL,
  stripe_subscription_id TEXT NOT NULL,
  pricing_tier TEXT NOT NULL,
  setup_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add indexes for temp business setup
CREATE INDEX IF NOT EXISTS temp_business_setup_stripe_customer_idx ON public.temp_business_setup(stripe_customer_id);
CREATE INDEX IF NOT EXISTS temp_business_setup_subscription_idx ON public.temp_business_setup(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS temp_business_setup_completed_idx ON public.temp_business_setup(setup_completed);

-- Enable RLS on temp business setup
ALTER TABLE public.temp_business_setup ENABLE ROW LEVEL SECURITY;

-- RLS Policy for temp business setup (accessible during onboarding flow)
CREATE POLICY "Temp business setup accessible during onboarding" ON public.temp_business_setup
  FOR ALL USING (TRUE); -- This is temporary data used during registration flow

-- Update trigger for temp business setup
CREATE TRIGGER update_temp_business_setup_updated_at BEFORE UPDATE ON public.temp_business_setup
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add table comments
COMMENT ON TABLE public.business_invites IS 'Private invitation tokens for business registration';
COMMENT ON COLUMN public.business_invites.token IS 'Unique UUID token for invitation URL';
COMMENT ON COLUMN public.business_invites.pricing_tier IS 'Optional suggested pricing tier for the business';
COMMENT ON COLUMN public.business_invites.used IS 'Whether this invitation has been used for business creation';
COMMENT ON COLUMN public.business_invites.created_by IS 'Admin user who created this invitation';
COMMENT ON COLUMN public.business_invites.business_id IS 'Business ID set after successful registration';

COMMENT ON TABLE public.temp_business_setup IS 'Temporary storage for business setup data during onboarding flow';
COMMENT ON COLUMN public.temp_business_setup.invitation_token IS 'Reference to the business invitation token';
COMMENT ON COLUMN public.temp_business_setup.stripe_customer_id IS 'Stripe customer ID from successful payment';
COMMENT ON COLUMN public.temp_business_setup.stripe_subscription_id IS 'Stripe subscription ID for the business';
COMMENT ON COLUMN public.temp_business_setup.pricing_tier IS 'Selected pricing tier during payment';
COMMENT ON COLUMN public.temp_business_setup.setup_completed IS 'Whether the business setup has been completed';