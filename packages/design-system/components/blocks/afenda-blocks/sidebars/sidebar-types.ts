import type { ComponentType, ReactNode } from "react";

export type SidebarLabelTone =
  | "critical"
  | "info"
  | "neutral"
  | "positive"
  | "warning";

export type SidebarMatchStrategy = "exact" | "prefix";

export type SidebarIconComponent = ComponentType<{
  readonly className?: string;
}>;

export type SidebarItemActiveFn = (
  pathname: string,
  item: SidebarNavItem
) => boolean;

export type SidebarLinkRenderer = (
  props: SidebarLinkRenderProps
) => ReactNode;

export interface SidebarNavItem {
  readonly badge?: string;
  readonly description?: string;
  readonly href: string;
  readonly icon: SidebarIconComponent;
  readonly id: string;
  readonly label: string;
  readonly match?: SidebarMatchStrategy;
  /** Static override for Storybook or controlled selection; ignored when undefined. */
  readonly selected?: boolean;
  readonly shortcut?: string;
}

export interface SidebarNavGroup {
  readonly id: string;
  readonly items: readonly SidebarNavItem[];
  readonly label: string;
}

export interface SidebarQuickAction {
  readonly description?: string;
  readonly href: string;
  readonly icon: SidebarIconComponent;
  readonly id: string;
  readonly shortcut: string;
  readonly topic: string;
}

export interface SidebarLabelItem {
  readonly id: string;
  readonly label: string;
  readonly tone: SidebarLabelTone;
}

export interface SidebarLabelGroup {
  readonly id: string;
  readonly items: readonly SidebarLabelItem[];
  readonly label: string;
}

export interface SidebarLinkRenderProps {
  readonly "aria-current"?: "page";
  readonly children: ReactNode;
  readonly className: string;
  readonly href: string;
}

export interface SidebarNavItemRowProps {
  readonly item: SidebarNavItem;
  readonly renderLink?: SidebarLinkRenderer;
  readonly selected: boolean;
}

export interface SidebarNavGroupPanelProps {
  readonly activeItemIds: ReadonlySet<string>;
  readonly group: SidebarNavGroup;
  readonly renderLink?: SidebarLinkRenderer;
}

export interface SidebarLabelGroupPanelProps {
  readonly group: SidebarLabelGroup;
}

export interface SidebarNavPanelProps {
  readonly className?: string;
  readonly emptyNavigationLabel?: string;
  readonly groups: readonly SidebarNavGroup[];
  readonly isItemActive?: SidebarItemActiveFn;
  readonly labelGroups?: readonly SidebarLabelGroup[];
  readonly pathname?: string;
  readonly renderLink?: SidebarLinkRenderer;
}

export interface SidebarQuickActionsProps {
  readonly actions: readonly SidebarQuickAction[];
  readonly className?: string;
  readonly renderLink?: SidebarLinkRenderer;
}

export interface SidebarFooterProfileProps {
  readonly avatarFallback?: string;
  readonly avatarSrc?: string;
  readonly className?: string;
  readonly href: string;
  readonly primaryLabel: string;
  readonly profileDescription?: string;
  readonly renderLink?: SidebarLinkRenderer;
  readonly secondaryLabel?: string;
  readonly trailingControl?: ReactNode;
}

export interface OperatorAppSidebarProps {
  readonly className?: string;
  readonly emptyNavigationLabel?: string;
  readonly footer?: ReactNode;
  readonly groups: readonly SidebarNavGroup[];
  readonly isItemActive?: SidebarItemActiveFn;
  readonly labelGroups?: readonly SidebarLabelGroup[];
  readonly pathname?: string;
  readonly quickActions?: readonly SidebarQuickAction[];
  readonly renderLink?: SidebarLinkRenderer;
}
