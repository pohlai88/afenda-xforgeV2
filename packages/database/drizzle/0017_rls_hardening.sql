-- RLS hardening: lock down PostgREST exposure, revoke trigger RPC, auto-enable RLS on new tables.

-- 1. sync_profile_from_auth_user is trigger-only — not callable via PostgREST RPC.
REVOKE ALL ON FUNCTION public.sync_profile_from_auth_user() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.sync_profile_from_auth_user() FROM anon, authenticated;

-- 2. Explicit auth checks on profile policies (auth.uid() IS NOT NULL).
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    (SELECT auth.uid()) IS NOT NULL
    AND id = (SELECT auth.uid())
  );

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (
    (SELECT auth.uid()) IS NOT NULL
    AND id = (SELECT auth.uid())
  )
  WITH CHECK (
    (SELECT auth.uid()) IS NOT NULL
    AND id = (SELECT auth.uid())
  );

-- 3. Auth hook tables: RLS on, no client policies (deny-by-default via PostgREST).
ALTER TABLE public.mfa_failed_verification_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_failed_verification_attempts ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.mfa_failed_verification_attempts
  FROM authenticated, anon, public;
REVOKE ALL ON TABLE public.password_failed_verification_attempts
  FROM authenticated, anon, public;

GRANT ALL ON TABLE public.mfa_failed_verification_attempts
  TO supabase_auth_admin;
GRANT ALL ON TABLE public.password_failed_verification_attempts
  TO supabase_auth_admin;

-- 4. CMS mirror: server-side Drizzle only — remove permissive PostgREST read.
DROP POLICY IF EXISTS "cms_documents_select_authenticated" ON "next_forge"."cms_documents";
DROP POLICY IF EXISTS "cms_document_revisions_select_authenticated" ON "next_forge"."cms_document_revisions";

REVOKE SELECT ON "next_forge"."cms_documents" FROM authenticated, anon;
REVOKE SELECT ON "next_forge"."cms_document_revisions" FROM authenticated, anon;

-- 5. Pages demo table: read-only for authenticated clients (writes via Drizzle / service role).
REVOKE INSERT, UPDATE, DELETE ON "next_forge"."pages" FROM authenticated;

-- 6. Auto-enable RLS on new tables in exposed schemas (public + next_forge).
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
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
    ELSE
      RAISE LOG 'rls_auto_enable: skip % (schema %).', cmd.object_identity, cmd.schema_name;
    END IF;
  END LOOP;
END;
$$;

DROP EVENT TRIGGER IF EXISTS ensure_rls;
CREATE EVENT TRIGGER ensure_rls
  ON ddl_command_end
  WHEN TAG IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
  EXECUTE FUNCTION public.rls_auto_enable();

REVOKE ALL ON FUNCTION public.rls_auto_enable() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.rls_auto_enable() FROM anon, authenticated;
