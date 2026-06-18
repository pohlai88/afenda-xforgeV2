-- Align JWT orbit_push_capabilities with @repo/orbit-case contract/push-role-capabilities.ts

CREATE OR REPLACE FUNCTION next_forge.orbit_push_capabilities_for_role(role text)
RETURNS jsonb
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE role
    WHEN 'owner' THEN
      '["meeting","task","approval","budget","purchase","investigation","complaint","lead","risk","project","capa","contract-review"]'::jsonb
    WHEN 'editor' THEN
      '["budget","meeting","approval","task"]'::jsonb
    ELSE
      '["meeting","task"]'::jsonb
  END;
$$;
