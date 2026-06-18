import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { SidebarLinkRenderer } from "../shadcn-dashboard-01/sidebar-link";

export type {
  TopbarDemoSelection,
} from "./topbar/topbar-demo-seed";
export type { TopbarLinkedNav } from "./topbar/use-topbar-linked-nav";
export type { TopbarUtilityId } from "./topbar/topbar-utilities-catalog";
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
  readonly pathname?: string;
  readonly renderLink?: SidebarLinkRenderer;
  readonly user?: {
    readonly avatar: string;
    readonly email: string;
    readonly name: string;
  };
}

export interface AfendaAppFooterProps
  extends Omit<ComponentPropsWithoutRef<"footer">, "children"> {
  readonly children?: ReactNode;
  readonly copyrightHolder?: string;
  readonly links?: readonly {
    readonly href: string;
    readonly id: string;
    readonly label: string;
  }[];
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
