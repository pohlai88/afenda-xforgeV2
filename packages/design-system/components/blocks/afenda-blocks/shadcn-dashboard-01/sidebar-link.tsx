import type { ReactNode } from "react";

export interface SidebarLinkRenderProps {
  readonly "aria-current"?: "page" | "step" | "location" | "date" | "time" | true | false;
  readonly children: ReactNode;
  readonly className?: string;
  readonly href: string;
}

export type SidebarLinkRenderer = (props: SidebarLinkRenderProps) => ReactNode;

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
