-- Update business invitation functions for webhook flow

-- Update the validate function to return business details needed for creation
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
    bi.business_name,
    bi.business_email,
    bi.pricing_tier,
    bi.expires_at,
    bi.used
  FROM public.business_invites bi
  WHERE bi.token = p_token::uuid;
  
  -- If no record found, return false
  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::TIMESTAMPTZ, NULL::BOOLEAN;
  END IF;
END;
$$;

-- Update the mark used function to make business_id optional
CREATE OR REPLACE FUNCTION mark_business_invitation_used(
  p_token TEXT,
  p_business_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update the invitation to mark as used and optionally link to business
  UPDATE public.business_invites 
  SET 
    used = TRUE,
    business_id = COALESCE(p_business_id, business_id)
  WHERE token = p_token::uuid
    AND used = FALSE
    AND expires_at > now();
  
  -- Return whether the update was successful
  RETURN FOUND;
END;
$$;