-- Enhanced security and private access for Club Cuvée
-- This migration enforces the private, invite-only business model

-- Create customer invitation tokens table
CREATE TABLE IF NOT EXISTS public.customer_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token VARCHAR NOT NULL UNIQUE,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  email VARCHAR NOT NULL,
  tier_id UUID REFERENCES public.membership_tiers(id),
  status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'used', 'expired')),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  used_at TIMESTAMPTZ,
  customer_user_id UUID -- Will be set when customer registers
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS customer_invitations_token_idx ON public.customer_invitations(token);
CREATE INDEX IF NOT EXISTS customer_invitations_business_idx ON public.customer_invitations(business_id);
CREATE INDEX IF NOT EXISTS customer_invitations_email_idx ON public.customer_invitations(email);
CREATE INDEX IF NOT EXISTS customer_invitations_status_idx ON public.customer_invitations(status);

-- Update customer_memberships to ensure business_id relationship
ALTER TABLE public.customer_memberships 
ADD COLUMN IF NOT EXISTS invitation_token VARCHAR REFERENCES public.customer_invitations(token);

-- Create table for customer user profiles (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.customer_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  email VARCHAR NOT NULL,
  first_name VARCHAR,
  last_name VARCHAR,
  phone VARCHAR,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add indexes for customer profiles
CREATE INDEX IF NOT EXISTS customer_profiles_business_idx ON public.customer_profiles(business_id);
CREATE INDEX IF NOT EXISTS customer_profiles_email_idx ON public.customer_profiles(email);

-- Enable Row Level Security (RLS) on all customer-facing tables
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_invitations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Businesses
-- Only allow business admins to see their own business data
CREATE POLICY "Businesses can only be accessed by their admin users" ON public.businesses
  FOR ALL USING (admin_user_id = auth.uid());

-- Allow customers to read their business info
CREATE POLICY "Customers can view their business info" ON public.businesses
  FOR SELECT USING (
    id IN (
      SELECT business_id FROM public.customer_profiles 
      WHERE id = auth.uid()
    )
  );

-- RLS Policies for Membership Tiers
-- Only allow access to tiers from customer's business
CREATE POLICY "Customers can only view tiers from their business" ON public.membership_tiers
  FOR SELECT USING (
    business_id IN (
      SELECT business_id FROM public.customer_profiles 
      WHERE id = auth.uid()
    )
  );

-- Allow business admins to manage their tiers
CREATE POLICY "Business admins can manage their tiers" ON public.membership_tiers
  FOR ALL USING (
    business_id IN (
      SELECT id FROM public.businesses 
      WHERE admin_user_id = auth.uid()
    )
  );

-- RLS Policies for Customer Memberships
-- Customers can only see their own memberships
CREATE POLICY "Customers can only access their own memberships" ON public.customer_memberships
  FOR ALL USING (customer_user_id = auth.uid());

-- Business admins can see memberships for their business
CREATE POLICY "Business admins can view their customer memberships" ON public.customer_memberships
  FOR SELECT USING (
    business_id IN (
      SELECT id FROM public.businesses 
      WHERE admin_user_id = auth.uid()
    )
  );

-- RLS Policies for Customer Profiles
-- Customers can only access their own profile
CREATE POLICY "Customers can access their own profile" ON public.customer_profiles
  FOR ALL USING (id = auth.uid());

-- Business admins can view their customer profiles
CREATE POLICY "Business admins can view their customer profiles" ON public.customer_profiles
  FOR SELECT USING (
    business_id IN (
      SELECT id FROM public.businesses 
      WHERE admin_user_id = auth.uid()
    )
  );

-- RLS Policies for Customer Invitations
-- Only business admins can manage invitations for their business
CREATE POLICY "Business admins can manage their invitations" ON public.customer_invitations
  FOR ALL USING (
    business_id IN (
      SELECT id FROM public.businesses 
      WHERE admin_user_id = auth.uid()
    )
  );

-- Update triggers for updated_at columns
CREATE TRIGGER update_customer_invitations_updated_at BEFORE UPDATE ON public.customer_invitations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_profiles_updated_at BEFORE UPDATE ON public.customer_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add table comments
COMMENT ON TABLE public.customer_invitations IS 'Private invitation tokens for customer registration';
COMMENT ON TABLE public.customer_profiles IS 'Customer user profiles scoped to specific businesses';

-- Create function to generate customer invitation links
CREATE OR REPLACE FUNCTION generate_customer_invitation(
  p_business_id UUID,
  p_email VARCHAR,
  p_tier_id UUID DEFAULT NULL
)
RETURNS TABLE(
  token VARCHAR,
  invitation_url VARCHAR
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_token VARCHAR;
  v_expires_at TIMESTAMPTZ;
BEGIN
  -- Only allow business admins to generate invitations
  IF NOT EXISTS (
    SELECT 1 FROM public.businesses 
    WHERE id = p_business_id AND admin_user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Only business admins can generate invitations';
  END IF;

  -- Generate unique token
  v_token := encode(gen_random_bytes(32), 'base64url');
  v_expires_at := now() + interval '7 days'; -- 7-day expiry for customer invitations

  -- Insert invitation record
  INSERT INTO public.customer_invitations (
    token,
    business_id,
    email,
    tier_id,
    expires_at
  ) VALUES (
    v_token,
    p_business_id,
    p_email,
    p_tier_id,
    v_expires_at
  );

  -- Return token and URL
  RETURN QUERY SELECT 
    v_token,
    CONCAT('/join/', v_token) as invitation_url;
END;
$$;