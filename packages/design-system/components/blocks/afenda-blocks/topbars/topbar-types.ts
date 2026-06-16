import type { ComponentPropsWithoutRef, ReactNode } from "react";

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
  readonly shortcut?: string;
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

export interface TopbarCommandTriggerProps {
  readonly className?: string;
  readonly description?: string;
  readonly label?: string;
  readonly onOpen?: () => void;
  readonly onSearch?: (query: string) => void;
  readonly placeholder?: string;
  readonly shortcut?: string;
}

export interface TopbarUtilitiesBarProps {
  readonly actions: readonly TopbarUtilityAction[];
  readonly className?: string;
  readonly draggable?: boolean;
  readonly maxActions?: number;
  readonly onOrderChange?: (order: readonly string[]) => void;
  readonly order?: readonly string[];
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
  readonly onRequestUtility?: (request: TopbarUtilityRequest) => void;
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

export interface TopbarUserMenuProps {
  readonly avatarFallback: string;
  readonly avatarSrc?: string;
  readonly children?: ReactNode;
  readonly className?: string;
  readonly description?: string;
  readonly displayName: string;
  readonly email?: string | null;
  readonly menuLabel?: string;
  readonly tooltip?: string;
}

export interface TopbarUtilitiesRailProps {
  readonly catalog: readonly TopbarUtilitiesMarketItem[];
  readonly className?: string;
  readonly defaultEnabledIds?: readonly string[];
  readonly defaultOrder?: readonly string[];
  readonly enabledIds?: readonly string[];
  readonly maxPinnedSlots?: number;
  readonly maxTotalSlots?: number;
  readonly actionsMenu?: TopbarActionsMenuProps;
  readonly onEnabledChange?: (ids: readonly string[]) => void;
  readonly onOrderChange?: (order: readonly string[]) => void;
  readonly onRequestUtility?: (request: TopbarUtilityRequest) => void;
  readonly order?: readonly string[];
  readonly requestUtilityFeaturesLabel?: string;
  readonly requestUtilityNameLabel?: string;
  readonly requestUtilityNote?: string;
  readonly requestUtilitySendLabel?: string;
  readonly requestUtilityTitle?: string;
  readonly userMenu: TopbarUserMenuProps;
}

export interface TopbarSidebarControlProps {
  readonly align?: "center" | "end" | "start";
  readonly className?: string;
  readonly menuLabel?: string;
  readonly side?: "bottom" | "left" | "right" | "top";
  readonly triggerLabel?: string;
}

export interface OperatorAppTopbarProps
  extends Omit<ComponentPropsWithoutRef<"header">, "children"> {
  readonly brand?: TopbarBrandDiskProps;
  readonly commandPalette?: TopbarCommandTriggerProps;
  readonly scopeSwitchers?: readonly TopbarScopeSwitcherConfig[];
  readonly sidebarControl?: boolean | TopbarSidebarControlProps;
  readonly trailing?: ReactNode;
  readonly utilitiesRail: TopbarUtilitiesRailProps;
}
