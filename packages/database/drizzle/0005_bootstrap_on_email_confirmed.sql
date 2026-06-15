-- Bootstrap org membership when admin-confirmed users get email_confirmed_at set
-- (INSERT trigger alone misses users created via Admin API with pre-confirmed email).

DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;

CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE OF email_confirmed_at ON auth.users
  FOR EACH ROW
  WHEN (
    OLD.email_confirmed_at IS NULL
    AND NEW.email_confirmed_at IS NOT NULL
  )
  EXECUTE FUNCTION "next_forge"."bootstrap_new_user"();
