import dynamic from "next/dynamic";
import { AuthFormFallback } from "./auth-form-fallback";

export const SignInForm = dynamic(
  () => import("@repo/auth/components/sign-in").then((mod) => mod.SignIn),
  { loading: () => <AuthFormFallback label="Loading sign-in form" /> }
);

export const SignUpForm = dynamic(
  () => import("@repo/auth/components/sign-up").then((mod) => mod.SignUp),
  { loading: () => <AuthFormFallback label="Loading sign-up form" /> }
);

export const ForgotPasswordForm = dynamic(
  () =>
    import("@repo/auth/components/forgot-password-form").then(
      (mod) => mod.ForgotPasswordForm
    ),
  { loading: () => <AuthFormFallback label="Loading password reset form" /> }
);

export const UpdatePasswordForm = dynamic(
  () =>
    import("@repo/auth/components/update-password-form").then(
      (mod) => mod.UpdatePasswordForm
    ),
  { loading: () => <AuthFormFallback label="Loading password update form" /> }
);

export const ResendConfirmationForm = dynamic(
  () =>
    import("@repo/auth/components/resend-confirmation-form").then(
      (mod) => mod.ResendConfirmationForm
    ),
  { loading: () => <AuthFormFallback label="Loading confirmation options" /> }
);
