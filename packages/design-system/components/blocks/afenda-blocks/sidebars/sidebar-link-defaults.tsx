import type { ReactNode } from "react";

import type { SidebarLinkRenderer, SidebarLinkRenderProps } from "./sidebar-types";

export function defaultSidebarLink({
  "aria-current": ariaCurrent,
  children,
  className,
  href,
}: SidebarLinkRenderProps): ReactNode {
  return (
    <a aria-current={ariaCurrent} className={className} href={href}>
      {children}
    </a>
  );
}

export function resolveSidebarLinkRenderer(
  ...candidates: (SidebarLinkRenderer | undefined)[]
): SidebarLinkRenderer {
  for (const candidate of candidates) {
    if (candidate) {
      return candidate;
    }
  }

  return defaultSidebarLink;
}
