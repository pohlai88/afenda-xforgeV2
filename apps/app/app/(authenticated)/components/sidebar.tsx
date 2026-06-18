"use client";

import {
  OperatorAppSidebar,
  SidebarFooterProfile,
  SidebarFooterTrailingControl,
  type SidebarLinkRenderProps,
} from "@repo/design-system";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { getInitials } from "./user-initials";
import {
  workspaceNavGroups,
  workspacePinnedNavGroups,
  workspaceQuickActions,
  workspaceSystemCardSections,
} from "./workspace-nav-routes";
import { useWorkspaceSession } from "./workspace-session-context";

function renderSidebarLink({
  "aria-current": ariaCurrent,
  children,
  className,
  href,
}: SidebarLinkRenderProps) {
  return (
    <Link aria-current={ariaCurrent} className={className} href={href}>
      {children}
    </Link>
  );
}

export const AppSidebarNav = () => {
  const pathname = usePathname();
  const { meta, state } = useWorkspaceSession();

  const footer = useMemo(
    () => (
      <SidebarFooterProfile
        avatarFallback={getInitials(meta.displayName, state.userEmail)}
        href="/account/security"
        primaryLabel={meta.displayName}
        renderLink={renderSidebarLink}
        secondaryLabel="Control owner"
        trailingControl={<SidebarFooterTrailingControl />}
      />
    ),
    [meta.displayName, state.userEmail]
  );

  return (
    <OperatorAppSidebar
      cardSections={workspaceSystemCardSections}
      footer={footer}
      groups={workspaceNavGroups}
      pathname={pathname}
      pinnedGroups={workspacePinnedNavGroups}
      quickActions={workspaceQuickActions}
      renderLink={renderSidebarLink}
    />
  );
};
