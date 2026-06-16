"use client";

import {
  OperatorAppSidebar,
  SidebarFooterProfile,
  type SidebarLinkRenderProps,
} from "@repo/design-system/design-system";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { getInitials } from "./user-initials";
import { useWorkspaceSession } from "./workspace-session-context";
import {
  workspaceNavGroups,
  workspaceQuickActions,
} from "./workspace-nav-routes";

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
        showSidebarControl
      />
    ),
    [meta.displayName, state.userEmail]
  );

  return (
    <OperatorAppSidebar
      footer={footer}
      groups={workspaceNavGroups}
      pathname={pathname}
      quickActions={workspaceQuickActions}
      renderActionLink={renderSidebarLink}
      renderNavItemLink={renderSidebarLink}
    />
  );
};
