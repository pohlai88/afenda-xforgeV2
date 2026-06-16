import type {
  SidebarIconComponent,
  SidebarLinkRenderer,
} from "@repo/design-system/components/blocks/afenda-blocks/sidebars/sidebar-types";
import type { ReactNode } from "react";
import type {
  NavDocumentsItem,
  NavMainItem,
  NavMainQuickAction,
  NavSecondaryItem,
  NavStartedItem,
  NavUserProps,
} from "../nav/dashboard-nav-types";

export interface DashboardSidebarBrand {
  readonly href: string;
  readonly icon?: SidebarIconComponent;
  readonly label: string;
}

export interface DashboardSidebarUser {
  readonly avatarFallback?: string;
  readonly avatarSrc?: string;
  readonly displayName: string;
  readonly email?: string | null;
}

export interface AppSidebarProps {
  readonly brand?: DashboardSidebarBrand | false;
  readonly content?: ReactNode;
  readonly documents?: readonly NavDocumentsItem[] | false;
  readonly footer?: ReactNode;
  readonly header?: ReactNode;
  readonly mainInbox?: NavMainQuickAction | false;
  readonly mainItems?: readonly NavMainItem[] | false;
  readonly mainQuickCreate?: NavMainQuickAction | false;
  readonly renderLink?: SidebarLinkRenderer;
  readonly secondaryClassName?: string;
  readonly secondaryItems?: readonly NavSecondaryItem[] | false;
  readonly startedItems?: readonly NavStartedItem[] | false;
  readonly user?: DashboardSidebarUser | false;
  readonly userMenu?: Omit<
    NavUserProps,
    "avatarFallback" | "avatarSrc" | "displayName" | "email"
  >;
}
