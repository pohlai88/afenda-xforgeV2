DROP POLICY IF EXISTS "organizations_select_members" ON "next_forge"."organizations";

DROP POLICY IF EXISTS "organization_members_select_own" ON "next_forge"."organization_members";
CREATE POLICY "organization_members_select_own"
  ON "next_forge"."organization_members"
  FOR SELECT TO authenticated
  USING ((select auth.uid())::text = "userId");

DROP POLICY IF EXISTS "organization_members_insert_own" ON "next_forge"."organization_members";
CREATE POLICY "organization_members_insert_own"
  ON "next_forge"."organization_members"
  FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid())::text = "userId");

DROP POLICY IF EXISTS "organization_members_update_own" ON "next_forge"."organization_members";
CREATE POLICY "organization_members_update_own"
  ON "next_forge"."organization_members"
  FOR UPDATE TO authenticated
  USING ((select auth.uid())::text = "userId")
  WITH CHECK ((select auth.uid())::text = "userId");

DROP POLICY IF EXISTS "organization_members_delete_own" ON "next_forge"."organization_members";
CREATE POLICY "organization_members_delete_own"
  ON "next_forge"."organization_members"
  FOR DELETE TO authenticated
  USING ((select auth.uid())::text = "userId");

DROP POLICY IF EXISTS "organizations_select_member" ON "next_forge"."organizations";
CREATE POLICY "organizations_select_member"
  ON "next_forge"."organizations"
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM "next_forge"."organization_members" om
      WHERE om."organizationId" = "next_forge"."organizations"."id"
        AND om."userId" = (select auth.uid())::text
    )
  );

DROP POLICY IF EXISTS "organizations_update_owner" ON "next_forge"."organizations";
CREATE POLICY "organizations_update_owner"
  ON "next_forge"."organizations"
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM "next_forge"."organization_members" om
      WHERE om."organizationId" = "next_forge"."organizations"."id"
        AND om."userId" = (select auth.uid())::text
        AND om."role" = 'owner'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM "next_forge"."organization_members" om
      WHERE om."organizationId" = "next_forge"."organizations"."id"
        AND om."userId" = (select auth.uid())::text
        AND om."role" = 'owner'
    )
  );

CREATE INDEX IF NOT EXISTS "organization_members_organization_id_idx"
  ON "next_forge"."organization_members" ("organizationId");

CREATE INDEX IF NOT EXISTS "organization_members_user_id_idx"
  ON "next_forge"."organization_members" ("userId");

CREATE OR REPLACE FUNCTION "next_forge"."bootstrap_new_user"()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = next_forge, auth, public
AS $$
DECLARE
  v_org_id text;
  v_member_id text;
  v_now timestamp := CURRENT_TIMESTAMP;
BEGIN
  IF EXISTS (
    SELECT 1
    FROM "next_forge"."organization_members" om
    WHERE om."userId" = NEW.id::text
  ) THEN
    RETURN NEW;
  END IF;

  v_org_id := replace(gen_random_uuid()::text, '-', '');
  v_member_id := replace(gen_random_uuid()::text, '-', '');

  INSERT INTO "next_forge"."organizations" ("id", "name", "createdAt", "updatedAt")
  VALUES (v_org_id, 'My Organization', v_now, v_now);

  INSERT INTO "next_forge"."organization_members" (
    "id", "userId", "organizationId", "role", "createdAt", "updatedAt"
  )
  VALUES (v_member_id, NEW.id::text, v_org_id, 'owner', v_now, v_now);

  UPDATE auth.users
  SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb)
    || jsonb_build_object('activeOrganizationId', v_org_id)
  WHERE id = NEW.id;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION "next_forge"."bootstrap_new_user"();
