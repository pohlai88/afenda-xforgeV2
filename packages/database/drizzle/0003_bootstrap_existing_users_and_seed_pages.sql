DO $$
DECLARE
  r record;
  v_org_id text;
  v_member_id text;
  v_now timestamp := CURRENT_TIMESTAMP;
BEGIN
  FOR r IN
    SELECT id, email, raw_user_meta_data
    FROM auth.users
    ORDER BY created_at
  LOOP
    IF EXISTS (
      SELECT 1
      FROM "next_forge"."organization_members" om
      WHERE om."userId" = r.id::text
    ) THEN
      CONTINUE;
    END IF;

    v_org_id := COALESCE(
      NULLIF(r.raw_user_meta_data ->> 'activeOrganizationId', ''),
      replace(gen_random_uuid()::text, '-', '')
    );
    v_member_id := replace(gen_random_uuid()::text, '-', '');

    INSERT INTO "next_forge"."organizations" ("id", "name", "createdAt", "updatedAt")
    VALUES (v_org_id, 'My Organization', v_now, v_now)
    ON CONFLICT ("id") DO NOTHING;

    INSERT INTO "next_forge"."organization_members" (
      "id", "userId", "organizationId", "role", "createdAt", "updatedAt"
    )
    VALUES (v_member_id, r.id::text, v_org_id, 'owner', v_now, v_now);

    UPDATE auth.users
    SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb)
      || jsonb_build_object('activeOrganizationId', v_org_id)
    WHERE id = r.id;
  END LOOP;
END $$;

INSERT INTO "next_forge"."pages" ("name")
SELECT name
FROM (
  VALUES
    ('Getting Started'),
    ('Components'),
    ('API Reference'),
    ('Building Your Application')
) AS seed(name)
WHERE NOT EXISTS (SELECT 1 FROM "next_forge"."pages" LIMIT 1);
