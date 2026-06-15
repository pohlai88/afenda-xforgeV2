CREATE TABLE IF NOT EXISTS "next_forge"."pages" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" text NOT NULL
);

GRANT USAGE ON SCHEMA next_forge TO authenticated, anon, service_role;
-- Table grants: explicit per migration (0020 revokes this blanket default).
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA next_forge TO authenticated, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA next_forge TO anon;

ALTER TABLE "next_forge"."pages" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pages_select_authenticated" ON "next_forge"."pages";
CREATE POLICY "pages_select_authenticated"
  ON "next_forge"."pages"
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "pages_insert_authenticated" ON "next_forge"."pages";
CREATE POLICY "pages_insert_authenticated"
  ON "next_forge"."pages"
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "pages_update_authenticated" ON "next_forge"."pages";
CREATE POLICY "pages_update_authenticated"
  ON "next_forge"."pages"
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "pages_delete_authenticated" ON "next_forge"."pages";
CREATE POLICY "pages_delete_authenticated"
  ON "next_forge"."pages"
  FOR DELETE
  TO authenticated
  USING (true);

-- Organization members: users can only access their own rows
DROP POLICY IF EXISTS "organization_members_select_own" ON "next_forge"."organization_members";
CREATE POLICY "organization_members_select_own"
  ON "next_forge"."organization_members"
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = "userId");

DROP POLICY IF EXISTS "organization_members_insert_own" ON "next_forge"."organization_members";
CREATE POLICY "organization_members_insert_own"
  ON "next_forge"."organization_members"
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = "userId");

DROP POLICY IF EXISTS "organization_members_update_own" ON "next_forge"."organization_members";
CREATE POLICY "organization_members_update_own"
  ON "next_forge"."organization_members"
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = "userId")
  WITH CHECK (auth.uid()::text = "userId");

DROP POLICY IF EXISTS "organization_members_delete_own" ON "next_forge"."organization_members";
CREATE POLICY "organization_members_delete_own"
  ON "next_forge"."organization_members"
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text = "userId");

-- Organizations: members can read orgs they belong to
DROP POLICY IF EXISTS "organizations_select_member" ON "next_forge"."organizations";
CREATE POLICY "organizations_select_member"
  ON "next_forge"."organizations"
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM "next_forge"."organization_members" om
      WHERE om."organizationId" = "next_forge"."organizations"."id"
        AND om."userId" = auth.uid()::text
    )
  );

DROP POLICY IF EXISTS "organizations_insert_authenticated" ON "next_forge"."organizations";
CREATE POLICY "organizations_insert_authenticated"
  ON "next_forge"."organizations"
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "organizations_update_owner" ON "next_forge"."organizations";
CREATE POLICY "organizations_update_owner"
  ON "next_forge"."organizations"
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM "next_forge"."organization_members" om
      WHERE om."organizationId" = "next_forge"."organizations"."id"
        AND om."userId" = auth.uid()::text
        AND om."role" = 'owner'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM "next_forge"."organization_members" om
      WHERE om."organizationId" = "next_forge"."organizations"."id"
        AND om."userId" = auth.uid()::text
        AND om."role" = 'owner'
    )
  );
