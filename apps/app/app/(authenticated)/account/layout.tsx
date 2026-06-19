import { AccountSettingsShell } from "@repo/design-system";
import type { ReactNode } from "react";
import { AccountSettingsNavClient } from "./_lib/account-settings-nav";

export default function AccountLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <AccountSettingsShell
      header={
        <div className="flex flex-col gap-0.5">
          <h1 className="text-lg font-semibold leading-tight text-text-primary">
            Settings
          </h1>
          <p className="text-[length:var(--xforge-font-caption-size)] text-text-secondary">
            Manage your profile, preferences, and security.
          </p>
        </div>
      }
      nav={<AccountSettingsNavClient />}
    >
      {children}
    </AccountSettingsShell>
  );
}
