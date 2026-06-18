-- Orbit Case meeting requests (Phase 3 morph destination) + system registry seed.

CREATE TABLE IF NOT EXISTS "next_forge"."orbit_meeting_requests" (
  "id" text PRIMARY KEY NOT NULL,
  "organizationId" text NOT NULL REFERENCES "next_forge"."organizations"("id") ON DELETE CASCADE,
  "originCaseId" text NOT NULL REFERENCES "next_forge"."orbit_cases"("id") ON DELETE CASCADE,
  "title" text NOT NULL,
  "scheduledAt" text,
  "location" text,
  "createdBy" text NOT NULL,
  "createdAt" timestamp(3) DEFAULT now() NOT NULL
);

ALTER TABLE "next_forge"."orbit_meeting_requests" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE "next_forge"."orbit_meeting_requests" FROM anon, authenticated;

DROP POLICY IF EXISTS "orbit_meeting_requests_select_member" ON "next_forge"."orbit_meeting_requests";
CREATE POLICY "orbit_meeting_requests_select_member"
  ON "next_forge"."orbit_meeting_requests"
  FOR SELECT TO authenticated
  USING ((SELECT next_forge.is_organization_member("organizationId")));

DROP POLICY IF EXISTS "orbit_meeting_requests_insert_member" ON "next_forge"."orbit_meeting_requests";
CREATE POLICY "orbit_meeting_requests_insert_member"
  ON "next_forge"."orbit_meeting_requests"
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
  'sys-meeting-request',
  NULL,
  'meeting-request',
  'Meeting Request',
  'meeting-request-template',
  '["meeting"]'::jsonb,
  '["owner","editor","member"]'::jsonb,
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
  'meeting-request-template',
  NULL,
  'meeting-request',
  'Meeting Request',
  '[{"key":"title","label":"Title","type":"text","required":true},{"key":"scheduledAt","label":"Scheduled at","type":"text","required":false},{"key":"location","label":"Location","type":"text","required":false}]'::jsonb,
  now()
)
ON CONFLICT ("id") DO NOTHING;
