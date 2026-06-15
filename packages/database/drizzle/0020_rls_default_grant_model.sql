-- RLS-first grant model: deny by default, explicit grants + policies per table.
-- Cross-company exceptions are limited to supabase_auth_admin (JWT hook) and server roles.

-- ---------------------------------------------------------------------------
-- 1. Revoke legacy blanket schema grants (0001_pages_and_rls.sql).
-- ---------------------------------------------------------------------------
REVOKE ALL ON ALL TABLES IN SCHEMA next_forge FROM anon, authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA next_forge FROM anon, authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA next_forge
  REVOKE ALL ON TABLES FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA next_forge
  REVOKE ALL ON SEQUENCES FROM anon, authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  REVOKE ALL ON TABLES FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  REVOKE ALL ON SEQUENCES FROM anon, authenticated;

GRANT USAGE ON SCHEMA next_forge TO authenticated, anon, service_role;

-- ---------------------------------------------------------------------------
-- 2. Org-scoped RLS helpers (SECURITY DEFINER — membership lookup only).
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION next_forge.request_organization_id()
RETURNS text
LANGUAGE sql
STABLE
SET search_path = next_forge, public
AS $$
  SELECT nullif(trim(auth.jwt() -> 'app_metadata' ->> 'organization_id'), '');
$$;

CREATE OR REPLACE FUNCTION next_forge.is_organization_member(p_organization_id text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = next_forge, public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM next_forge.organization_members om
    WHERE om."organizationId" = p_organization_id
      AND om."userId" = (SELECT auth.uid())::text
  );
$$;

CREATE OR REPLACE FUNCTION next_forge.is_organization_owner(p_organization_id text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = next_forge, public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM next_forge.organization_members om
    WHERE om."organizationId" = p_organization_id
      AND om."userId" = (SELECT auth.uid())::text
      AND om.role = 'owner'
  );
$$;

REVOKE ALL ON FUNCTION next_forge.request_organization_id() FROM PUBLIC;
REVOKE ALL ON FUNCTION next_forge.is_organization_member(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION next_forge.is_organization_owner(text) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION next_forge.request_organization_id() TO authenticated;
GRANT EXECUTE ON FUNCTION next_forge.is_organization_member(text) TO authenticated;
GRANT EXECUTE ON FUNCTION next_forge.is_organization_owner(text) TO authenticated;

-- Cross-company (auth hook): supabase_auth_admin reads membership for any user JWT.
-- (Granted in 0015_custom_access_token_hook.sql — do not grant to authenticated.)

-- ---------------------------------------------------------------------------
-- 3. RLS policies — org membership is the default tenant boundary.
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "organization_members_select_own" ON "next_forge"."organization_members";
DROP POLICY IF EXISTS "organization_members_insert_own" ON "next_forge"."organization_members";
DROP POLICY IF EXISTS "organization_members_update_own" ON "next_forge"."organization_members";
DROP POLICY IF EXISTS "organization_members_delete_own" ON "next_forge"."organization_members";

CREATE POLICY "organization_members_select_memberships"
  ON "next_forge"."organization_members"
  FOR SELECT
  TO authenticated
  USING (
    (SELECT auth.uid()) IS NOT NULL
    AND "userId" = (SELECT auth.uid())::text
  );

DROP POLICY IF EXISTS "organizations_select_member" ON "next_forge"."organizations";
CREATE POLICY "organizations_select_member"
  ON "next_forge"."organizations"
  FOR SELECT
  TO authenticated
  USING ((SELECT next_forge.is_organization_member(id)));

DROP POLICY IF EXISTS "organizations_update_owner" ON "next_forge"."organizations";
CREATE POLICY "organizations_update_owner"
  ON "next_forge"."organizations"
  FOR UPDATE
  TO authenticated
  USING ((SELECT next_forge.is_organization_owner(id)))
  WITH CHECK ((SELECT next_forge.is_organization_owner(id)));

DROP POLICY IF EXISTS "webhook_endpoints_select_member" ON "next_forge"."webhook_endpoints";
CREATE POLICY "webhook_endpoints_select_member"
  ON "next_forge"."webhook_endpoints"
  FOR SELECT
  TO authenticated
  USING ((SELECT next_forge.is_organization_member("organizationId")));

DROP POLICY IF EXISTS "webhook_endpoints_insert_owner" ON "next_forge"."webhook_endpoints";
CREATE POLICY "webhook_endpoints_insert_owner"
  ON "next_forge"."webhook_endpoints"
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT next_forge.is_organization_owner("organizationId")));

DROP POLICY IF EXISTS "webhook_endpoints_update_owner" ON "next_forge"."webhook_endpoints";
CREATE POLICY "webhook_endpoints_update_owner"
  ON "next_forge"."webhook_endpoints"
  FOR UPDATE
  TO authenticated
  USING ((SELECT next_forge.is_organization_owner("organizationId")))
  WITH CHECK ((SELECT next_forge.is_organization_owner("organizationId")));

DROP POLICY IF EXISTS "webhook_endpoints_delete_owner" ON "next_forge"."webhook_endpoints";
CREATE POLICY "webhook_endpoints_delete_owner"
  ON "next_forge"."webhook_endpoints"
  FOR DELETE
  TO authenticated
  USING ((SELECT next_forge.is_organization_owner("organizationId")));

DROP POLICY IF EXISTS "webhook_deliveries_select_member" ON "next_forge"."webhook_deliveries";
CREATE POLICY "webhook_deliveries_select_member"
  ON "next_forge"."webhook_deliveries"
  FOR SELECT
  TO authenticated
  USING ((SELECT next_forge.is_organization_member("organizationId")));

-- ---------------------------------------------------------------------------
-- 4. Explicit PostgREST grants (RLS still required). Server/Drizzle uses postgres.
-- ---------------------------------------------------------------------------

-- User profile (self only — RLS on public.profiles).
REVOKE ALL ON TABLE public.profiles FROM anon, authenticated;
GRANT SELECT ON TABLE public.profiles TO authenticated;
GRANT UPDATE (display_name, avatar_url) ON TABLE public.profiles TO authenticated;

-- Multi-company: users list every org they belong to (same userId, many org rows).
GRANT SELECT ON TABLE "next_forge"."organization_members" TO authenticated;

-- Org directory + owner rename.
GRANT SELECT ON TABLE "next_forge"."organizations" TO authenticated;
REVOKE UPDATE ON TABLE "next_forge"."organizations" FROM authenticated;
GRANT UPDATE (name) ON TABLE "next_forge"."organizations" TO authenticated;

-- pages: server-only — see 0021_pages_server_only.sql.

-- Server-only (no PostgREST): cms, webhooks, hook tables, pages.
REVOKE ALL ON TABLE "next_forge"."cms_documents" FROM anon, authenticated;
REVOKE ALL ON TABLE "next_forge"."cms_document_revisions" FROM anon, authenticated;
REVOKE ALL ON TABLE "next_forge"."webhook_endpoints" FROM anon, authenticated;
REVOKE ALL ON TABLE "next_forge"."webhook_deliveries" FROM anon, authenticated;

-- ---------------------------------------------------------------------------
-- 5. New tables: enable RLS and revoke client grants automatically.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.rls_auto_enable()
RETURNS event_trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table', 'partitioned table')
  LOOP
    IF cmd.schema_name IS NOT NULL
      AND cmd.schema_name IN ('public', 'next_forge')
      AND cmd.schema_name NOT IN ('pg_catalog', 'information_schema')
      AND cmd.schema_name NOT LIKE 'pg_toast%'
      AND cmd.schema_name NOT LIKE 'pg_temp%'
    THEN
      BEGIN
        EXECUTE format(
          'ALTER TABLE IF EXISTS %s ENABLE ROW LEVEL SECURITY',
          cmd.object_identity
        );
        EXECUTE format(
          'REVOKE ALL ON TABLE %s FROM anon, authenticated',
          cmd.object_identity
        );
        RAISE LOG 'rls_auto_enable: enabled RLS and revoked client grants on %',
          cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed on %', cmd.object_identity;
      END;
    END IF;
  END LOOP;
END;
$$;

REVOKE ALL ON FUNCTION public.rls_auto_enable() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.rls_auto_enable() FROM anon, authenticated;
