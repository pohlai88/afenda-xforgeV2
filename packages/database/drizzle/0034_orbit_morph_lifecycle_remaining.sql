-- Orbit Case Phase 5A: lifecycle columns for remaining morph destinations.

ALTER TABLE "next_forge"."orbit_meeting_requests"
  ADD COLUMN IF NOT EXISTS "status" text NOT NULL DEFAULT 'submitted',
  ADD COLUMN IF NOT EXISTS "assigneeId" text,
  ADD COLUMN IF NOT EXISTS "updatedAt" timestamp(3) DEFAULT now() NOT NULL;

UPDATE "next_forge"."orbit_meeting_requests"
SET "updatedAt" = "createdAt"
WHERE "updatedAt" IS NULL;

ALTER TABLE "next_forge"."orbit_lead_requests"
  ADD COLUMN IF NOT EXISTS "status" text NOT NULL DEFAULT 'submitted',
  ADD COLUMN IF NOT EXISTS "assigneeId" text,
  ADD COLUMN IF NOT EXISTS "updatedAt" timestamp(3) DEFAULT now() NOT NULL;

UPDATE "next_forge"."orbit_lead_requests"
SET "updatedAt" = "createdAt"
WHERE "updatedAt" IS NULL;

ALTER TABLE "next_forge"."orbit_complaint_requests"
  ADD COLUMN IF NOT EXISTS "status" text NOT NULL DEFAULT 'submitted',
  ADD COLUMN IF NOT EXISTS "assigneeId" text,
  ADD COLUMN IF NOT EXISTS "updatedAt" timestamp(3) DEFAULT now() NOT NULL;

UPDATE "next_forge"."orbit_complaint_requests"
SET "updatedAt" = "createdAt"
WHERE "updatedAt" IS NULL;

ALTER TABLE "next_forge"."orbit_risk_requests"
  ADD COLUMN IF NOT EXISTS "status" text NOT NULL DEFAULT 'submitted',
  ADD COLUMN IF NOT EXISTS "assigneeId" text,
  ADD COLUMN IF NOT EXISTS "updatedAt" timestamp(3) DEFAULT now() NOT NULL;

UPDATE "next_forge"."orbit_risk_requests"
SET "updatedAt" = "createdAt"
WHERE "updatedAt" IS NULL;

ALTER TABLE "next_forge"."orbit_project_requests"
  ADD COLUMN IF NOT EXISTS "status" text NOT NULL DEFAULT 'submitted',
  ADD COLUMN IF NOT EXISTS "assigneeId" text,
  ADD COLUMN IF NOT EXISTS "updatedAt" timestamp(3) DEFAULT now() NOT NULL;

UPDATE "next_forge"."orbit_project_requests"
SET "updatedAt" = "createdAt"
WHERE "updatedAt" IS NULL;

ALTER TABLE "next_forge"."orbit_investigation_requests"
  ADD COLUMN IF NOT EXISTS "status" text NOT NULL DEFAULT 'submitted',
  ADD COLUMN IF NOT EXISTS "assigneeId" text,
  ADD COLUMN IF NOT EXISTS "updatedAt" timestamp(3) DEFAULT now() NOT NULL;

UPDATE "next_forge"."orbit_investigation_requests"
SET "updatedAt" = "createdAt"
WHERE "updatedAt" IS NULL;

ALTER TABLE "next_forge"."orbit_capa_requests"
  ADD COLUMN IF NOT EXISTS "status" text NOT NULL DEFAULT 'submitted',
  ADD COLUMN IF NOT EXISTS "assigneeId" text,
  ADD COLUMN IF NOT EXISTS "updatedAt" timestamp(3) DEFAULT now() NOT NULL;

UPDATE "next_forge"."orbit_capa_requests"
SET "updatedAt" = "createdAt"
WHERE "updatedAt" IS NULL;

ALTER TABLE "next_forge"."orbit_contract_review_requests"
  ADD COLUMN IF NOT EXISTS "status" text NOT NULL DEFAULT 'submitted',
  ADD COLUMN IF NOT EXISTS "assigneeId" text,
  ADD COLUMN IF NOT EXISTS "updatedAt" timestamp(3) DEFAULT now() NOT NULL;

UPDATE "next_forge"."orbit_contract_review_requests"
SET "updatedAt" = "createdAt"
WHERE "updatedAt" IS NULL;

CREATE INDEX IF NOT EXISTS "orbit_meeting_requests_org_status_idx"
  ON "next_forge"."orbit_meeting_requests" ("organizationId", "status");

CREATE INDEX IF NOT EXISTS "orbit_lead_requests_org_status_idx"
  ON "next_forge"."orbit_lead_requests" ("organizationId", "status");

CREATE INDEX IF NOT EXISTS "orbit_complaint_requests_org_status_idx"
  ON "next_forge"."orbit_complaint_requests" ("organizationId", "status");

CREATE INDEX IF NOT EXISTS "orbit_risk_requests_org_status_idx"
  ON "next_forge"."orbit_risk_requests" ("organizationId", "status");

CREATE INDEX IF NOT EXISTS "orbit_project_requests_org_status_idx"
  ON "next_forge"."orbit_project_requests" ("organizationId", "status");

CREATE INDEX IF NOT EXISTS "orbit_investigation_requests_org_status_idx"
  ON "next_forge"."orbit_investigation_requests" ("organizationId", "status");

CREATE INDEX IF NOT EXISTS "orbit_capa_requests_org_status_idx"
  ON "next_forge"."orbit_capa_requests" ("organizationId", "status");

CREATE INDEX IF NOT EXISTS "orbit_contract_review_requests_org_status_idx"
  ON "next_forge"."orbit_contract_review_requests" ("organizationId", "status");

DROP POLICY IF EXISTS "orbit_meeting_requests_update_member" ON "next_forge"."orbit_meeting_requests";
CREATE POLICY "orbit_meeting_requests_update_member"
  ON "next_forge"."orbit_meeting_requests"
  FOR UPDATE TO authenticated
  USING ((SELECT next_forge.is_organization_member("organizationId")))
  WITH CHECK ((SELECT next_forge.is_organization_member("organizationId")));

DROP POLICY IF EXISTS "orbit_lead_requests_update_member" ON "next_forge"."orbit_lead_requests";
CREATE POLICY "orbit_lead_requests_update_member"
  ON "next_forge"."orbit_lead_requests"
  FOR UPDATE TO authenticated
  USING ((SELECT next_forge.is_organization_member("organizationId")))
  WITH CHECK ((SELECT next_forge.is_organization_member("organizationId")));

DROP POLICY IF EXISTS "orbit_complaint_requests_update_member" ON "next_forge"."orbit_complaint_requests";
CREATE POLICY "orbit_complaint_requests_update_member"
  ON "next_forge"."orbit_complaint_requests"
  FOR UPDATE TO authenticated
  USING ((SELECT next_forge.is_organization_member("organizationId")))
  WITH CHECK ((SELECT next_forge.is_organization_member("organizationId")));

DROP POLICY IF EXISTS "orbit_risk_requests_update_member" ON "next_forge"."orbit_risk_requests";
CREATE POLICY "orbit_risk_requests_update_member"
  ON "next_forge"."orbit_risk_requests"
  FOR UPDATE TO authenticated
  USING ((SELECT next_forge.is_organization_member("organizationId")))
  WITH CHECK ((SELECT next_forge.is_organization_member("organizationId")));

DROP POLICY IF EXISTS "orbit_project_requests_update_member" ON "next_forge"."orbit_project_requests";
CREATE POLICY "orbit_project_requests_update_member"
  ON "next_forge"."orbit_project_requests"
  FOR UPDATE TO authenticated
  USING ((SELECT next_forge.is_organization_member("organizationId")))
  WITH CHECK ((SELECT next_forge.is_organization_member("organizationId")));

DROP POLICY IF EXISTS "orbit_investigation_requests_update_member" ON "next_forge"."orbit_investigation_requests";
CREATE POLICY "orbit_investigation_requests_update_member"
  ON "next_forge"."orbit_investigation_requests"
  FOR UPDATE TO authenticated
  USING ((SELECT next_forge.is_organization_member("organizationId")))
  WITH CHECK ((SELECT next_forge.is_organization_member("organizationId")));

DROP POLICY IF EXISTS "orbit_capa_requests_update_member" ON "next_forge"."orbit_capa_requests";
CREATE POLICY "orbit_capa_requests_update_member"
  ON "next_forge"."orbit_capa_requests"
  FOR UPDATE TO authenticated
  USING ((SELECT next_forge.is_organization_member("organizationId")))
  WITH CHECK ((SELECT next_forge.is_organization_member("organizationId")));

DROP POLICY IF EXISTS "orbit_contract_review_requests_update_member" ON "next_forge"."orbit_contract_review_requests";
CREATE POLICY "orbit_contract_review_requests_update_member"
  ON "next_forge"."orbit_contract_review_requests"
  FOR UPDATE TO authenticated
  USING ((SELECT next_forge.is_organization_member("organizationId")))
  WITH CHECK ((SELECT next_forge.is_organization_member("organizationId")));
