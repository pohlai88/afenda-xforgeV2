import { AccountPasswordSection } from "@repo/auth/components/account-password-section";
import { AuthAuditLogSection } from "@repo/auth/components/auth-audit-log-section";
import { AuthConfigPanel } from "@repo/auth/components/auth-config-panel";
import { AuthJwtSigningSection } from "@repo/auth/components/auth-jwt-signing-section";
import { EmailChangeSection } from "@repo/auth/components/email-change-section";
import { IdentityManager } from "@repo/auth/components/identity-manager";
import { MfaManager } from "@repo/auth/components/mfa-manager";
import { PasskeyManager } from "@repo/auth/components/passkey-manager";
import { SessionControls } from "@repo/auth/components/session-controls";
import { cn, recipe } from "@repo/design-system";
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";

const title = "Account security";
const description =
  "Manage linked sign-in methods, passkeys, MFA, and review auth rules for your account.";

export const metadata: Metadata = createMetadata({ title, description });

const AccountSecurityPage = () => (
  <div
    className={cn(
      "mx-auto flex w-full max-w-2xl flex-col p-6",
      recipe("sectionGap")
    )}
  >
    <div className="flex flex-col gap-1">
      <h1 className="font-semibold text-2xl text-text-primary tracking-tight">
        {title}
      </h1>
      <p className={recipe("captionText")}>{description}</p>
    </div>
    <AuthConfigPanel />
    <AuthJwtSigningSection />
    <AuthAuditLogSection />
    <SessionControls />
    <IdentityManager />
    <EmailChangeSection />
    <AccountPasswordSection />
    <PasskeyManager />
    <MfaManager />
  </div>
);

export default AccountSecurityPage;
