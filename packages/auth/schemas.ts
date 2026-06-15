import { z } from "zod";
import type { PasswordPolicy } from "./auth-ui-settings";

export const createPasswordSchema = (policy: PasswordPolicy) =>
  z.string().superRefine((value, context) => {
    for (const rule of policy.rules) {
      if (!rule.test(value)) {
        context.addIssue({
          code: "custom",
          message: rule.label,
        });
      }
    }
  });

export const createSignInSchema = () =>
  z.object({
    email: z.email("Enter a valid email address"),
    password: z.string().min(1, "Enter your password"),
  });

export const createSignUpSchema = (policy: PasswordPolicy) =>
  z.object({
    name: z.string().trim().min(1, "Name is required"),
    email: z.email("Enter a valid email address"),
    password: createPasswordSchema(policy),
  });

export const forgotPasswordSchema = z.object({
  email: z.email("Enter a valid email address"),
});

/** Same shape as forgot-password; named for resend-confirmation intent. */
export const resendConfirmationSchema = forgotPasswordSchema;

export const createEmailOtpVerifySchema = (length: number) =>
  z.object({
    email: z.email("Enter a valid email address"),
    token: z
      .string()
      .regex(
        new RegExp(`^\\d{${length}}$`),
        `Enter the ${length}-digit code from your email`
      ),
  });

export const createUpdatePasswordSchema = (
  policy: PasswordPolicy,
  options: {
    requireCurrentPassword?: boolean;
    requireReauthenticationNonce?: boolean;
  } = {}
) => {
  const base = z.object({
    currentPassword: options.requireCurrentPassword
      ? z.string().min(1, "Enter your current password")
      : z.string().optional(),
    nonce: options.requireReauthenticationNonce
      ? z.string().min(1, "Enter the confirmation code from your email")
      : z.string().optional(),
    password: createPasswordSchema(policy),
    confirmPassword: createPasswordSchema(policy),
  });

  return base.refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });
};

export type SignInInput = z.infer<ReturnType<typeof createSignInSchema>>;
export type SignUpInput = z.infer<ReturnType<typeof createSignUpSchema>>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type UpdatePasswordInput = z.infer<
  ReturnType<typeof createUpdatePasswordSchema>
>;
