-- Create restaurant_invitations table for secure onboarding tokens
CREATE TABLE IF NOT EXISTS public.restaurant_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token VARCHAR NOT NULL UNIQUE,
  email VARCHAR NOT NULL,
  restaurant_name VARCHAR NOT NULL,
  website VARCHAR,
  admin_name VARCHAR,
  tier VARCHAR DEFAULT 'standard',
  payment_session_id VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'paid', 'completed', 'expired')),
  restaurant_id UUID REFERENCES public.restaurants(id)
);

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS restaurant_invitations_token_idx ON public.restaurant_invitations(token);
CREATE INDEX IF NOT EXISTS restaurant_invitations_email_idx ON public.restaurant_invitations(email);
CREATE INDEX IF NOT EXISTS restaurant_invitations_status_idx ON public.restaurant_invitations(status);

-- Add table comments
COMMENT ON TABLE public.restaurant_invitations IS 'Stores restaurant invitation tokens for secure onboarding process';

-- Ensure restaurants table has the necessary fields
ALTER TABLE public.restaurants 
ADD COLUMN IF NOT EXISTS payment_session_id VARCHAR,
ADD COLUMN IF NOT EXISTS payment_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS payment_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS registration_complete BOOLEAN DEFAULT FALSE;

-- Ensure customers table has subscription fields
ALTER TABLE public.customers
ADD COLUMN IF NOT EXISTS subscription_status VARCHAR,
ADD COLUMN IF NOT EXISTS subscription_start_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMP WITH TIME ZONE;

-- Create table for tracking subscription payments
CREATE TABLE IF NOT EXISTS public.subscription_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stripe_invoice_id VARCHAR NOT NULL,
  stripe_subscription_id VARCHAR NOT NULL,
  stripe_customer_id VARCHAR NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR NOT NULL,
  status VARCHAR NOT NULL,
  payment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add indexes for payment tracking
CREATE INDEX IF NOT EXISTS subscription_payments_invoice_idx ON public.subscription_payments(stripe_invoice_id);
CREATE INDEX IF NOT EXISTS subscription_payments_subscription_idx ON public.subscription_payments(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS subscription_payments_customer_idx ON public.subscription_payments(stripe_customer_id);