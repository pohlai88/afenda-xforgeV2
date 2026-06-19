-- Orbit Case Phase 5D/5E: pilot field depth + ERP externalRefId on budget, approval, purchase.

ALTER TABLE "next_forge"."orbit_budget_requests"
  ADD COLUMN IF NOT EXISTS "currency" text,
  ADD COLUMN IF NOT EXISTS "costCenter" text,
  ADD COLUMN IF NOT EXISTS "justification" text,
  ADD COLUMN IF NOT EXISTS "externalRefId" text;

ALTER TABLE "next_forge"."orbit_approval_requests"
  ADD COLUMN IF NOT EXISTS "dueDate" text,
  ADD COLUMN IF NOT EXISTS "decisionNotes" text,
  ADD COLUMN IF NOT EXISTS "externalRefId" text;

ALTER TABLE "next_forge"."orbit_purchase_requests"
  ADD COLUMN IF NOT EXISTS "poReference" text,
  ADD COLUMN IF NOT EXISTS "externalRefId" text;

CREATE UNIQUE INDEX IF NOT EXISTS "orbit_budget_requests_org_external_ref_idx"
  ON "next_forge"."orbit_budget_requests" ("organizationId", "externalRefId")
  WHERE "externalRefId" IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "orbit_approval_requests_org_external_ref_idx"
  ON "next_forge"."orbit_approval_requests" ("organizationId", "externalRefId")
  WHERE "externalRefId" IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "orbit_purchase_requests_org_external_ref_idx"
  ON "next_forge"."orbit_purchase_requests" ("organizationId", "externalRefId")
  WHERE "externalRefId" IS NOT NULL;
