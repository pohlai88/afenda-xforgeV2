-- Column-level privileges: restrict PostgREST to safe columns.
-- App mutations use Drizzle (postgres role); browser clients use publishable key + RLS.

-- profiles: sync email/id from auth; users edit display_name + avatar_url only.
REVOKE ALL ON TABLE public.profiles FROM anon, authenticated;

GRANT SELECT ON TABLE public.profiles TO authenticated;
GRANT UPDATE (display_name, avatar_url) ON TABLE public.profiles TO authenticated;

-- organization_members: read-only for JWT clients (prevents role self-escalation).
REVOKE INSERT, UPDATE, DELETE ON TABLE "next_forge"."organization_members"
  FROM authenticated;

GRANT SELECT ON TABLE "next_forge"."organization_members" TO authenticated;

-- organizations: members read; owners rename via RLS + name column only.
REVOKE INSERT, DELETE ON TABLE "next_forge"."organizations" FROM authenticated;

REVOKE UPDATE ON TABLE "next_forge"."organizations" FROM authenticated;
GRANT UPDATE (name) ON TABLE "next_forge"."organizations" TO authenticated;

-- webhooks: server-side only — secrets never exposed to PostgREST roles.
REVOKE ALL ON TABLE "next_forge"."webhook_endpoints" FROM anon, authenticated;
REVOKE ALL ON TABLE "next_forge"."webhook_deliveries" FROM anon, authenticated;
