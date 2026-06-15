-- Custom access token hook: resolve activeOrganizationId in JWT user_metadata.
-- Membership is still verified server-side; this keeps the JWT preference aligned with org membership.
-- See: https://supabase.com/docs/guides/auth/auth-hooks/custom-access-token-hook

GRANT USAGE ON SCHEMA next_forge TO supabase_auth_admin;

GRANT SELECT ON TABLE next_forge.organization_members
  TO supabase_auth_admin;

CREATE OR REPLACE FUNCTION public.hook_custom_access_token(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SET search_path = public, next_forge
AS $$
DECLARE
  v_user_id uuid := (event->>'user_id')::uuid;
  v_user_id_text text := v_user_id::text;
  v_claims jsonb := event->'claims';
  v_user_metadata jsonb;
  v_preferred text;
  v_resolved text;
BEGIN
  SELECT om."organizationId"
  INTO v_resolved
  FROM next_forge.organization_members AS om
  WHERE om."userId" = v_user_id_text
  ORDER BY om."createdAt" ASC NULLS LAST, om."organizationId" ASC
  LIMIT 1;

  v_user_metadata := COALESCE(v_claims->'user_metadata', '{}'::jsonb);

  IF v_resolved IS NULL THEN
    IF v_user_metadata ? 'activeOrganizationId' THEN
      v_user_metadata := v_user_metadata - 'activeOrganizationId';
      v_claims := jsonb_set(v_claims, '{user_metadata}', v_user_metadata);
    END IF;

    RETURN jsonb_build_object('claims', v_claims);
  END IF;

  v_preferred := v_user_metadata->>'activeOrganizationId';

  IF v_preferred IS NOT NULL
     AND EXISTS (
       SELECT 1
       FROM next_forge.organization_members AS om
       WHERE om."userId" = v_user_id_text
         AND om."organizationId" = v_preferred
     ) THEN
    v_resolved := v_preferred;
  END IF;

  v_user_metadata :=
    v_user_metadata || jsonb_build_object('activeOrganizationId', v_resolved);
  v_claims := jsonb_set(v_claims, '{user_metadata}', v_user_metadata);

  RETURN jsonb_build_object('claims', v_claims);
END;
$$;

GRANT EXECUTE ON FUNCTION public.hook_custom_access_token(jsonb)
  TO supabase_auth_admin;

REVOKE EXECUTE ON FUNCTION public.hook_custom_access_token(jsonb)
  FROM authenticated, anon, public;
