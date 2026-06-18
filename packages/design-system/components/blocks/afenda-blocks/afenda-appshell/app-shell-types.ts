import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { SidebarLinkRenderer } from "../shadcn-dashboard-01/sidebar-link";
import type { AfendaAppSidebarNavLayout } from "./sidebar/sidebar-nav-types";
import type {
  AfendaAppSidebarNavIconRegistry,
  AfendaAppSidebarNavLayoutDescriptor,
} from "./sidebar/sidebar-nav-descriptors";

export type { AfendaAppContentLayoutState } from "./content/app-content-layout-context";
export type { AfendaAppShellSidebarState } from "./app-shell-sidebar-context";
export type {
  AfendaAppContentCssVars,
  AfendaAppShellCssVars,
} from "./app-shell-css-vars";
export type {
  AfendaAppSidebarNavGroupDescriptor,
  AfendaAppSidebarNavIconDescriptor,
  AfendaAppSidebarNavIconKeysOf,
  AfendaAppSidebarNavIconRegistry,
  AfendaAppSidebarNavItemDescriptor,
  AfendaAppSidebarNavLayoutDescriptor,
  AfendaAppSidebarNavProductDescriptor,
} from "./sidebar/sidebar-nav-descriptors";
export type {
  AfendaAppSidebarNavGroup,
  AfendaAppSidebarNavGroupSlot,
  AfendaAppSidebarNavIconItem,
  AfendaAppSidebarNavItem,
  AfendaAppSidebarNavLayout,
  AfendaAppSidebarNavProductItem,
  AppSidebarNavIconItem,
  AppSidebarNavItem,
  AppSidebarNavProductItem,
} from "./sidebar/sidebar-nav-types";
export type { SidebarNavUserProps } from "./sidebar/sidebar-nav-user";
export type { TopbarUtilityId } from "./topbar/topbar-utilities-catalog";
export type { AfendaTopbarUtilitiesController } from "./topbar/topbar-utilities-context";
export type {
  TopbarUtilitiesScope,
  TopbarUtilitiesState,
} from "./topbar/topbar-utilities-storage";
export type {
  AfendaAppTopbarProps,
  TopbarActionsMenuGroup,
  TopbarActionsMenuItem,
  TopbarActionsMenuProps,
  TopbarBrandDiskProps,
  TopbarContextOption,
  TopbarContextScope,
  TopbarContextSwitcherProps,
  TopbarRightActionsProps,
} from "./topbar/topbar-types";

/** Serializable user summary for sidebar chrome. */
export interface AfendaAppShellUserSummary {
  readonly avatar: string;
  readonly email: string;
  readonly name: string;
}

/** Serializable footer link descriptor. */
export interface AfendaAppShellFooterLink {
  readonly href: string;
  readonly id: string;
  readonly label: string;
}

export interface AfendaAppShellProps
  extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  readonly children?: ReactNode;
  readonly contentBottomDrawer?: ReactNode;
  readonly contentHeader?: ReactNode;
  readonly contentLeftRail?: ReactNode;
  readonly contentRightRail?: ReactNode;
  readonly defaultContentBottomDrawerOpen?: boolean;
  readonly defaultContentLeftRailOpen?: boolean;
  readonly defaultContentRightRailOpen?: boolean;
  readonly footer?: ReactNode;
  readonly sidebar?: ReactNode;
  readonly topbar?: ReactNode;
}

export interface AfendaAppSidebarProps
  extends Omit<ComponentPropsWithoutRef<"aside">, "children"> {
  readonly activeItemIds?: ReadonlySet<string>;
  readonly children?: ReactNode;
  readonly nav?: AfendaAppSidebarNavLayout;
  readonly navDescriptor?: AfendaAppSidebarNavLayoutDescriptor;
  readonly navIconRegistry?: AfendaAppSidebarNavIconRegistry;
  readonly pathname?: string;
  readonly renderLink?: SidebarLinkRenderer;
  readonly user?: AfendaAppShellUserSummary;
}

export interface AfendaAppFooterProps
  extends Omit<ComponentPropsWithoutRef<"footer">, "children"> {
  readonly children?: ReactNode;
  readonly copyrightHolder?: string;
  readonly links?: readonly AfendaAppShellFooterLink[];
}

export interface AfendaAppContentBreadcrumbItem {
  readonly href?: string;
  readonly label: string;
}

export interface AfendaAppContentProps
  extends Omit<ComponentPropsWithoutRef<"section">, "children"> {
  readonly bottomDrawer?: ReactNode;
  readonly breadcrumbs?: readonly AfendaAppContentBreadcrumbItem[];
  readonly children?: ReactNode;
  readonly defaultBottomDrawerOpen?: boolean;
  readonly defaultLeftRailOpen?: boolean;
  readonly defaultRightRailOpen?: boolean;
  readonly header?: ReactNode;
  readonly leftRail?: ReactNode;
  readonly rightRail?: ReactNode;
}

export interface AfendaAppContentHeaderProps
  extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  readonly breadcrumbs?: readonly AfendaAppContentBreadcrumbItem[];
  readonly children?: ReactNode;
}

export interface AfendaAppContentBottomDrawerProps
  extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  readonly children?: ReactNode;
}

export interface AfendaAppContentLeftRailProps
  extends Omit<ComponentPropsWithoutRef<"aside">, "children"> {
  readonly children?: ReactNode;
}

export interface AfendaAppContentRightRailProps
  extends Omit<ComponentPropsWithoutRef<"aside">, "children"> {
  readonly children?: ReactNode;
}
