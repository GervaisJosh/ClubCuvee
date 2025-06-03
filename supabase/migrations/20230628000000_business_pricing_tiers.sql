-- Business pricing tiers with Stripe integration
-- This migration creates the business_pricing_tiers table for managing subscription plans

-- Create business pricing tiers table
CREATE TABLE IF NOT EXISTS public.business_pricing_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  stripe_product_id TEXT,
  stripe_price_id TEXT,
  monthly_price_cents INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  is_custom BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS business_pricing_tiers_active_idx ON public.business_pricing_tiers(is_active);
CREATE INDEX IF NOT EXISTS business_pricing_tiers_custom_idx ON public.business_pricing_tiers(is_custom);
CREATE INDEX IF NOT EXISTS business_pricing_tiers_stripe_product_idx ON public.business_pricing_tiers(stripe_product_id);
CREATE INDEX IF NOT EXISTS business_pricing_tiers_stripe_price_idx ON public.business_pricing_tiers(stripe_price_id);

-- Enable Row Level Security
ALTER TABLE public.business_pricing_tiers ENABLE ROW LEVEL SECURITY;

-- RLS Policy for business pricing tiers (publicly readable for business registration)
CREATE POLICY "Business pricing tiers are publicly readable" ON public.business_pricing_tiers
  FOR SELECT USING (is_active = TRUE);

-- RLS Policy for admin-only updates
CREATE POLICY "Only admins can manage pricing tiers" ON public.business_pricing_tiers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Update trigger for updated_at column
CREATE TRIGGER update_business_pricing_tiers_updated_at BEFORE UPDATE ON public.business_pricing_tiers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert the three pricing tiers
-- Note: You'll need to update the stripe_product_id and stripe_price_id values with actual Stripe IDs
INSERT INTO public.business_pricing_tiers (name, description, stripe_product_id, stripe_price_id, monthly_price_cents, is_custom) VALUES
  (
    'Neighborhood Cellar',
    'Perfect for small local establishments and wine shops looking to build customer loyalty',
    'prod_neighborhood_cellar', -- Replace with actual Stripe product ID
    'price_neighborhood_cellar', -- Replace with actual Stripe price ID
    19900, -- $199.00
    FALSE
  ),
  (
    'World Class Club',
    'Premium tier for established restaurants and high-end wine establishments',
    'prod_world_class_club', -- Replace with actual Stripe product ID
    'price_world_class_club', -- Replace with actual Stripe price ID
    49900, -- $499.00
    FALSE
  ),
  (
    'Custom Tier',
    'Customized pricing and features for enterprise clients - contact us for details',
    NULL, -- No Stripe integration for custom tier
    NULL, -- No Stripe integration for custom tier
    NULL, -- Custom pricing
    TRUE
  );

-- Create function to get active pricing tiers for business registration
CREATE OR REPLACE FUNCTION get_active_pricing_tiers()
RETURNS TABLE(
  id UUID,
  name TEXT,
  description TEXT,
  stripe_product_id TEXT,
  stripe_price_id TEXT,
  monthly_price_cents INTEGER,
  is_custom BOOLEAN
) 
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    id,
    name,
    description,
    stripe_product_id,
    stripe_price_id,
    monthly_price_cents,
    is_custom
  FROM public.business_pricing_tiers 
  WHERE is_active = TRUE
  ORDER BY monthly_price_cents ASC NULLS LAST;
$$;

-- Create function to get pricing tier by ID
CREATE OR REPLACE FUNCTION get_pricing_tier_by_id(p_tier_id UUID)
RETURNS TABLE(
  id UUID,
  name TEXT,
  description TEXT,
  stripe_product_id TEXT,
  stripe_price_id TEXT,
  monthly_price_cents INTEGER,
  is_custom BOOLEAN
) 
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    id,
    name,
    description,
    stripe_product_id,
    stripe_price_id,
    monthly_price_cents,
    is_custom
  FROM public.business_pricing_tiers 
  WHERE id = p_tier_id AND is_active = TRUE;
$$;

-- Add table comments
COMMENT ON TABLE public.business_pricing_tiers IS 'Business subscription pricing tiers with Stripe integration';
COMMENT ON COLUMN public.business_pricing_tiers.name IS 'Display name of the pricing tier';
COMMENT ON COLUMN public.business_pricing_tiers.description IS 'Marketing description of the tier features';
COMMENT ON COLUMN public.business_pricing_tiers.stripe_product_id IS 'Stripe product ID for payment integration';
COMMENT ON COLUMN public.business_pricing_tiers.stripe_price_id IS 'Stripe price ID for subscription creation';
COMMENT ON COLUMN public.business_pricing_tiers.monthly_price_cents IS 'Price in cents (e.g., 19900 = $199.00)';
COMMENT ON COLUMN public.business_pricing_tiers.is_custom IS 'Whether this tier requires custom pricing/setup';