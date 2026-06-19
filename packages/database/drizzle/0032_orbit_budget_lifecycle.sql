-- Orbit Case Phase 5A: budget request lifecycle (status, assignee, updatedAt).

ALTER TABLE "next_forge"."orbit_budget_requests"
  ADD COLUMN IF NOT EXISTS "status" text NOT NULL DEFAULT 'submitted',
  ADD COLUMN IF NOT EXISTS "assigneeId" text,
  ADD COLUMN IF NOT EXISTS "updatedAt" timestamp(3) DEFAULT now() NOT NULL;

UPDATE "next_forge"."orbit_budget_requests"
SET "updatedAt" = "createdAt"
WHERE "updatedAt" IS NULL;

CREATE INDEX IF NOT EXISTS "orbit_budget_requests_org_status_idx"
  ON "next_forge"."orbit_budget_requests" ("organizationId", "status");

CREATE INDEX IF NOT EXISTS "orbit_budget_requests_org_assignee_idx"
  ON "next_forge"."orbit_budget_requests" ("organizationId", "assigneeId");

DROP POLICY IF EXISTS "orbit_budget_requests_update_member" ON "next_forge"."orbit_budget_requests";
CREATE POLICY "orbit_budget_requests_update_member"
  ON "next_forge"."orbit_budget_requests"
  FOR UPDATE TO authenticated
  USING ((SELECT next_forge.is_organization_member("organizationId")))
  WITH CHECK ((SELECT next_forge.is_organization_member("organizationId")));
