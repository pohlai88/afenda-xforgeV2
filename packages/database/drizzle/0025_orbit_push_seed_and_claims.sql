-- Orbit push registry seed (system defaults) + JWT orbit_push_capabilities claims.

INSERT INTO "next_forge"."orbit_push_destinations" (
  "id",
  "organizationId",
  "destinationId",
  "label",
  "templateId",
  "requiredCapabilities",
  "visibleToRoles",
  "enabled",
  "updatedAt"
)
VALUES (
  'sys-budget-request',
  NULL,
  'budget-request',
  'Budget Request',
  'budget-request-template',
  '["budget"]'::jsonb,
  '["owner","editor"]'::jsonb,
  true,
  now()
)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "next_forge"."orbit_push_templates" (
  "id",
  "organizationId",
  "destinationId",
  "label",
  "fields",
  "updatedAt"
)
VALUES (
  'budget-request-template',
  NULL,
  'budget-request',
  'Budget Request',
  '[{"key":"title","label":"Title","type":"text","required":true},{"key":"amount","label":"Amount","type":"text","required":false}]'::jsonb,
  now()
)
ON CONFLICT ("id") DO NOTHING;

CREATE OR REPLACE FUNCTION next_forge.orbit_push_capabilities_for_role(role text)
RETURNS jsonb
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE role
    WHEN 'owner' THEN
      '["meeting","discussion","task","approval","budget","expense","purchase","investigation","complaint","lead","risk","project"]'::jsonb
    WHEN 'editor' THEN
      '["budget","meeting","approval","task"]'::jsonb
    ELSE
      '["meeting","task"]'::jsonb
  END;
$$;

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
      'organization_role', to_jsonb(v_org_role),
      'orbit_push_capabilities', next_forge.orbit_push_capabilities_for_role(v_org_role)
    );
  ELSE
    v_app_metadata := v_app_metadata
      - 'organization_id'
      - 'organization_role'
      - 'orbit_push_capabilities';
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
