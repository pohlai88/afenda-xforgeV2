import type { ReactNode } from "react";

export interface TopbarScopeOption {
  readonly id: string;
  readonly label: string;
}

export interface TopbarScopeSwitcherConfig {
  readonly activeOptionId: string;
  readonly description?: string;
  readonly id: string;
  readonly label: string;
  readonly onSelect?: (optionId: string) => void;
  readonly options: readonly TopbarScopeOption[];
}

export interface TopbarUtilityAction {
  readonly description?: string;
  /** Pinned bar icons are draggable by default; fixed rail slots live outside the pin bar. */
  readonly draggable?: boolean;
  readonly icon: ReactNode;
  readonly id: string;
  readonly label: string;
  readonly onSelect?: () => void;
  readonly searchAliases?: readonly string[];
  readonly shortcut?: string;
}

export type TopbarShortcutScope = "context" | "global" | "selection";

export type TopbarShortcutKeys =
  | readonly string[]
  | readonly (readonly string[])[];

export interface TopbarShortcutDefinition {
  readonly aliases?: readonly string[];
  readonly category: string;
  readonly description?: string;
  readonly id: string;
  readonly keys: TopbarShortcutKeys;
  readonly label: string;
  readonly onSelect?: () => void;
  readonly scope: TopbarShortcutScope;
  readonly when?: string;
}

export interface TopbarShortcutEmptyState {
  readonly description?: string;
  readonly title?: string;
}

export interface TopbarShortcutsProps {
  readonly contextLabel?: string;
  readonly description?: string;
  readonly emptyState?: TopbarShortcutEmptyState;
  readonly items: readonly TopbarShortcutDefinition[];
  readonly label?: string;
  readonly menuLabel?: string;
}

export interface TopbarShortcutsDialogProps {
  readonly contextLabel?: string;
  readonly emptyState?: TopbarShortcutEmptyState;
  readonly onOpenChange: (open: boolean) => void;
  readonly open: boolean;
  readonly shortcuts: readonly TopbarShortcutDefinition[];
}

export type TopbarNotificationScope = "following" | "inbox" | "team";

export interface TopbarNotificationItem {
  readonly body?: string;
  readonly id: string;
  readonly scope?: TopbarNotificationScope;
  readonly timeLabel: string;
  readonly title: string;
  readonly unread?: boolean;
}

export interface TopbarNotificationsProps {
  readonly description?: string;
  readonly emptyDescription?: string;
  readonly emptyTitle?: string;
  readonly items: readonly TopbarNotificationItem[];
  readonly label?: string;
  readonly menuLabel?: string;
  readonly onArchiveAll?: () => void;
  readonly onMarkAllRead?: () => void;
  readonly onOpenSettings?: () => void;
  readonly onSelectItem?: (id: string) => void;
}

export interface TopbarBrandDiskProps {
  readonly ariaLabel?: string;
  readonly className?: string;
  readonly description?: string;
  readonly icon?: ReactNode;
  readonly tooltip?: string;
}

export interface TopbarScopeSwitcherProps {
  readonly activeOptionId: string;
  readonly className?: string;
  readonly description?: string;
  readonly label: string;
  readonly onSelect?: (optionId: string) => void;
  readonly options: readonly TopbarScopeOption[];
  readonly scopeId: string;
}

export interface TopbarScopeSwitchersProps {
  readonly className?: string;
  readonly switchers: readonly TopbarScopeSwitcherConfig[];
}

export interface TopbarUtilitiesBarProps {
  readonly actions: readonly TopbarUtilityAction[];
  readonly className?: string;
  readonly draggable?: boolean;
  readonly maxActions?: number;
  readonly notifications?: TopbarNotificationsProps;
  readonly onOrderChange?: (order: readonly string[]) => void;
  readonly order?: readonly string[];
  readonly shortcuts?: TopbarShortcutsProps;
}

export type TopbarUtilitiesMarketItem = TopbarUtilityAction;

export interface TopbarUtilityRequest {
  readonly features: string;
  readonly name: string;
}

export interface TopbarUtilitiesMarketProps {
  readonly catalog: readonly TopbarUtilitiesMarketItem[];
  readonly className?: string;
  readonly description?: string;
  readonly enabledIds: readonly string[];
  readonly label?: string;
  readonly maxPinnedSlots: number;
  readonly maxTotalSlots: number;
  readonly menuLabel?: string;
  readonly onEnabledChange: (id: string, enabled: boolean) => void;
  readonly onOpenChange?: (open: boolean) => void;
  readonly onOrderChange?: (order: readonly string[]) => void;
  readonly onRequestUtility?: (request: TopbarUtilityRequest) => void;
  readonly open?: boolean;
  readonly order?: readonly string[];
  readonly requestUtilityFeaturesLabel?: string;
  readonly requestUtilityNameLabel?: string;
  readonly requestUtilityNote?: string;
  readonly requestUtilitySendLabel?: string;
  readonly requestUtilityTitle?: string;
}

export interface TopbarActionMenuItem {
  readonly description?: string;
  readonly disabled?: boolean;
  readonly icon?: ReactNode;
  readonly id: string;
  readonly label: string;
  readonly onSelect?: () => void;
  readonly separatorBefore?: boolean;
  readonly shortcut?: string;
}

export interface TopbarActionsMenuProps {
  readonly actions: readonly TopbarActionMenuItem[];
  readonly className?: string;
  readonly description?: string;
  readonly label?: string;
  readonly menuLabel?: string;
}

export interface TopbarUtilitiesRailProps {
  readonly actionsMenu?: TopbarActionsMenuProps;
  readonly catalog: readonly TopbarUtilitiesMarketItem[];
  readonly className?: string;
  readonly defaultEnabledIds?: readonly string[];
  readonly defaultOrder?: readonly string[];
  readonly enabledIds?: readonly string[];
  readonly maxPinnedSlots?: number;
  readonly maxTotalSlots?: number;
  readonly notifications?: TopbarNotificationsProps;
  readonly onEnabledChange?: (ids: readonly string[]) => void;
  readonly onOrderChange?: (order: readonly string[]) => void;
  readonly onRequestUtility?: (request: TopbarUtilityRequest) => void;
  readonly order?: readonly string[];
  readonly requestUtilityFeaturesLabel?: string;
  readonly requestUtilityNameLabel?: string;
  readonly requestUtilityNote?: string;
  readonly requestUtilitySendLabel?: string;
  readonly requestUtilityTitle?: string;
  readonly shortcuts?: TopbarShortcutsProps;
  readonly themeToggle?: ReactNode;
}

export interface TopbarSidebarControlProps {
  readonly align?: "center" | "end" | "start";
  readonly className?: string;
  readonly menuLabel?: string;
  readonly side?: "bottom" | "left" | "right" | "top";
  readonly triggerLabel?: string;
}
