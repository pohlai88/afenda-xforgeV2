-- Orbit Case approval requests (Phase 3 morph destination) + system registry seed.

CREATE TABLE IF NOT EXISTS "next_forge"."orbit_approval_requests" (
  "id" text PRIMARY KEY NOT NULL,
  "organizationId" text NOT NULL REFERENCES "next_forge"."organizations"("id") ON DELETE CASCADE,
  "originCaseId" text NOT NULL REFERENCES "next_forge"."orbit_cases"("id") ON DELETE CASCADE,
  "title" text NOT NULL,
  "approver" text,
  "amount" text,
  "createdBy" text NOT NULL,
  "createdAt" timestamp(3) DEFAULT now() NOT NULL
);

ALTER TABLE "next_forge"."orbit_approval_requests" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE "next_forge"."orbit_approval_requests" FROM anon, authenticated;

DROP POLICY IF EXISTS "orbit_approval_requests_select_member" ON "next_forge"."orbit_approval_requests";
CREATE POLICY "orbit_approval_requests_select_member"
  ON "next_forge"."orbit_approval_requests"
  FOR SELECT TO authenticated
  USING ((SELECT next_forge.is_organization_member("organizationId")));

DROP POLICY IF EXISTS "orbit_approval_requests_insert_member" ON "next_forge"."orbit_approval_requests";
CREATE POLICY "orbit_approval_requests_insert_member"
  ON "next_forge"."orbit_approval_requests"
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT next_forge.is_organization_member("organizationId")));

INSERT INTO "next_forge"."orbit_push_destinations" (
  "id",
  "organizationId",
  "destinationId",
  "label",
  "templateId",
  "requiredCapabilities",
  "visibleToRoles",
  "enabled",
  "updatedAt"
)
VALUES (
  'sys-approval-request',
  NULL,
  'approval-request',
  'Approval Request',
  'approval-request-template',
  '["approval"]'::jsonb,
  '["owner","editor"]'::jsonb,
  true,
  now()
)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "next_forge"."orbit_push_templates" (
  "id",
  "organizationId",
  "destinationId",
  "label",
  "fields",
  "updatedAt"
)
VALUES (
  'approval-request-template',
  NULL,
  'approval-request',
  'Approval Request',
  '[{"key":"title","label":"Title","type":"text","required":true},{"key":"approver","label":"Approver","type":"text","required":false},{"key":"amount","label":"Amount","type":"text","required":false}]'::jsonb,
  now()
)
ON CONFLICT ("id") DO NOTHING;
