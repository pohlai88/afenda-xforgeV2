"use client";

import {
  BuildingIcon,
  CreditCardIcon,
  ShieldIcon,
  SlidersIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import { cn } from "../../../../lib/utils";
import { AfendaAppShell, AfendaAppSidebar } from "../afenda-appshell";
import { blockRecipe } from "../../block-recipes";
import { accountSettingsNavDescriptor } from "./account-settings-nav.descriptor";
import { accountSettingsNavIconRegistry } from "./account-settings-nav.registry";
import type { AccountSettingsNavGroup } from "./account-settings-nav";
import { AccountSettingsNav } from "./account-settings-nav";
import { AccountSettingsShell } from "./account-settings-shell";

export interface AccountSettingsPageProps {
  readonly children: React.ReactNode;
  readonly currentHref: string;
  readonly header?: React.ReactNode;
  readonly renderLink?: (props: {
    href: string;
    className: string;
    children: React.ReactNode;
    "aria-current"?: "page";
  }) => React.ReactNode;
}

export const ACCOUNT_SETTINGS_NAV_GROUPS: readonly AccountSettingsNavGroup[] = [
  {
    label: "Account",
    items: [
      { href: "/account/profile", icon: UserIcon, id: "profile", label: "Profile" },
      { href: "/account/preferences", icon: SlidersIcon, id: "preferences", label: "Preferences" },
      { href: "/account/security", icon: ShieldIcon, id: "security", label: "Security" },
    ],
  },
  {
    label: "Organization",
    items: [
      { href: "/account/organization", icon: BuildingIcon, id: "organization", label: "Organization" },
      { href: "/account/members", icon: UsersIcon, id: "members", label: "Members" },
      { href: "/account/billing", icon: CreditCardIcon, id: "billing", label: "Billing" },
    ],
  },
];

export function AccountSettingsPage({
  children,
  currentHref,
  header,
  renderLink,
}: AccountSettingsPageProps) {
  return (
    <div
      className={cn(blockRecipe("blockShell"))}
      data-slot="account-settings-page"
    >
      <AccountSettingsShell
        header={header}
        nav={
          <AccountSettingsNav
            currentHref={currentHref}
            groups={ACCOUNT_SETTINGS_NAV_GROUPS}
            renderLink={renderLink}
          />
        }
      >
        {children}
      </AccountSettingsShell>
    </div>
  );
}

export function AccountSettingsDemoPage({
  children,
  currentHref,
  header,
  renderLink,
}: AccountSettingsPageProps) {
  return (
    <AfendaAppShell
      sidebar={
        <AfendaAppSidebar
          navDescriptor={accountSettingsNavDescriptor}
          navIconRegistry={accountSettingsNavIconRegistry}
          pathname={currentHref}
        />
      }
    >
      <AccountSettingsShell
        header={header}
        nav={
          <AccountSettingsNav
            currentHref={currentHref}
            groups={ACCOUNT_SETTINGS_NAV_GROUPS}
            renderLink={renderLink}
          />
        }
      >
        {children}
      </AccountSettingsShell>
    </AfendaAppShell>
  );
}
