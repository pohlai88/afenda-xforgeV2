import type { EmailOtpType, User } from "@supabase/supabase-js";

export type AuthOtpType = EmailOtpType;

export const AUTH_OTP_TYPES = [
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
  "email",
] as const satisfies readonly AuthOtpType[];

export type AuthContext =
  | { userId: null; orgId: null }
  | { userId: string; orgId: string | null };

export type AuthenticatedContext = Extract<AuthContext, { userId: string }>;

export type ConfirmAuthLinkParams = {
  tokenHash: string | null;
  type: string | null;
  code: string | null;
  next: string | null;
  origin: string;
};

export type ConfirmAuthLinkResult =
  | { ok: true; redirectTo: string }
  | { ok: false; error: string };

export type AuthSession = {
  user: User;
  orgId: string | null;
};

export type AuthActionResult<TData = void> =
  | { ok: true; data: TData }
  | { ok: false; error: string };

export class UnauthenticatedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthenticatedError";
  }
}

export class MissingOrganizationError extends Error {
  constructor(message = "No active organization") {
    super(message);
    this.name = "MissingOrganizationError";
  }
}

export class InsufficientRoleError extends Error {
  constructor(message = "Insufficient permissions") {
    super(message);
    this.name = "InsufficientRoleError";
  }
}
