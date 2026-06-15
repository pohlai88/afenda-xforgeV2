-- pages: Drizzle/server-only (apps/app search uses postgres role, not PostgREST).

DROP POLICY IF EXISTS "pages_select_authenticated" ON "next_forge"."pages";
DROP POLICY IF EXISTS "pages_insert_authenticated" ON "next_forge"."pages";
DROP POLICY IF EXISTS "pages_update_authenticated" ON "next_forge"."pages";
DROP POLICY IF EXISTS "pages_delete_authenticated" ON "next_forge"."pages";

REVOKE ALL ON TABLE "next_forge"."pages" FROM anon, authenticated;
