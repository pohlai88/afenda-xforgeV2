-- Tighten permissive RLS policies flagged by Supabase security advisor.
-- App writes use Drizzle (postgres role) or SECURITY DEFINER bootstrap; authenticated JWT clients are read-only on pages.

DROP POLICY IF EXISTS "pages_insert_authenticated" ON "next_forge"."pages";
DROP POLICY IF EXISTS "pages_update_authenticated" ON "next_forge"."pages";
DROP POLICY IF EXISTS "pages_delete_authenticated" ON "next_forge"."pages";

DROP POLICY IF EXISTS "organizations_insert_authenticated" ON "next_forge"."organizations";
