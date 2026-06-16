-- Orbit Case push engine tables (Phase 2). Server-only via Drizzle; RLS + revoked client grants.

CREATE TABLE IF NOT EXISTS "next_forge"."orbit_push_destinations" (
  "id" text PRIMARY KEY NOT NULL,
  "organizationId" text REFERENCES "next_forge"."organizations"("id") ON DELETE CASCADE,
  "destinationId" text NOT NULL,
  "label" text NOT NULL,
  "templateId" text NOT NULL,
  "requiredCapabilities" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "visibleToRoles" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "enabled" boolean DEFAULT true NOT NULL,
  "createdAt" timestamp(3) DEFAULT now() NOT NULL,
  "updatedAt" timestamp(3) NOT NULL,
  CONSTRAINT "orbit_push_destinations_org_destination_unique" UNIQUE ("organizationId", "destinationId")
);

CREATE TABLE IF NOT EXISTS "next_forge"."orbit_push_templates" (
  "id" text PRIMARY KEY NOT NULL,
  "organizationId" text REFERENCES "next_forge"."organizations"("id") ON DELETE CASCADE,
  "destinationId" text NOT NULL,
  "label" text NOT NULL,
  "fields" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "createdAt" timestamp(3) DEFAULT now() NOT NULL,
  "updatedAt" timestamp(3) NOT NULL
);

CREATE TABLE IF NOT EXISTS "next_forge"."orbit_push_events" (
  "id" text PRIMARY KEY NOT NULL,
  "organizationId" text NOT NULL REFERENCES "next_forge"."organizations"("id") ON DELETE CASCADE,
  "caseId" text NOT NULL REFERENCES "next_forge"."orbit_cases"("id") ON DELETE CASCADE,
  "destinationId" text NOT NULL,
  "actorId" text NOT NULL,
  "idempotencyKey" text NOT NULL,
  "status" text DEFAULT 'pending' NOT NULL,
  "result" jsonb,
  "createdAt" timestamp(3) DEFAULT now() NOT NULL,
  "updatedAt" timestamp(3) NOT NULL,
  CONSTRAINT "orbit_push_events_idempotency_key_unique" UNIQUE ("idempotencyKey")
);

CREATE TABLE IF NOT EXISTS "next_forge"."orbit_object_links" (
  "id" text PRIMARY KEY NOT NULL,
  "organizationId" text NOT NULL REFERENCES "next_forge"."organizations"("id") ON DELETE CASCADE,
  "originCaseId" text NOT NULL REFERENCES "next_forge"."orbit_cases"("id") ON DELETE CASCADE,
  "pushEventId" text NOT NULL REFERENCES "next_forge"."orbit_push_events"("id") ON DELETE CASCADE,
  "targetType" text NOT NULL,
  "targetId" text NOT NULL,
  "payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "createdAt" timestamp(3) DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "next_forge"."orbit_budget_requests" (
  "id" text PRIMARY KEY NOT NULL,
  "organizationId" text NOT NULL REFERENCES "next_forge"."organizations"("id") ON DELETE CASCADE,
  "originCaseId" text NOT NULL REFERENCES "next_forge"."orbit_cases"("id") ON DELETE CASCADE,
  "title" text NOT NULL,
  "amount" text,
  "createdBy" text NOT NULL,
  "createdAt" timestamp(3) DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "orbit_push_events_case_idx"
  ON "next_forge"."orbit_push_events" ("caseId");

CREATE INDEX IF NOT EXISTS "orbit_object_links_origin_case_idx"
  ON "next_forge"."orbit_object_links" ("originCaseId");

CREATE INDEX IF NOT EXISTS "orbit_push_destinations_org_idx"
  ON "next_forge"."orbit_push_destinations" ("organizationId", "destinationId");

ALTER TABLE "next_forge"."orbit_push_destinations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "next_forge"."orbit_push_templates" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "next_forge"."orbit_push_events" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "next_forge"."orbit_object_links" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "next_forge"."orbit_budget_requests" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE "next_forge"."orbit_push_destinations" FROM anon, authenticated;
REVOKE ALL ON TABLE "next_forge"."orbit_push_templates" FROM anon, authenticated;
REVOKE ALL ON TABLE "next_forge"."orbit_push_events" FROM anon, authenticated;
REVOKE ALL ON TABLE "next_forge"."orbit_object_links" FROM anon, authenticated;
REVOKE ALL ON TABLE "next_forge"."orbit_budget_requests" FROM anon, authenticated;

DROP POLICY IF EXISTS "orbit_push_destinations_select_member" ON "next_forge"."orbit_push_destinations";
CREATE POLICY "orbit_push_destinations_select_member"
  ON "next_forge"."orbit_push_destinations"
  FOR SELECT TO authenticated
  USING ("organizationId" IS NULL OR (SELECT next_forge.is_organization_member("organizationId")));

DROP POLICY IF EXISTS "orbit_push_templates_select_member" ON "next_forge"."orbit_push_templates";
CREATE POLICY "orbit_push_templates_select_member"
  ON "next_forge"."orbit_push_templates"
  FOR SELECT TO authenticated
  USING ("organizationId" IS NULL OR (SELECT next_forge.is_organization_member("organizationId")));

DROP POLICY IF EXISTS "orbit_push_events_select_member" ON "next_forge"."orbit_push_events";
CREATE POLICY "orbit_push_events_select_member"
  ON "next_forge"."orbit_push_events"
  FOR SELECT TO authenticated
  USING ((SELECT next_forge.is_organization_member("organizationId")));

DROP POLICY IF EXISTS "orbit_push_events_insert_member" ON "next_forge"."orbit_push_events";
CREATE POLICY "orbit_push_events_insert_member"
  ON "next_forge"."orbit_push_events"
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT next_forge.is_organization_member("organizationId")));

DROP POLICY IF EXISTS "orbit_push_events_update_member" ON "next_forge"."orbit_push_events";
CREATE POLICY "orbit_push_events_update_member"
  ON "next_forge"."orbit_push_events"
  FOR UPDATE TO authenticated
  USING ((SELECT next_forge.is_organization_member("organizationId")))
  WITH CHECK ((SELECT next_forge.is_organization_member("organizationId")));

DROP POLICY IF EXISTS "orbit_object_links_select_member" ON "next_forge"."orbit_object_links";
CREATE POLICY "orbit_object_links_select_member"
  ON "next_forge"."orbit_object_links"
  FOR SELECT TO authenticated
  USING ((SELECT next_forge.is_organization_member("organizationId")));

DROP POLICY IF EXISTS "orbit_object_links_insert_member" ON "next_forge"."orbit_object_links";
CREATE POLICY "orbit_object_links_insert_member"
  ON "next_forge"."orbit_object_links"
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT next_forge.is_organization_member("organizationId")));

DROP POLICY IF EXISTS "orbit_budget_requests_select_member" ON "next_forge"."orbit_budget_requests";
CREATE POLICY "orbit_budget_requests_select_member"
  ON "next_forge"."orbit_budget_requests"
  FOR SELECT TO authenticated
  USING ((SELECT next_forge.is_organization_member("organizationId")));

DROP POLICY IF EXISTS "orbit_budget_requests_insert_member" ON "next_forge"."orbit_budget_requests";
CREATE POLICY "orbit_budget_requests_insert_member"
  ON "next_forge"."orbit_budget_requests"
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT next_forge.is_organization_member("organizationId")));
