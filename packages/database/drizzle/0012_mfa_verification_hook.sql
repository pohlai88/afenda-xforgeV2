-- MFA verification hook: rate-limit failed MFA attempts to once every 2 seconds per factor.
-- See: https://supabase.com/docs/guides/auth/auth-hooks/mfa-verification-hook

CREATE TABLE IF NOT EXISTS public.mfa_failed_verification_attempts (
  user_id uuid NOT NULL,
  factor_id uuid NOT NULL,
  last_failed_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, factor_id)
);

REVOKE ALL ON TABLE public.mfa_failed_verification_attempts
  FROM authenticated, anon, public;

GRANT ALL ON TABLE public.mfa_failed_verification_attempts
  TO supabase_auth_admin;

CREATE OR REPLACE FUNCTION public.hook_mfa_verification_attempt(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := (event->>'user_id')::uuid;
  v_factor_id uuid := (event->>'factor_id')::uuid;
  v_last_failed_at timestamptz;
BEGIN
  IF coalesce((event->>'valid')::boolean, false) THEN
    RETURN jsonb_build_object('decision', 'continue');
  END IF;

  SELECT last_failed_at
  INTO v_last_failed_at
  FROM public.mfa_failed_verification_attempts
  WHERE user_id = v_user_id
    AND factor_id = v_factor_id;

  IF v_last_failed_at IS NOT NULL
     AND now() - v_last_failed_at < interval '2 seconds' THEN
    RETURN jsonb_build_object(
      'error', jsonb_build_object(
        'http_code', 429,
        'message', 'Please wait a moment before trying again.'
      )
    );
  END IF;

  INSERT INTO public.mfa_failed_verification_attempts (
    user_id,
    factor_id,
    last_failed_at
  )
  VALUES (v_user_id, v_factor_id, now())
  ON CONFLICT (user_id, factor_id) DO UPDATE
    SET last_failed_at = excluded.last_failed_at;

  RETURN jsonb_build_object('decision', 'continue');
END;
$$;

GRANT USAGE ON SCHEMA public TO supabase_auth_admin;

GRANT EXECUTE ON FUNCTION public.hook_mfa_verification_attempt(jsonb)
  TO supabase_auth_admin;

REVOKE EXECUTE ON FUNCTION public.hook_mfa_verification_attempt(jsonb)
  FROM authenticated, anon, public;
