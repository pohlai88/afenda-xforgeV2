"use client";

import {
  DashboardPage,
  type SidebarLinkRenderProps,
} from "@repo/design-system";
import Link from "next/link";
import type { ReactNode } from "react";

function nextSidebarLink({
  "aria-current": ariaCurrent,
  children,
  className,
  href,
}: SidebarLinkRenderProps): ReactNode {
  return (
    <Link aria-current={ariaCurrent} className={className} href={href}>
      {children}
    </Link>
  );
}

export function DashboardDemoView() {
  return (
    <DashboardPage
      appSidebarProps={{ renderLink: nextSidebarLink }}
      sidebarProviderProps={{
        defaultBehaviorMode: "expanded",
        defaultOpen: true,
      }}
      siteHeaderProps={{ renderLink: nextSidebarLink, title: "Documents" }}
    />
  );
}
