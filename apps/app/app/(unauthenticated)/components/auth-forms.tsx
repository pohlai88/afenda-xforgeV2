import type { ChangePasswordVariant } from "@repo/auth/change-password";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { AuthFormFallback } from "./auth-form-fallback";

interface SignInFormProperties {
  readonly initialError?: string | null;
}

interface UpdatePasswordFormProperties {
  readonly onSuccess?: () => void;
  readonly redirectTo?: string;
  readonly variant?: ChangePasswordVariant;
}

interface ResendConfirmationFormProperties {
  readonly initialEmail?: string;
}

export const SignInForm: ComponentType<SignInFormProperties> = dynamic(
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

export const UpdatePasswordForm: ComponentType<UpdatePasswordFormProperties> =
  dynamic(
    () =>
      import("@repo/auth/components/update-password-form").then(
        (mod) => mod.UpdatePasswordForm
      ),
    { loading: () => <AuthFormFallback label="Loading password update form" /> }
  );

export const ResendConfirmationForm: ComponentType<ResendConfirmationFormProperties> =
  dynamic(
    () =>
      import("@repo/auth/components/resend-confirmation-form").then(
        (mod) => mod.ResendConfirmationForm
      ),
    { loading: () => <AuthFormFallback label="Loading confirmation options" /> }
  );
