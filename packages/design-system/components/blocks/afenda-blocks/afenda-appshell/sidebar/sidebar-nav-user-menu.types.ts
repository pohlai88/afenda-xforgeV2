/** Shared fields for sidebar user menu items. */
export interface SidebarNavUserMenuItemBase {
  readonly destructive?: boolean;
  readonly id: string;
  readonly label: string;
}

/** In-app navigation item — resolved with `renderMenuLink`. */
export interface SidebarNavUserLinkMenuItem extends SidebarNavUserMenuItemBase {
  readonly href: string;
}

/** Client action item — handled via `onMenuItemSelect`. */
export interface SidebarNavUserActionMenuItem extends SidebarNavUserMenuItemBase {
  readonly href?: never;
}

export type SidebarNavUserMenuItem =
  | SidebarNavUserLinkMenuItem
  | SidebarNavUserActionMenuItem;

export interface SidebarNavUserMenuGroup {
  readonly items: readonly SidebarNavUserMenuItem[];
  readonly key: string;
}
