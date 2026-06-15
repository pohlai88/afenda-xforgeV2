-- Public profiles mirror for user management (Supabase User Management guide).
-- auth.users is not exposed via PostgREST; profiles are queryable with RLS.
-- Synced from auth.users via trigger — uses `name` metadata (afenda sign-up contract).

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email text,
  display_name text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles (email);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (id = (SELECT auth.uid()))
  WITH CHECK (id = (SELECT auth.uid()));

GRANT SELECT ON public.profiles TO authenticated;
GRANT UPDATE (display_name, avatar_url) ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

CREATE OR REPLACE FUNCTION public.sync_profile_from_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    display_name,
    avatar_url,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    NULLIF(trim(NEW.raw_user_meta_data ->> 'name'), ''),
    NULLIF(trim(NEW.raw_user_meta_data ->> 'avatar_url'), ''),
    COALESCE(NEW.created_at, now()),
    now()
  )
  ON CONFLICT (id) DO UPDATE
    SET
      email = EXCLUDED.email,
      display_name = COALESCE(
        EXCLUDED.display_name,
        public.profiles.display_name
      ),
      avatar_url = COALESCE(
        EXCLUDED.avatar_url,
        public.profiles.avatar_url
      ),
      updated_at = now();

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_profile_from_auth_user();

DROP TRIGGER IF EXISTS on_auth_user_updated_profile ON auth.users;
CREATE TRIGGER on_auth_user_updated_profile
  AFTER UPDATE OF email, raw_user_meta_data ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_profile_from_auth_user();

INSERT INTO public.profiles (id, email, display_name, avatar_url, created_at, updated_at)
SELECT
  u.id,
  u.email,
  NULLIF(trim(u.raw_user_meta_data ->> 'name'), ''),
  NULLIF(trim(u.raw_user_meta_data ->> 'avatar_url'), ''),
  COALESCE(u.created_at, now()),
  now()
FROM auth.users AS u
ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    display_name = COALESCE(EXCLUDED.display_name, public.profiles.display_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
    updated_at = now();
