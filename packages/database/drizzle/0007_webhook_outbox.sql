CREATE TABLE IF NOT EXISTS "next_forge"."webhook_endpoints" (
  "id" text PRIMARY KEY NOT NULL,
  "organizationId" text NOT NULL REFERENCES "next_forge"."organizations"("id") ON DELETE CASCADE,
  "url" text NOT NULL,
  "secret" text NOT NULL,
  "enabled" boolean DEFAULT true NOT NULL,
  "events" text[] NOT NULL,
  "description" text,
  "createdAt" timestamp(3) DEFAULT now() NOT NULL,
  "updatedAt" timestamp(3) NOT NULL
);

CREATE TABLE IF NOT EXISTS "next_forge"."webhook_deliveries" (
  "id" text PRIMARY KEY NOT NULL,
  "eventId" text NOT NULL,
  "organizationId" text NOT NULL REFERENCES "next_forge"."organizations"("id") ON DELETE CASCADE,
  "endpointId" text NOT NULL REFERENCES "next_forge"."webhook_endpoints"("id") ON DELETE CASCADE,
  "eventType" text NOT NULL,
  "payload" jsonb NOT NULL,
  "status" text NOT NULL,
  "attempts" integer DEFAULT 0 NOT NULL,
  "nextAttemptAt" timestamp(3) DEFAULT now() NOT NULL,
  "lastError" text,
  "responseStatus" integer,
  "createdAt" timestamp(3) DEFAULT now() NOT NULL,
  "deliveredAt" timestamp(3)
);

CREATE INDEX IF NOT EXISTS "webhook_endpoints_organization_enabled_idx"
  ON "next_forge"."webhook_endpoints" ("organizationId", "enabled");

CREATE INDEX IF NOT EXISTS "webhook_deliveries_status_next_attempt_idx"
  ON "next_forge"."webhook_deliveries" ("status", "nextAttemptAt");

CREATE INDEX IF NOT EXISTS "webhook_deliveries_organization_created_idx"
  ON "next_forge"."webhook_deliveries" ("organizationId", "createdAt" DESC);

ALTER TABLE "next_forge"."webhook_endpoints" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "next_forge"."webhook_deliveries" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "webhook_endpoints_select_member" ON "next_forge"."webhook_endpoints";
CREATE POLICY "webhook_endpoints_select_member"
  ON "next_forge"."webhook_endpoints"
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM "next_forge"."organization_members" om
      WHERE om."organizationId" = "next_forge"."webhook_endpoints"."organizationId"
        AND om."userId" = (select auth.uid())::text
    )
  );

DROP POLICY IF EXISTS "webhook_endpoints_insert_owner" ON "next_forge"."webhook_endpoints";
CREATE POLICY "webhook_endpoints_insert_owner"
  ON "next_forge"."webhook_endpoints"
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM "next_forge"."organization_members" om
      WHERE om."organizationId" = "next_forge"."webhook_endpoints"."organizationId"
        AND om."userId" = (select auth.uid())::text
        AND om."role" = 'owner'
    )
  );

DROP POLICY IF EXISTS "webhook_endpoints_update_owner" ON "next_forge"."webhook_endpoints";
CREATE POLICY "webhook_endpoints_update_owner"
  ON "next_forge"."webhook_endpoints"
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM "next_forge"."organization_members" om
      WHERE om."organizationId" = "next_forge"."webhook_endpoints"."organizationId"
        AND om."userId" = (select auth.uid())::text
        AND om."role" = 'owner'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM "next_forge"."organization_members" om
      WHERE om."organizationId" = "next_forge"."webhook_endpoints"."organizationId"
        AND om."userId" = (select auth.uid())::text
        AND om."role" = 'owner'
    )
  );

DROP POLICY IF EXISTS "webhook_endpoints_delete_owner" ON "next_forge"."webhook_endpoints";
CREATE POLICY "webhook_endpoints_delete_owner"
  ON "next_forge"."webhook_endpoints"
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM "next_forge"."organization_members" om
      WHERE om."organizationId" = "next_forge"."webhook_endpoints"."organizationId"
        AND om."userId" = (select auth.uid())::text
        AND om."role" = 'owner'
    )
  );

DROP POLICY IF EXISTS "webhook_deliveries_select_member" ON "next_forge"."webhook_deliveries";
CREATE POLICY "webhook_deliveries_select_member"
  ON "next_forge"."webhook_deliveries"
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM "next_forge"."organization_members" om
      WHERE om."organizationId" = "next_forge"."webhook_deliveries"."organizationId"
        AND om."userId" = (select auth.uid())::text
    )
  );
