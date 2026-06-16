-- Orbit Case core tables (Phase 1). Server-only via Drizzle; RLS + revoked client grants.

CREATE TABLE IF NOT EXISTS "next_forge"."orbit_cases" (
  "id" text PRIMARY KEY NOT NULL,
  "organizationId" text NOT NULL REFERENCES "next_forge"."organizations"("id") ON DELETE CASCADE,
  "title" text NOT NULL,
  "description" text,
  "status" text DEFAULT 'backlog' NOT NULL,
  "priority" text DEFAULT 'none' NOT NULL,
  "ownerId" text,
  "assigneeId" text,
  "dueAt" timestamp(3),
  "createdBy" text NOT NULL,
  "softDeletedAt" timestamp(3),
  "createdAt" timestamp(3) DEFAULT now() NOT NULL,
  "updatedAt" timestamp(3) NOT NULL
);

CREATE TABLE IF NOT EXISTS "next_forge"."orbit_case_watchers" (
  "id" text PRIMARY KEY NOT NULL,
  "caseId" text NOT NULL REFERENCES "next_forge"."orbit_cases"("id") ON DELETE CASCADE,
  "organizationId" text NOT NULL REFERENCES "next_forge"."organizations"("id") ON DELETE CASCADE,
  "userId" text NOT NULL,
  "createdAt" timestamp(3) DEFAULT now() NOT NULL,
  CONSTRAINT "orbit_case_watchers_case_user_unique" UNIQUE ("caseId", "userId")
);

CREATE TABLE IF NOT EXISTS "next_forge"."orbit_case_comments" (
  "id" text PRIMARY KEY NOT NULL,
  "caseId" text NOT NULL REFERENCES "next_forge"."orbit_cases"("id") ON DELETE CASCADE,
  "organizationId" text NOT NULL REFERENCES "next_forge"."organizations"("id") ON DELETE CASCADE,
  "authorId" text NOT NULL,
  "body" text NOT NULL,
  "createdAt" timestamp(3) DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "next_forge"."orbit_case_tags" (
  "id" text PRIMARY KEY NOT NULL,
  "caseId" text NOT NULL REFERENCES "next_forge"."orbit_cases"("id") ON DELETE CASCADE,
  "organizationId" text NOT NULL REFERENCES "next_forge"."organizations"("id") ON DELETE CASCADE,
  "tag" text NOT NULL,
  CONSTRAINT "orbit_case_tags_case_tag_unique" UNIQUE ("caseId", "tag")
);

CREATE TABLE IF NOT EXISTS "next_forge"."orbit_case_activity" (
  "id" text PRIMARY KEY NOT NULL,
  "caseId" text NOT NULL REFERENCES "next_forge"."orbit_cases"("id") ON DELETE CASCADE,
  "organizationId" text NOT NULL REFERENCES "next_forge"."organizations"("id") ON DELETE CASCADE,
  "actorId" text NOT NULL,
  "action" text NOT NULL,
  "payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "createdAt" timestamp(3) DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "orbit_cases_org_status_idx"
  ON "next_forge"."orbit_cases" ("organizationId", "status");

CREATE INDEX IF NOT EXISTS "orbit_cases_org_assignee_idx"
  ON "next_forge"."orbit_cases" ("organizationId", "assigneeId");

CREATE INDEX IF NOT EXISTS "orbit_cases_org_due_idx"
  ON "next_forge"."orbit_cases" ("organizationId", "dueAt");

CREATE INDEX IF NOT EXISTS "orbit_case_activity_case_created_idx"
  ON "next_forge"."orbit_case_activity" ("caseId", "createdAt" DESC);

ALTER TABLE "next_forge"."orbit_cases" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "next_forge"."orbit_case_watchers" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "next_forge"."orbit_case_comments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "next_forge"."orbit_case_tags" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "next_forge"."orbit_case_activity" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE "next_forge"."orbit_cases" FROM anon, authenticated;
REVOKE ALL ON TABLE "next_forge"."orbit_case_watchers" FROM anon, authenticated;
REVOKE ALL ON TABLE "next_forge"."orbit_case_comments" FROM anon, authenticated;
REVOKE ALL ON TABLE "next_forge"."orbit_case_tags" FROM anon, authenticated;
REVOKE ALL ON TABLE "next_forge"."orbit_case_activity" FROM anon, authenticated;

DROP POLICY IF EXISTS "orbit_cases_select_member" ON "next_forge"."orbit_cases";
CREATE POLICY "orbit_cases_select_member"
  ON "next_forge"."orbit_cases"
  FOR SELECT TO authenticated
  USING ((SELECT next_forge.is_organization_member("organizationId")));

DROP POLICY IF EXISTS "orbit_cases_insert_member" ON "next_forge"."orbit_cases";
CREATE POLICY "orbit_cases_insert_member"
  ON "next_forge"."orbit_cases"
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT next_forge.is_organization_member("organizationId")));

DROP POLICY IF EXISTS "orbit_cases_update_member" ON "next_forge"."orbit_cases";
CREATE POLICY "orbit_cases_update_member"
  ON "next_forge"."orbit_cases"
  FOR UPDATE TO authenticated
  USING ((SELECT next_forge.is_organization_member("organizationId")))
  WITH CHECK ((SELECT next_forge.is_organization_member("organizationId")));

DROP POLICY IF EXISTS "orbit_cases_delete_owner" ON "next_forge"."orbit_cases";
CREATE POLICY "orbit_cases_delete_owner"
  ON "next_forge"."orbit_cases"
  FOR DELETE TO authenticated
  USING ((SELECT next_forge.is_organization_owner("organizationId")));

DROP POLICY IF EXISTS "orbit_case_watchers_select_member" ON "next_forge"."orbit_case_watchers";
CREATE POLICY "orbit_case_watchers_select_member"
  ON "next_forge"."orbit_case_watchers"
  FOR SELECT TO authenticated
  USING ((SELECT next_forge.is_organization_member("organizationId")));

DROP POLICY IF EXISTS "orbit_case_watchers_mutate_member" ON "next_forge"."orbit_case_watchers";
CREATE POLICY "orbit_case_watchers_mutate_member"
  ON "next_forge"."orbit_case_watchers"
  FOR ALL TO authenticated
  USING ((SELECT next_forge.is_organization_member("organizationId")))
  WITH CHECK ((SELECT next_forge.is_organization_member("organizationId")));

DROP POLICY IF EXISTS "orbit_case_comments_select_member" ON "next_forge"."orbit_case_comments";
CREATE POLICY "orbit_case_comments_select_member"
  ON "next_forge"."orbit_case_comments"
  FOR SELECT TO authenticated
  USING ((SELECT next_forge.is_organization_member("organizationId")));

DROP POLICY IF EXISTS "orbit_case_comments_insert_member" ON "next_forge"."orbit_case_comments";
CREATE POLICY "orbit_case_comments_insert_member"
  ON "next_forge"."orbit_case_comments"
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT next_forge.is_organization_member("organizationId")));

DROP POLICY IF EXISTS "orbit_case_tags_select_member" ON "next_forge"."orbit_case_tags";
CREATE POLICY "orbit_case_tags_select_member"
  ON "next_forge"."orbit_case_tags"
  FOR SELECT TO authenticated
  USING ((SELECT next_forge.is_organization_member("organizationId")));

DROP POLICY IF EXISTS "orbit_case_tags_mutate_member" ON "next_forge"."orbit_case_tags";
CREATE POLICY "orbit_case_tags_mutate_member"
  ON "next_forge"."orbit_case_tags"
  FOR ALL TO authenticated
  USING ((SELECT next_forge.is_organization_member("organizationId")))
  WITH CHECK ((SELECT next_forge.is_organization_member("organizationId")));

DROP POLICY IF EXISTS "orbit_case_activity_select_member" ON "next_forge"."orbit_case_activity";
CREATE POLICY "orbit_case_activity_select_member"
  ON "next_forge"."orbit_case_activity"
  FOR SELECT TO authenticated
  USING ((SELECT next_forge.is_organization_member("organizationId")));

DROP POLICY IF EXISTS "orbit_case_activity_insert_member" ON "next_forge"."orbit_case_activity";
CREATE POLICY "orbit_case_activity_insert_member"
  ON "next_forge"."orbit_case_activity"
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT next_forge.is_organization_member("organizationId")));
