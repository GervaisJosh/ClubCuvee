-- Create api_keys table
CREATE TABLE IF NOT EXISTS public.api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
    opentable_key TEXT,
    toast_key TEXT,
    binwise_key TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(restaurant_id)
);

-- Add RLS policies
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own restaurant's API keys"
    ON public.api_keys
    FOR ALL
    USING (
        auth.uid() IN (
            SELECT user_id 
            FROM public.users 
            WHERE restaurant_id = api_keys.restaurant_id
        )
    );

-- Add pgcrypto extension for encryption
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create function to encrypt API keys
CREATE OR REPLACE FUNCTION encrypt_api_key(key_text TEXT) 
RETURNS TEXT AS $$
BEGIN
    RETURN pgp_sym_encrypt(key_text, current_setting('app.settings.jwt_secret'));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to decrypt API keys
CREATE OR REPLACE FUNCTION decrypt_api_key(encrypted_key TEXT) 
RETURNS TEXT AS $$
BEGIN
    RETURN pgp_sym_decrypt(encrypted_key::bytea, current_setting('app.settings.jwt_secret'));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add triggers to automatically encrypt API keys on insert or update
CREATE TRIGGER encrypt_opentable_key_trigger
BEFORE INSERT OR UPDATE ON public.api_keys
FOR EACH ROW EXECUTE FUNCTION
    encrypt_column_trigger('opentable_key');

CREATE TRIGGER encrypt_toast_key_trigger
BEFORE INSERT OR UPDATE ON public.api_keys
FOR EACH ROW EXECUTE FUNCTION
    encrypt_column_trigger('toast_key');

CREATE TRIGGER encrypt_binwise_key_trigger
BEFORE INSERT OR UPDATE ON public.api_keys
FOR EACH ROW EXECUTE FUNCTION
    encrypt_column_trigger('binwise_key');

-- Function to handle encryption for triggers
CREATE OR REPLACE FUNCTION encrypt_column_trigger() 
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR NEW.${TG_ARGV[0]} <> OLD.${TG_ARGV[0]} THEN
        NEW.${TG_ARGV[0]} := encrypt_api_key(NEW.${TG_ARGV[0]});
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;