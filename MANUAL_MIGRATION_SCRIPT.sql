-- MANUAL MIGRATION SCRIPT - Execute this in Supabase SQL Editor
-- This combines the essential parts of all 3 migration files with your real Stripe IDs

-- 1. Create business_pricing_tiers table with real Club Cuvée SaaS tiers
DROP TABLE IF EXISTS public.business_pricing_tiers CASCADE;
CREATE TABLE public.business_pricing_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price_cents INTEGER NOT NULL,
  stripe_product_id TEXT NOT NULL UNIQUE,
  stripe_price_id TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add indexes
CREATE INDEX business_pricing_tiers_active_idx ON public.business_pricing_tiers(is_active);
CREATE INDEX business_pricing_tiers_stripe_product_idx ON public.business_pricing_tiers(stripe_product_id);
CREATE INDEX business_pricing_tiers_stripe_price_idx ON public.business_pricing_tiers(stripe_price_id);

-- Enable RLS
ALTER TABLE public.business_pricing_tiers ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view active business pricing tiers" ON public.business_pricing_tiers
  FOR SELECT USING (is_active = true);

CREATE POLICY "Only admins can manage business pricing tiers" ON public.business_pricing_tiers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- 2. Insert the real Club Cuvée SaaS tiers with your actual Stripe IDs
INSERT INTO public.business_pricing_tiers (name, price_cents, stripe_product_id, stripe_price_id) VALUES
  ('World-Class Wine Club', 75000, 'prod_SOLdG6C78hF5c6', 'price_1RTYwHCNlVsNC9VgwwZJjUKt'),
  ('Sommelier''s Select', 50000, 'prod_SOLcpUXjW2N9ns', 'price_1RTYvfCNlVsNC9Vg01S2E74m'),
  ('Neighborhood Cellar', 30000, 'prod_SOLcYjZQET8p7P', 'price_1RTYv3CNlVsNC9Vg9TDtMRPj')
ON CONFLICT (stripe_product_id) DO NOTHING;

-- 3. Create restaurant_membership_tiers table for customer wine clubs
DROP TABLE IF EXISTS public.restaurant_membership_tiers CASCADE;
CREATE TABLE public.restaurant_membership_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL,
  interval TEXT DEFAULT 'month' CHECK (interval IN ('month', 'year')),
  stripe_product_id TEXT UNIQUE,
  stripe_price_id TEXT UNIQUE,
  is_ready BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add indexes
CREATE INDEX restaurant_membership_tiers_business_idx ON public.restaurant_membership_tiers(business_id);
CREATE INDEX restaurant_membership_tiers_ready_idx ON public.restaurant_membership_tiers(is_ready);

-- Enable RLS
ALTER TABLE public.restaurant_membership_tiers ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Businesses can manage their own membership tiers" ON public.restaurant_membership_tiers
  FOR ALL USING (
    business_id IN (
      SELECT id FROM public.businesses 
      WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view ready membership tiers" ON public.restaurant_membership_tiers
  FOR SELECT USING (is_ready = true);

-- 4. Create customer_memberships table for tracking customer subscriptions
DROP TABLE IF EXISTS public.customer_memberships CASCADE;
CREATE TABLE public.customer_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  tier_id UUID NOT NULL REFERENCES public.restaurant_membership_tiers(id) ON DELETE CASCADE,
  stripe_customer_id TEXT NOT NULL,
  stripe_subscription_id TEXT NOT NULL UNIQUE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid')),
  started_at TIMESTAMPTZ DEFAULT now(),
  canceled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add indexes
CREATE INDEX customer_memberships_customer_email_idx ON public.customer_memberships(customer_email);
CREATE INDEX customer_memberships_business_idx ON public.customer_memberships(business_id);
CREATE INDEX customer_memberships_stripe_subscription_idx ON public.customer_memberships(stripe_subscription_id);

-- Enable RLS
ALTER TABLE public.customer_memberships ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Businesses can view their customer memberships" ON public.customer_memberships
  FOR SELECT USING (
    business_id IN (
      SELECT id FROM public.businesses 
      WHERE owner_id = auth.uid()
    )
  );

-- 5. Create database functions
CREATE OR REPLACE FUNCTION get_active_business_pricing_tiers()
RETURNS TABLE(
  id UUID,
  name TEXT,
  price_cents INTEGER,
  stripe_product_id TEXT,
  stripe_price_id TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY 
  SELECT 
    bpt.id,
    bpt.name,
    bpt.price_cents,
    bpt.stripe_product_id,
    bpt.stripe_price_id
  FROM public.business_pricing_tiers bpt
  WHERE bpt.is_active = true
  ORDER BY bpt.price_cents ASC;
END;
$$;

CREATE OR REPLACE FUNCTION get_restaurant_membership_tiers(p_business_id UUID)
RETURNS TABLE(
  id UUID,
  name TEXT,
  description TEXT,
  price_cents INTEGER,
  interval TEXT,
  stripe_product_id TEXT,
  stripe_price_id TEXT,
  is_ready BOOLEAN
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY 
  SELECT 
    rmt.id,
    rmt.name,
    rmt.description,
    rmt.price_cents,
    rmt.interval,
    rmt.stripe_product_id,
    rmt.stripe_price_id,
    rmt.is_ready
  FROM public.restaurant_membership_tiers rmt
  WHERE rmt.business_id = p_business_id
    AND rmt.is_ready = true
  ORDER BY rmt.price_cents ASC;
END;
$$;

CREATE OR REPLACE FUNCTION get_pricing_tier_details(p_tier_id UUID)
RETURNS TABLE(
  id UUID,
  name TEXT,
  price_cents INTEGER,
  stripe_product_id TEXT,
  stripe_price_id TEXT,
  tier_key TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY 
  SELECT 
    bpt.id,
    bpt.name,
    bpt.price_cents,
    bpt.stripe_product_id,
    bpt.stripe_price_id,
    CASE 
      WHEN bpt.name = 'World-Class Wine Club' THEN 'world_class_club'
      WHEN bpt.name = 'Sommelier''s Select' THEN 'sommelier_select'
      WHEN bpt.name = 'Neighborhood Cellar' THEN 'neighborhood_cellar'
      ELSE 'custom'
    END as tier_key
  FROM public.business_pricing_tiers bpt
  WHERE bpt.id = p_tier_id
    AND bpt.is_active = true;
END;
$$;

-- 6. Update business invitation functions
CREATE OR REPLACE FUNCTION validate_business_invitation_token(
  p_token TEXT
)
RETURNS TABLE(
  is_valid BOOLEAN,
  business_name TEXT,
  business_email TEXT,
  pricing_tier TEXT,
  expires_at TIMESTAMPTZ,
  used BOOLEAN
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY 
  SELECT 
    CASE 
      WHEN bi.token IS NOT NULL 
        AND bi.used = FALSE 
        AND bi.expires_at > now() 
      THEN TRUE 
      ELSE FALSE 
    END as is_valid,
    bi.business_name,
    bi.business_email,
    bi.pricing_tier,
    bi.expires_at,
    bi.used
  FROM public.business_invites bi
  WHERE bi.token = p_token::uuid;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::TIMESTAMPTZ, NULL::BOOLEAN;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION mark_business_invitation_used(
  p_token TEXT,
  p_business_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.business_invites 
  SET 
    used = TRUE,
    business_id = COALESCE(p_business_id, business_id)
  WHERE token = p_token::uuid
    AND used = FALSE
    AND expires_at > now();
  
  RETURN FOUND;
END;
$$;