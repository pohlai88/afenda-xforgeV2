import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { TopbarUtilityId } from "./topbar-utilities-catalog";

export type TopbarContextScope =
  | "department"
  | "organization"
  | "project"
  | "team";

export interface TopbarContextOption {
  readonly id: string;
  readonly name: string;
  readonly subtitle: string;
}

export interface TopbarContextSwitcherProps {
  readonly activeOptionId?: string;
  readonly defaultOptionId?: string;
  readonly menuLabel?: string;
  readonly onOptionChange?: (option: TopbarContextOption) => void;
  readonly options: readonly TopbarContextOption[];
  readonly scope: TopbarContextScope;
}

export interface AfendaAppTopbarProps
  extends Omit<ComponentPropsWithoutRef<"header">, "children"> {
  readonly actions?: ReactNode;
  readonly brand?: ReactNode;
  readonly children?: ReactNode;
  readonly previewUtilities?: boolean;
  readonly rightActionGroups?: readonly TopbarActionsMenuGroup[];
  readonly scopeSwitchers?: ReactNode;
  readonly showRightActions?: boolean;
  readonly showScopeSwitchers?: boolean;
  readonly showSidebarTrigger?: boolean;
  readonly sidebarTrigger?: ReactNode;
  readonly tenantId?: string;
  readonly userId?: string;
  readonly utilityActionOverrides?: Partial<
    Record<TopbarUtilityId, () => void>
  >;
}

export interface TopbarBrandDiskProps {
  readonly className?: string;
  readonly darkIconSrc?: string;
  readonly homeHref?: string;
  readonly lightIconSrc?: string;
}

export interface TopbarActionsMenuItem {
  readonly destructive?: boolean;
  readonly disabled?: boolean;
  readonly icon?: ReactNode;
  readonly key: string;
  readonly label: string;
  readonly onSelect?: () => void;
}

export interface TopbarActionsMenuGroup {
  readonly items: readonly TopbarActionsMenuItem[];
  readonly key: string;
  readonly label?: string;
}

export interface TopbarActionsMenuProps {
  readonly groups?: readonly TopbarActionsMenuGroup[];
  readonly header?: {
    readonly email?: string;
    readonly name?: string;
  };
  readonly triggerLabel?: string;
}

export interface TopbarRightActionsProps {
  readonly actionGroups?: readonly TopbarActionsMenuGroup[];
  readonly previewUtilities?: boolean;
  readonly tenantId?: string;
  readonly userId?: string;
  readonly utilityActionOverrides?: Partial<
    Record<TopbarUtilityId, () => void>
  >;
}
