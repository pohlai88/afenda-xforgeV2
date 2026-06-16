import type { ReactNode } from "react";
import type { SidebarLinkRenderProps } from "./sidebar-types";

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
