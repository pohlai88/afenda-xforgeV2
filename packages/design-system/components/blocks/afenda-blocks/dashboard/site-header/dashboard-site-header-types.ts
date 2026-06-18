import type { SidebarLinkRenderer } from "../../sidebars/sidebar-types";
import type { CSSProperties, ReactNode } from "react";

export interface SiteHeaderProps {
  readonly actions?: ReactNode;
  readonly className?: string;
  readonly githubHref?: string | false;
  readonly githubLabel?: string;
  readonly headerHeight?: string;
  readonly renderLink?: SidebarLinkRenderer;
  readonly showSidebarTrigger?: boolean;
  readonly style?: CSSProperties;
  readonly title?: string;
  readonly triggerClassName?: string;
}
