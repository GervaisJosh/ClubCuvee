-- Create businesses table
CREATE TABLE IF NOT EXISTS public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL UNIQUE,
  admin_user_id UUID REFERENCES auth.users(id),
  stripe_customer_id VARCHAR,
  subscription_status VARCHAR DEFAULT 'inactive',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create onboarding_tokens table
CREATE TABLE IF NOT EXISTS public.onboarding_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token VARCHAR NOT NULL UNIQUE,
  email VARCHAR NOT NULL,
  stripe_price_id VARCHAR NOT NULL,
  business_id UUID REFERENCES public.businesses(id),
  status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'checkout_created', 'payment_completed', 'business_created', 'expired')),
  stripe_session_id VARCHAR,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create membership_tiers table
CREATE TABLE IF NOT EXISTS public.membership_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  description TEXT,
  price_markup_percentage DECIMAL(5,2) DEFAULT 0,
  stripe_product_id VARCHAR,
  stripe_price_id VARCHAR,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create subscriptions table for tracking business subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  stripe_subscription_id VARCHAR NOT NULL UNIQUE,
  stripe_customer_id VARCHAR NOT NULL,
  stripe_price_id VARCHAR NOT NULL,
  status VARCHAR NOT NULL,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create customer_memberships table for tracking customer subscriptions to businesses
CREATE TABLE IF NOT EXISTS public.customer_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_user_id UUID REFERENCES auth.users(id),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  tier_id UUID REFERENCES public.membership_tiers(id),
  stripe_subscription_id VARCHAR,
  status VARCHAR DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS onboarding_tokens_token_idx ON public.onboarding_tokens(token);
CREATE INDEX IF NOT EXISTS onboarding_tokens_email_idx ON public.onboarding_tokens(email);
CREATE INDEX IF NOT EXISTS onboarding_tokens_status_idx ON public.onboarding_tokens(status);
CREATE INDEX IF NOT EXISTS businesses_email_idx ON public.businesses(email);
CREATE INDEX IF NOT EXISTS subscriptions_stripe_subscription_idx ON public.subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS customer_memberships_business_idx ON public.customer_memberships(business_id);

-- Add updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON public.businesses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_onboarding_tokens_updated_at BEFORE UPDATE ON public.onboarding_tokens
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_membership_tiers_updated_at BEFORE UPDATE ON public.membership_tiers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_memberships_updated_at BEFORE UPDATE ON public.customer_memberships
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add table comments
COMMENT ON TABLE public.businesses IS 'Stores business information for Club Cuvée partners';
COMMENT ON TABLE public.onboarding_tokens IS 'Secure tokens for business onboarding process';
COMMENT ON TABLE public.membership_tiers IS 'Wine club membership tiers for each business';
COMMENT ON TABLE public.subscriptions IS 'Business subscriptions to Club Cuvée platform';
COMMENT ON TABLE public.customer_memberships IS 'Customer memberships to business wine clubs';