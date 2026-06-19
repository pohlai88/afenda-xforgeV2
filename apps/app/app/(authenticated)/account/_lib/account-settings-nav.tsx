"use client";

import { ACCOUNT_SETTINGS_NAV_GROUPS, AccountSettingsNav } from "@repo/design-system";
import { usePathname } from "next/navigation";
import { renderAccountSettingsLink } from "./account-settings-link";

export function AccountSettingsNavClient() {
  const pathname = usePathname();

  return (
    <AccountSettingsNav
      currentHref={pathname}
      groups={ACCOUNT_SETTINGS_NAV_GROUPS}
      renderLink={renderAccountSettingsLink}
    />
  );
}
