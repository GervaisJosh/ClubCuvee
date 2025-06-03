-- Complete Stripe integration for Club Cuvée
-- This migration creates both business SaaS tiers and restaurant membership tiers

-- 1. Create business_pricing_tiers table for Club Cuvée SaaS subscriptions
CREATE TABLE IF NOT EXISTS public.business_pricing_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price_cents INTEGER NOT NULL,
  stripe_product_id TEXT NOT NULL UNIQUE,
  stripe_price_id TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS business_pricing_tiers_active_idx ON public.business_pricing_tiers(is_active);
CREATE INDEX IF NOT EXISTS business_pricing_tiers_stripe_product_idx ON public.business_pricing_tiers(stripe_product_id);
CREATE INDEX IF NOT EXISTS business_pricing_tiers_stripe_price_idx ON public.business_pricing_tiers(stripe_price_id);

-- Enable Row Level Security
ALTER TABLE public.business_pricing_tiers ENABLE ROW LEVEL SECURITY;

-- RLS Policy for business pricing tiers (read-only for authenticated users, admin-only for modifications)
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

-- 2. Insert the real Club Cuvée SaaS tiers with actual Stripe IDs
INSERT INTO public.business_pricing_tiers (name, price_cents, stripe_product_id, stripe_price_id) VALUES
  ('World-Class Wine Club', 75000, 'prod_SOLdG6C78hF5c6', 'price_1RTYwHCNlVsNC9VgwwZJjUKt'),
  ('Sommelier''s Select', 49999, 'prod_SOLcpUXjW2N9ns', 'price_1RTYvfCNlVsNC9Vg01S2E74m'),
  ('Neighborhood Cellar', 30000, 'prod_SOLcYjZQET8p7P', 'price_1RTYv3CNlVsNC9Vg9TDtMRPj')
ON CONFLICT (stripe_product_id) DO NOTHING;

-- 3. Create restaurant_membership_tiers table for customer wine clubs
CREATE TABLE IF NOT EXISTS public.restaurant_membership_tiers (
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

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS restaurant_membership_tiers_business_idx ON public.restaurant_membership_tiers(business_id);
CREATE INDEX IF NOT EXISTS restaurant_membership_tiers_ready_idx ON public.restaurant_membership_tiers(is_ready);
CREATE INDEX IF NOT EXISTS restaurant_membership_tiers_stripe_product_idx ON public.restaurant_membership_tiers(stripe_product_id);
CREATE INDEX IF NOT EXISTS restaurant_membership_tiers_stripe_price_idx ON public.restaurant_membership_tiers(stripe_price_id);

-- Enable Row Level Security
ALTER TABLE public.restaurant_membership_tiers ENABLE ROW LEVEL SECURITY;

-- RLS Policy for restaurant membership tiers
CREATE POLICY "Businesses can manage their own membership tiers" ON public.restaurant_membership_tiers
  FOR ALL USING (
    business_id IN (
      SELECT id FROM public.businesses 
      WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view ready membership tiers" ON public.restaurant_membership_tiers
  FOR SELECT USING (is_ready = true);

-- Update trigger for restaurant_membership_tiers
CREATE TRIGGER update_restaurant_membership_tiers_updated_at 
  BEFORE UPDATE ON public.restaurant_membership_tiers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. Create function to get active business pricing tiers
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

-- 5. Create function to get restaurant membership tiers for a business
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

-- 6. Create function to update business pricing tier validation in existing function
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

-- Add table comments
COMMENT ON TABLE public.business_pricing_tiers IS 'Club Cuvée SaaS subscription tiers for business onboarding';
COMMENT ON COLUMN public.business_pricing_tiers.price_cents IS 'Monthly subscription price in cents';
COMMENT ON COLUMN public.business_pricing_tiers.stripe_product_id IS 'Stripe Product ID for the subscription';
COMMENT ON COLUMN public.business_pricing_tiers.stripe_price_id IS 'Stripe Price ID for recurring billing';

COMMENT ON TABLE public.restaurant_membership_tiers IS 'Wine club membership tiers offered by individual restaurants to customers';
COMMENT ON COLUMN public.restaurant_membership_tiers.business_id IS 'Restaurant/business that owns this membership tier';
COMMENT ON COLUMN public.restaurant_membership_tiers.price_cents IS 'Membership price in cents';
COMMENT ON COLUMN public.restaurant_membership_tiers.interval IS 'Billing interval: month or year';
COMMENT ON COLUMN public.restaurant_membership_tiers.stripe_product_id IS 'Auto-created Stripe Product ID';
COMMENT ON COLUMN public.restaurant_membership_tiers.stripe_price_id IS 'Auto-created Stripe Price ID';
COMMENT ON COLUMN public.restaurant_membership_tiers.is_ready IS 'Whether Stripe product/price creation is complete and tier is ready for customer signup';

-- 7. Create customer_memberships table for tracking customer wine club subscriptions
CREATE TABLE IF NOT EXISTS public.customer_memberships (
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

-- Add indexes for customer memberships
CREATE INDEX IF NOT EXISTS customer_memberships_customer_email_idx ON public.customer_memberships(customer_email);
CREATE INDEX IF NOT EXISTS customer_memberships_business_idx ON public.customer_memberships(business_id);
CREATE INDEX IF NOT EXISTS customer_memberships_tier_idx ON public.customer_memberships(tier_id);
CREATE INDEX IF NOT EXISTS customer_memberships_stripe_customer_idx ON public.customer_memberships(stripe_customer_id);
CREATE INDEX IF NOT EXISTS customer_memberships_stripe_subscription_idx ON public.customer_memberships(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS customer_memberships_status_idx ON public.customer_memberships(status);

-- Enable Row Level Security
ALTER TABLE public.customer_memberships ENABLE ROW LEVEL SECURITY;

-- RLS Policy for customer memberships
CREATE POLICY "Businesses can view their customer memberships" ON public.customer_memberships
  FOR SELECT USING (
    business_id IN (
      SELECT id FROM public.businesses 
      WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Customers can view their own memberships" ON public.customer_memberships
  FOR SELECT USING (
    customer_email = (auth.jwt() ->> 'email')
  );

-- Update trigger for customer memberships
CREATE TRIGGER update_customer_memberships_updated_at 
  BEFORE UPDATE ON public.customer_memberships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. Create function to get customer memberships for a business
CREATE OR REPLACE FUNCTION get_customer_memberships(p_business_id UUID)
RETURNS TABLE(
  id UUID,
  customer_email TEXT,
  customer_name TEXT,
  tier_name TEXT,
  tier_price_cents INTEGER,
  tier_interval TEXT,
  status TEXT,
  started_at TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY 
  SELECT 
    cm.id,
    cm.customer_email,
    cm.customer_name,
    rmt.name as tier_name,
    rmt.price_cents as tier_price_cents,
    rmt.interval as tier_interval,
    cm.status,
    cm.started_at,
    cm.canceled_at
  FROM public.customer_memberships cm
  JOIN public.restaurant_membership_tiers rmt ON cm.tier_id = rmt.id
  WHERE cm.business_id = p_business_id
  ORDER BY cm.created_at DESC;
END;
$$;

COMMENT ON TABLE public.customer_memberships IS 'Customer wine club memberships and subscription tracking';
COMMENT ON COLUMN public.customer_memberships.customer_email IS 'Customer email address';
COMMENT ON COLUMN public.customer_memberships.stripe_customer_id IS 'Stripe Customer ID for this membership';
COMMENT ON COLUMN public.customer_memberships.stripe_subscription_id IS 'Stripe Subscription ID for recurring billing';
COMMENT ON COLUMN public.customer_memberships.status IS 'Membership status: active, canceled, past_due, unpaid';