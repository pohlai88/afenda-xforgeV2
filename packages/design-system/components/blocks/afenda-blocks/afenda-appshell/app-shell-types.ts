import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { SidebarBehaviorMode } from "../../../afenda-ui/sidebar-behavior";
import type { SidebarLinkRenderer } from "./sidebar/sidebar-link";
import type {
  AfendaAppSidebarNavIconRegistry,
  AfendaAppSidebarNavLayoutDescriptor,
} from "./sidebar/sidebar-nav-descriptors";
import type { AfendaAppSidebarNavLayout } from "./sidebar/sidebar-nav-types";
import type {
  SidebarNavUserMenuGroup,
  SidebarNavUserMenuItem,
} from "./sidebar/sidebar-nav-user-menu.types";

export type {
  AfendaAppContentCssVars,
  AfendaAppShellCssVars,
} from "./app-shell-css-vars";
export type { AfendaAppShellSidebarState } from "./app-shell-sidebar-context";
export type { AfendaAppContentLayoutState } from "./content/app-content-layout-context";
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
export type {
  SidebarNavUserActionMenuItem,
  SidebarNavUserLinkMenuItem,
  SidebarNavUserMenuGroup,
  SidebarNavUserMenuItem,
} from "./sidebar/sidebar-nav-user-menu.types";
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
export type { TopbarUtilityId } from "./topbar/topbar-utilities-catalog";
export type { AfendaTopbarUtilitiesController } from "./topbar/topbar-utilities-context";
export type {
  TopbarUtilitiesScope,
  TopbarUtilitiesState,
} from "./topbar/topbar-utilities-storage";

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
  /** Initial sidebar behavior before client cookie hydration (match server `cookies()` read). */
  readonly defaultSidebarBehaviorMode?: SidebarBehaviorMode;
  readonly footer?: ReactNode;
  readonly sidebar?: ReactNode;
  readonly topbar?: ReactNode;
}

interface AfendaAppSidebarPropsBase
  extends Omit<ComponentPropsWithoutRef<"aside">, "children"> {
  readonly activeItemIds?: ReadonlySet<string>;
  readonly children?: ReactNode;
  readonly navUserMenuGroups?: readonly SidebarNavUserMenuGroup[];
  readonly onNavUserMenuItemSelect?: (item: SidebarNavUserMenuItem) => void;
  readonly pathname?: string;
  readonly renderLink?: SidebarLinkRenderer;
  readonly renderNavUserMenuLink?: SidebarLinkRenderer;
  readonly user?: AfendaAppShellUserSummary;
}

/** Resolved nav tree supplied by the host (client-only icons). */
interface AfendaAppSidebarResolvedNavProps {
  readonly nav: AfendaAppSidebarNavLayout;
  readonly navDescriptor?: never;
  readonly navIconRegistry?: never;
}

/** Serializable nav descriptor + client icon registry (official app boundary). */
interface AfendaAppSidebarDescriptorNavProps<IconKey extends string = string> {
  readonly nav?: never;
  readonly navDescriptor: AfendaAppSidebarNavLayoutDescriptor<IconKey>;
  readonly navIconRegistry: AfendaAppSidebarNavIconRegistry<IconKey>;
}

/** Custom sidebar slot — host supplies `children` only. */
interface AfendaAppSidebarCustomNavProps {
  readonly nav?: never;
  readonly navDescriptor?: never;
  readonly navIconRegistry?: never;
}

export type AfendaAppSidebarProps<IconKey extends string = string> =
  AfendaAppSidebarPropsBase &
    (
      | AfendaAppSidebarResolvedNavProps
      | AfendaAppSidebarDescriptorNavProps<IconKey>
      | AfendaAppSidebarCustomNavProps
    );

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
