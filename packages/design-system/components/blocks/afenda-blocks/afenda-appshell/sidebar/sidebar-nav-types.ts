import type { LucideIcon } from "lucide-react";

export type AppSidebarNavIcon = LucideIcon;

export interface AppSidebarNavItemBase {
  readonly description?: string;
  readonly href: string;
  readonly id: string;
  readonly label: string;
}

export interface AppSidebarNavProductItem extends AppSidebarNavItemBase {
  readonly iconSrc: string;
  readonly kind: "product";
}

export interface AppSidebarNavIconItem extends AppSidebarNavItemBase {
  readonly icon: AppSidebarNavIcon;
  readonly kind: "icon";
}

export type AppSidebarNavItem =
  | AppSidebarNavProductItem
  | AppSidebarNavIconItem;

/** Public alias aligned with `AfendaAppSidebar*` naming. */
export type AfendaAppSidebarNavItem = AppSidebarNavItem;
export type AfendaAppSidebarNavIconItem = AppSidebarNavIconItem;
export type AfendaAppSidebarNavProductItem = AppSidebarNavProductItem;

export type AfendaAppSidebarNavGroupSlot =
  | "app-sidebar-erp-nav"
  | "app-sidebar-main-nav"
  | "app-sidebar-portal-nav"
  | "app-sidebar-settings-nav";

export interface AfendaAppSidebarNavGroup {
  readonly groupSlot: AfendaAppSidebarNavGroupSlot;
  readonly items: readonly AppSidebarNavItem[];
  readonly label: string;
}

export interface AfendaAppSidebarNavLayout {
  readonly footer?: AfendaAppSidebarNavGroup;
  readonly main?: AfendaAppSidebarNavGroup;
  readonly scroll?: readonly AfendaAppSidebarNavGroup[];
}

export function collectSidebarNavItems(
  nav: AfendaAppSidebarNavLayout | undefined
): readonly (readonly AppSidebarNavItem[])[] {
  if (!nav) {
    return [];
  }

  const groups: (readonly AppSidebarNavItem[])[] = [];

  if (nav.main?.items.length) {
    groups.push(nav.main.items);
  }

  for (const group of nav.scroll ?? []) {
    if (group.items.length) {
      groups.push(group.items);
    }
  }

  if (nav.footer?.items.length) {
    groups.push(nav.footer.items);
  }

  return groups;
}
