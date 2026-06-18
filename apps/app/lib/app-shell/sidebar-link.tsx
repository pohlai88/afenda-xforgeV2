"use client";

import type { SidebarLinkRenderProps, SidebarLinkRenderer } from "@repo/design-system";
import Link from "next/link";

export const renderAuthenticatedSidebarLink: SidebarLinkRenderer = ({
  "aria-current": ariaCurrent,
  children,
  className,
  href,
}: SidebarLinkRenderProps) => (
  <Link aria-current={ariaCurrent} className={className} href={href}>
    {children}
  </Link>
);
