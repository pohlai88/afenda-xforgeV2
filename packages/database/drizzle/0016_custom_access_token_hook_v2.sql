-- Custom access token hook v2: DB-backed org claims + smaller JWT user_metadata.
-- Adds app_metadata.organization_id / organization_role (membership verified in hook).
-- Trims user_metadata to name + activeOrganizationId (drops OAuth bloat / avatar URLs).
-- See: https://supabase.com/docs/guides/auth/auth-hooks/custom-access-token-hook

CREATE OR REPLACE FUNCTION public.hook_custom_access_token(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, next_forge
AS $$
DECLARE
  v_user_id_text text := event->>'user_id';
  v_claims jsonb := COALESCE(event->'claims', '{}'::jsonb);
  v_user_metadata jsonb;
  v_app_metadata jsonb;
  v_trimmed_metadata jsonb := '{}'::jsonb;
  v_preferred text;
  v_org_id text;
  v_org_role text;
BEGIN
  v_user_metadata := COALESCE(v_claims->'user_metadata', '{}'::jsonb);
  v_preferred := v_user_metadata->>'activeOrganizationId';

  IF v_preferred IS NOT NULL THEN
    SELECT om."organizationId", om."role"
    INTO v_org_id, v_org_role
    FROM next_forge.organization_members AS om
    WHERE om."userId" = v_user_id_text
      AND om."organizationId" = v_preferred
    LIMIT 1;
  END IF;

  IF v_org_id IS NULL THEN
    SELECT om."organizationId", om."role"
    INTO v_org_id, v_org_role
    FROM next_forge.organization_members AS om
    WHERE om."userId" = v_user_id_text
    ORDER BY om."createdAt" ASC NULLS LAST, om."organizationId" ASC
    LIMIT 1;
  END IF;

  v_app_metadata := COALESCE(v_claims->'app_metadata', '{}'::jsonb);

  IF v_org_id IS NOT NULL THEN
    v_app_metadata := v_app_metadata || jsonb_build_object(
      'organization_id', to_jsonb(v_org_id),
      'organization_role', to_jsonb(v_org_role)
    );
  ELSE
    v_app_metadata := v_app_metadata - 'organization_id' - 'organization_role';
  END IF;

  v_claims := jsonb_set(v_claims, '{app_metadata}', v_app_metadata);

  IF NULLIF(trim(v_user_metadata->>'name'), '') IS NOT NULL THEN
    v_trimmed_metadata :=
      v_trimmed_metadata || jsonb_build_object('name', v_user_metadata->'name');
  END IF;

  IF v_org_id IS NOT NULL THEN
    v_trimmed_metadata :=
      v_trimmed_metadata
      || jsonb_build_object('activeOrganizationId', to_jsonb(v_org_id));
  END IF;

  v_claims := jsonb_set(v_claims, '{user_metadata}', v_trimmed_metadata);

  RETURN jsonb_build_object('claims', v_claims);
END;
$$;
