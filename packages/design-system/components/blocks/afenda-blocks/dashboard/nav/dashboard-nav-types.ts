import type {
  SidebarIconComponent,
  SidebarLinkRenderer,
} from "../../sidebars/sidebar-types";
import type { ReactNode } from "react";

export interface NavUserMenuItem {
  readonly icon?: SidebarIconComponent;
  readonly id: string;
  readonly label: string;
  readonly onSelect?: () => void;
  readonly separatorBefore?: boolean;
}

export interface NavUserProps {
  readonly avatarFallback?: string;
  readonly avatarSrc?: string;
  readonly children?: ReactNode;
  readonly className?: string;
  readonly displayName: string;
  readonly email?: string | null;
  readonly menuItems?: readonly NavUserMenuItem[];
  readonly menuLabel?: string;
  readonly profileDescription?: string;
}

export interface NavMainItem {
  readonly description?: string;
  readonly href: string;
  readonly icon?: SidebarIconComponent;
  readonly id: string;
  readonly label: string;
}

export interface NavMainQuickAction {
  readonly description?: string;
  readonly href?: string;
  readonly icon?: SidebarIconComponent;
  readonly label?: string;
  readonly onSelect?: () => void;
}

export interface NavMainProps {
  readonly className?: string;
  readonly groupClassName?: string;
  readonly inbox?: NavMainQuickAction | false;
  readonly items: readonly NavMainItem[];
  readonly quickCreate?: NavMainQuickAction | false;
  readonly renderLink?: SidebarLinkRenderer;
}

export interface NavStartedSubItem {
  readonly href: string;
  readonly id: string;
  readonly isActive?: boolean;
  readonly label: string;
}

export interface NavStartedItem {
  readonly description?: string;
  readonly href: string;
  readonly icon?: SidebarIconComponent;
  readonly id: string;
  readonly isActive?: boolean;
  readonly items?: readonly NavStartedSubItem[];
  readonly label: string;
}

export interface NavStartedProps {
  readonly className?: string;
  readonly groupLabel?: string;
  readonly items: readonly NavStartedItem[];
  readonly renderLink?: SidebarLinkRenderer;
}

export interface NavDocumentsMenuItem {
  readonly icon?: SidebarIconComponent;
  readonly id: string;
  readonly label: string;
  readonly onSelect?: () => void;
  readonly separatorBefore?: boolean;
  readonly variant?: "default" | "critical";
}

export interface NavDocumentsItem {
  readonly href: string;
  readonly icon: SidebarIconComponent;
  readonly id: string;
  readonly label: string;
  readonly menuItems?: readonly NavDocumentsMenuItem[];
  readonly menuLabel?: string;
}

export interface NavDocumentsMoreAction {
  readonly href?: string;
  readonly icon?: SidebarIconComponent;
  readonly label?: string;
  readonly onSelect?: () => void;
}

export interface NavDocumentsProps {
  readonly className?: string;
  readonly groupLabel?: string;
  readonly items: readonly NavDocumentsItem[];
  readonly menuItems?: readonly NavDocumentsMenuItem[];
  readonly menuLabel?: string;
  readonly more?: NavDocumentsMoreAction | false;
  readonly renderLink?: SidebarLinkRenderer;
}

export interface NavSecondaryItem {
  readonly description?: string;
  readonly href: string;
  readonly icon: SidebarIconComponent;
  readonly id: string;
  readonly label: string;
}

export interface NavSecondaryProps {
  readonly contentClassName?: string;
  readonly items: readonly NavSecondaryItem[];
  readonly renderLink?: SidebarLinkRenderer;
}
