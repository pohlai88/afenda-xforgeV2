export interface AuthAuditLogEntry {
  action: string;
  createdAt: string;
  id: string;
  ipAddress: string | null;
  userAgent: string | null;
}

const AUTH_AUDIT_ACTION_LABELS: Record<string, string> = {
  login: "Signed in",
  logout: "Signed out",
  invite_accepted: "Invitation accepted",
  user_signedup: "Account created",
  user_invited: "Invitation sent",
  user_deleted: "Account deleted",
  user_modified: "Profile updated",
  user_recovery_requested: "Password reset requested",
  user_reauthenticate_requested: "Reauthentication requested",
  user_confirmation_requested: "Confirmation email sent",
  user_repeated_signup: "Duplicate sign-up attempt",
  user_updated_password: "Password changed",
  token_revoked: "Session revoked",
  token_refreshed: "Session refreshed",
  generate_recovery_codes: "MFA recovery codes generated",
  factor_in_progress: "MFA enrollment started",
  factor_unenrolled: "MFA factor removed",
  challenge_created: "MFA challenge started",
  verification_attempted: "MFA verification attempted",
  factor_deleted: "MFA factor deleted",
  recovery_codes_deleted: "MFA recovery codes deleted",
  factor_updated: "MFA factor updated",
  mfa_code_login: "Signed in with MFA",
  identity_unlinked: "Sign-in method unlinked",
};

export const formatAuthAuditAction = (action: string): string =>
  AUTH_AUDIT_ACTION_LABELS[action] ??
  action.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
