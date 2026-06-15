-- Join invited users to the target organization instead of creating "My Organization".
-- Invite metadata is set by inviteOrganizationMember via auth.admin.inviteUserByEmail.

CREATE OR REPLACE FUNCTION next_forge.bootstrap_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'next_forge', 'auth', 'public'
AS $function$
DECLARE
  v_org_id text;
  v_member_id text;
  v_invite_org_id text;
  v_invite_role text;
  v_now timestamp := CURRENT_TIMESTAMP;
BEGIN
  IF EXISTS (
    SELECT 1
    FROM "next_forge"."organization_members" om
    WHERE om."userId" = NEW.id::text
  ) THEN
    SELECT om."organizationId"
    INTO v_org_id
    FROM "next_forge"."organization_members" om
    WHERE om."userId" = NEW.id::text
    ORDER BY om."createdAt"
    LIMIT 1;

    IF v_org_id IS NOT NULL
      AND COALESCE(NEW.raw_user_meta_data ->> 'activeOrganizationId', '') <> v_org_id THEN
      UPDATE auth.users
      SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb)
        || jsonb_build_object('activeOrganizationId', v_org_id)
      WHERE id = NEW.id;
    END IF;

    RETURN NEW;
  END IF;

  v_invite_org_id := NULLIF(trim(NEW.raw_user_meta_data ->> 'inviteOrganizationId'), '');
  v_invite_role := COALESCE(NULLIF(trim(NEW.raw_user_meta_data ->> 'inviteOrganizationRole'), ''), 'member');

  IF v_invite_org_id IS NOT NULL
     AND EXISTS (
       SELECT 1
       FROM "next_forge"."organizations" o
       WHERE o."id" = v_invite_org_id
     )
     AND v_invite_role IN ('owner', 'editor', 'member') THEN
    v_member_id := replace(gen_random_uuid()::text, '-', '');

    INSERT INTO "next_forge"."organization_members" (
      "id", "userId", "organizationId", "role", "createdAt", "updatedAt"
    )
    VALUES (v_member_id, NEW.id::text, v_invite_org_id, v_invite_role, v_now, v_now);

    UPDATE auth.users
    SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb)
      || jsonb_build_object('activeOrganizationId', v_invite_org_id)
      - 'inviteOrganizationId'
      - 'inviteOrganizationRole'
    WHERE id = NEW.id;

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
$function$;
