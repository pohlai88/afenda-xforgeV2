-- Orbit Case remaining Phase 3 morph destinations (8 tables) + registry seeds.

CREATE TABLE IF NOT EXISTS "next_forge"."orbit_purchase_requests" (
  "id" text PRIMARY KEY NOT NULL,
  "organizationId" text NOT NULL REFERENCES "next_forge"."organizations"("id") ON DELETE CASCADE,
  "originCaseId" text NOT NULL REFERENCES "next_forge"."orbit_cases"("id") ON DELETE CASCADE,
  "title" text NOT NULL,
  "vendor" text,
  "amount" text,
  "createdBy" text NOT NULL,
  "createdAt" timestamp(3) DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "next_forge"."orbit_lead_requests" (
  "id" text PRIMARY KEY NOT NULL,
  "organizationId" text NOT NULL REFERENCES "next_forge"."organizations"("id") ON DELETE CASCADE,
  "originCaseId" text NOT NULL REFERENCES "next_forge"."orbit_cases"("id") ON DELETE CASCADE,
  "title" text NOT NULL,
  "contact" text,
  "company" text,
  "createdBy" text NOT NULL,
  "createdAt" timestamp(3) DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "next_forge"."orbit_complaint_requests" (
  "id" text PRIMARY KEY NOT NULL,
  "organizationId" text NOT NULL REFERENCES "next_forge"."organizations"("id") ON DELETE CASCADE,
  "originCaseId" text NOT NULL REFERENCES "next_forge"."orbit_cases"("id") ON DELETE CASCADE,
  "title" text NOT NULL,
  "category" text,
  "severity" text,
  "createdBy" text NOT NULL,
  "createdAt" timestamp(3) DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "next_forge"."orbit_risk_requests" (
  "id" text PRIMARY KEY NOT NULL,
  "organizationId" text NOT NULL REFERENCES "next_forge"."organizations"("id") ON DELETE CASCADE,
  "originCaseId" text NOT NULL REFERENCES "next_forge"."orbit_cases"("id") ON DELETE CASCADE,
  "title" text NOT NULL,
  "riskLevel" text,
  "owner" text,
  "createdBy" text NOT NULL,
  "createdAt" timestamp(3) DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "next_forge"."orbit_project_requests" (
  "id" text PRIMARY KEY NOT NULL,
  "organizationId" text NOT NULL REFERENCES "next_forge"."organizations"("id") ON DELETE CASCADE,
  "originCaseId" text NOT NULL REFERENCES "next_forge"."orbit_cases"("id") ON DELETE CASCADE,
  "title" text NOT NULL,
  "startDate" text,
  "budget" text,
  "createdBy" text NOT NULL,
  "createdAt" timestamp(3) DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "next_forge"."orbit_investigation_requests" (
  "id" text PRIMARY KEY NOT NULL,
  "organizationId" text NOT NULL REFERENCES "next_forge"."organizations"("id") ON DELETE CASCADE,
  "originCaseId" text NOT NULL REFERENCES "next_forge"."orbit_cases"("id") ON DELETE CASCADE,
  "title" text NOT NULL,
  "subject" text,
  "priority" text,
  "createdBy" text NOT NULL,
  "createdAt" timestamp(3) DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "next_forge"."orbit_capa_requests" (
  "id" text PRIMARY KEY NOT NULL,
  "organizationId" text NOT NULL REFERENCES "next_forge"."organizations"("id") ON DELETE CASCADE,
  "originCaseId" text NOT NULL REFERENCES "next_forge"."orbit_cases"("id") ON DELETE CASCADE,
  "title" text NOT NULL,
  "rootCause" text,
  "dueDate" text,
  "createdBy" text NOT NULL,
  "createdAt" timestamp(3) DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "next_forge"."orbit_contract_review_requests" (
  "id" text PRIMARY KEY NOT NULL,
  "organizationId" text NOT NULL REFERENCES "next_forge"."organizations"("id") ON DELETE CASCADE,
  "originCaseId" text NOT NULL REFERENCES "next_forge"."orbit_cases"("id") ON DELETE CASCADE,
  "title" text NOT NULL,
  "counterparty" text,
  "expiryDate" text,
  "createdBy" text NOT NULL,
  "createdAt" timestamp(3) DEFAULT now() NOT NULL
);

ALTER TABLE "next_forge"."orbit_purchase_requests" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "next_forge"."orbit_lead_requests" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "next_forge"."orbit_complaint_requests" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "next_forge"."orbit_risk_requests" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "next_forge"."orbit_project_requests" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "next_forge"."orbit_investigation_requests" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "next_forge"."orbit_capa_requests" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "next_forge"."orbit_contract_review_requests" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE "next_forge"."orbit_purchase_requests" FROM anon, authenticated;
REVOKE ALL ON TABLE "next_forge"."orbit_lead_requests" FROM anon, authenticated;
REVOKE ALL ON TABLE "next_forge"."orbit_complaint_requests" FROM anon, authenticated;
REVOKE ALL ON TABLE "next_forge"."orbit_risk_requests" FROM anon, authenticated;
REVOKE ALL ON TABLE "next_forge"."orbit_project_requests" FROM anon, authenticated;
REVOKE ALL ON TABLE "next_forge"."orbit_investigation_requests" FROM anon, authenticated;
REVOKE ALL ON TABLE "next_forge"."orbit_capa_requests" FROM anon, authenticated;
REVOKE ALL ON TABLE "next_forge"."orbit_contract_review_requests" FROM anon, authenticated;

DO $$
DECLARE
  morph_table text;
BEGIN
  FOREACH morph_table IN ARRAY ARRAY[
    'orbit_purchase_requests',
    'orbit_lead_requests',
    'orbit_complaint_requests',
    'orbit_risk_requests',
    'orbit_project_requests',
    'orbit_investigation_requests',
    'orbit_capa_requests',
    'orbit_contract_review_requests'
  ]
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON next_forge.%I', morph_table || '_select_member', morph_table);
    EXECUTE format(
      'CREATE POLICY %I ON next_forge.%I FOR SELECT TO authenticated USING ((SELECT next_forge.is_organization_member("organizationId")))',
      morph_table || '_select_member',
      morph_table
    );
    EXECUTE format('DROP POLICY IF EXISTS %I ON next_forge.%I', morph_table || '_insert_member', morph_table);
    EXECUTE format(
      'CREATE POLICY %I ON next_forge.%I FOR INSERT TO authenticated WITH CHECK ((SELECT next_forge.is_organization_member("organizationId")))',
      morph_table || '_insert_member',
      morph_table
    );
  END LOOP;
END $$;

INSERT INTO "next_forge"."orbit_push_destinations" ("id", "organizationId", "destinationId", "label", "templateId", "requiredCapabilities", "visibleToRoles", "enabled", "updatedAt")
VALUES
  ('sys-purchase-request', NULL, 'purchase-request', 'Purchase Request', 'purchase-request-template', '["purchase"]'::jsonb, '["owner","editor"]'::jsonb, true, now()),
  ('sys-lead-request', NULL, 'lead-request', 'Lead Request', 'lead-request-template', '["lead"]'::jsonb, '["owner","editor"]'::jsonb, true, now()),
  ('sys-complaint-request', NULL, 'complaint-request', 'Complaint Request', 'complaint-request-template', '["complaint"]'::jsonb, '["owner","editor"]'::jsonb, true, now()),
  ('sys-risk-request', NULL, 'risk-request', 'Risk Request', 'risk-request-template', '["risk"]'::jsonb, '["owner","editor"]'::jsonb, true, now()),
  ('sys-project-request', NULL, 'project-request', 'Project Request', 'project-request-template', '["project"]'::jsonb, '["owner","editor"]'::jsonb, true, now()),
  ('sys-investigation-request', NULL, 'investigation-request', 'Investigation Request', 'investigation-request-template', '["investigation"]'::jsonb, '["owner","editor"]'::jsonb, true, now()),
  ('sys-capa-request', NULL, 'capa-request', 'CAPA Request', 'capa-request-template', '["capa"]'::jsonb, '["owner","editor"]'::jsonb, true, now()),
  ('sys-contract-review-request', NULL, 'contract-review-request', 'Contract Review Request', 'contract-review-request-template', '["contract-review"]'::jsonb, '["owner","editor"]'::jsonb, true, now())
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "next_forge"."orbit_push_templates" ("id", "organizationId", "destinationId", "label", "fields", "updatedAt")
VALUES
  ('purchase-request-template', NULL, 'purchase-request', 'Purchase Request', '[{"key":"title","label":"Title","type":"text","required":true},{"key":"vendor","label":"Vendor","type":"text","required":false},{"key":"amount","label":"Amount","type":"text","required":false}]'::jsonb, now()),
  ('lead-request-template', NULL, 'lead-request', 'Lead Request', '[{"key":"title","label":"Title","type":"text","required":true},{"key":"contact","label":"Contact","type":"text","required":false},{"key":"company","label":"Company","type":"text","required":false}]'::jsonb, now()),
  ('complaint-request-template', NULL, 'complaint-request', 'Complaint Request', '[{"key":"title","label":"Title","type":"text","required":true},{"key":"category","label":"Category","type":"text","required":false},{"key":"severity","label":"Severity","type":"text","required":false}]'::jsonb, now()),
  ('risk-request-template', NULL, 'risk-request', 'Risk Request', '[{"key":"title","label":"Title","type":"text","required":true},{"key":"riskLevel","label":"Risk level","type":"text","required":false},{"key":"owner","label":"Owner","type":"text","required":false}]'::jsonb, now()),
  ('project-request-template', NULL, 'project-request', 'Project Request', '[{"key":"title","label":"Title","type":"text","required":true},{"key":"startDate","label":"Start date","type":"text","required":false},{"key":"budget","label":"Budget","type":"text","required":false}]'::jsonb, now()),
  ('investigation-request-template', NULL, 'investigation-request', 'Investigation Request', '[{"key":"title","label":"Title","type":"text","required":true},{"key":"subject","label":"Subject","type":"text","required":false},{"key":"priority","label":"Priority","type":"text","required":false}]'::jsonb, now()),
  ('capa-request-template', NULL, 'capa-request', 'CAPA Request', '[{"key":"title","label":"Title","type":"text","required":true},{"key":"rootCause","label":"Root cause","type":"text","required":false},{"key":"dueDate","label":"Due date","type":"text","required":false}]'::jsonb, now()),
  ('contract-review-request-template', NULL, 'contract-review-request', 'Contract Review Request', '[{"key":"title","label":"Title","type":"text","required":true},{"key":"counterparty","label":"Counterparty","type":"text","required":false},{"key":"expiryDate","label":"Expiry date","type":"text","required":false}]'::jsonb, now())
ON CONFLICT ("id") DO NOTHING;
