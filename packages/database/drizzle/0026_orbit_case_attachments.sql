-- Orbit Case attachments (Phase 1.1). Metadata only — blobs live in Vercel Blob.

CREATE TABLE IF NOT EXISTS "next_forge"."orbit_case_attachments" (
  "id" text PRIMARY KEY NOT NULL,
  "caseId" text NOT NULL REFERENCES "next_forge"."orbit_cases"("id") ON DELETE CASCADE,
  "organizationId" text NOT NULL REFERENCES "next_forge"."organizations"("id") ON DELETE CASCADE,
  "uploadedBy" text NOT NULL,
  "fileName" text NOT NULL,
  "contentType" text NOT NULL,
  "sizeBytes" integer NOT NULL,
  "blobUrl" text NOT NULL,
  "blobPathname" text NOT NULL,
  "createdAt" timestamp(3) DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "orbit_case_attachments_org_case_created_idx"
  ON "next_forge"."orbit_case_attachments" ("organizationId", "caseId", "createdAt" DESC);

ALTER TABLE "next_forge"."orbit_case_attachments" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE "next_forge"."orbit_case_attachments" FROM anon, authenticated;

DROP POLICY IF EXISTS "orbit_case_attachments_select_member" ON "next_forge"."orbit_case_attachments";
CREATE POLICY "orbit_case_attachments_select_member"
  ON "next_forge"."orbit_case_attachments"
  FOR SELECT TO authenticated
  USING ((SELECT next_forge.is_organization_member("organizationId")));

DROP POLICY IF EXISTS "orbit_case_attachments_insert_member" ON "next_forge"."orbit_case_attachments";
CREATE POLICY "orbit_case_attachments_insert_member"
  ON "next_forge"."orbit_case_attachments"
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT next_forge.is_organization_member("organizationId")));

DROP POLICY IF EXISTS "orbit_case_attachments_delete_uploader_or_owner" ON "next_forge"."orbit_case_attachments";
CREATE POLICY "orbit_case_attachments_delete_uploader_or_owner"
  ON "next_forge"."orbit_case_attachments"
  FOR DELETE TO authenticated
  USING (
    (SELECT next_forge.is_organization_member("organizationId"))
    AND (
      "uploadedBy" = (SELECT auth.uid()::text)
      OR (SELECT next_forge.is_organization_owner("organizationId"))
    )
  );
