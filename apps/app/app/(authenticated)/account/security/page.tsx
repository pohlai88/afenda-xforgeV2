import { AccountPasswordSection } from "@repo/auth/_components/account-password-section";
import { AuthAuditLogSection } from "@repo/auth/_components/auth-audit-log-section";
import { AuthConfigPanel } from "@repo/auth/_components/auth-config-panel";
import { AuthJwtSigningSection } from "@repo/auth/_components/auth-jwt-signing-section";
import { EmailChangeSection } from "@repo/auth/_components/email-change-section";
import { IdentityManager } from "@repo/auth/_components/identity-manager";
import { MfaManager } from "@repo/auth/_components/mfa-manager";
import { PasskeyManager } from "@repo/auth/_components/passkey-manager";
import { SessionControls } from "@repo/auth/_components/session-controls";
import type { ActiveSessionInfo } from "@repo/design-system";
import { cn, recipe } from "@repo/design-system";
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import { getSessions } from "@/app/actions/account/settings";
import { SecuritySessionsPanel } from "./_components/security-sessions-panel";

const title = "Account security";
const description =
  "Manage linked sign-in methods, passkeys, MFA, and review auth rules for your account.";

export const metadata: Metadata = createMetadata({ title, description });

function formatSessionDevice(userAgent: string | null): string {
  if (!userAgent) return "Unknown device";
  if (/iPhone|iPad|iPod/i.test(userAgent)) return "iPhone / iPad";
  if (/Android/i.test(userAgent)) return "Android device";
  if (/Windows/i.test(userAgent)) return "Windows PC";
  if (/Macintosh|Mac OS/i.test(userAgent)) return "Mac";
  if (/Linux/i.test(userAgent)) return "Linux";
  return "Browser";
}

const AccountSecurityPage = async () => {
  const sessionsResult = await getSessions();

  const sessions: readonly ActiveSessionInfo[] =
    sessionsResult.ok
      ? sessionsResult.data.map((s) => ({
          id: s.id,
          device: formatSessionDevice(s.userAgent),
          ip: s.ip,
          lastActive: s.updatedAt.toLocaleDateString(),
          isCurrent: s.isCurrent,
        }))
      : [];

  return (
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
      <SecuritySessionsPanel sessions={sessions} />
    </div>
  );
};

export default AccountSecurityPage;
