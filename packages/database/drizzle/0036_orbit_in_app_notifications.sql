-- Orbit Case Phase 5B: org-scoped in-app notifications.

CREATE TABLE IF NOT EXISTS "next_forge"."orbit_in_app_notifications" (
  "id" text PRIMARY KEY NOT NULL,
  "organizationId" text NOT NULL REFERENCES "next_forge"."organizations"("id") ON DELETE CASCADE,
  "userId" text NOT NULL,
  "kind" text NOT NULL,
  "title" text NOT NULL,
  "body" text,
  "href" text NOT NULL,
  "readAt" timestamp(3),
  "payload" jsonb NOT NULL DEFAULT '{}'::jsonb,
  "createdAt" timestamp(3) DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "orbit_in_app_notifications_user_org_idx"
  ON "next_forge"."orbit_in_app_notifications" ("organizationId", "userId", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS "orbit_in_app_notifications_user_unread_idx"
  ON "next_forge"."orbit_in_app_notifications" ("organizationId", "userId")
  WHERE "readAt" IS NULL;

ALTER TABLE "next_forge"."orbit_in_app_notifications" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "orbit_in_app_notifications_select_member" ON "next_forge"."orbit_in_app_notifications";
CREATE POLICY "orbit_in_app_notifications_select_member"
  ON "next_forge"."orbit_in_app_notifications"
  FOR SELECT TO authenticated
  USING ((SELECT next_forge.is_organization_member("organizationId")));

DROP POLICY IF EXISTS "orbit_in_app_notifications_update_member" ON "next_forge"."orbit_in_app_notifications";
CREATE POLICY "orbit_in_app_notifications_update_member"
  ON "next_forge"."orbit_in_app_notifications"
  FOR UPDATE TO authenticated
  USING ((SELECT next_forge.is_organization_member("organizationId")))
  WITH CHECK ((SELECT next_forge.is_organization_member("organizationId")));
