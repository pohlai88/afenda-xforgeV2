import type {
  ComponentPropsWithoutRef,
  PointerEvent as ReactPointerEvent,
  ReactNode,
  RefObject,
} from "react";
import type { BlockBaseProps } from "../../foundation";

export const CONTENT_LAYOUT_SIDES = ["left", "right"] as const;
export type ContentLayoutSide = (typeof CONTENT_LAYOUT_SIDES)[number];

export const CONTENT_LAYOUT_RESIZE_INTENTS = [
  "resize-bottom",
  "resize-left",
  "resize-right",
  "resize-top",
] as const;
export type ContentLayoutResizeIntent =
  (typeof CONTENT_LAYOUT_RESIZE_INTENTS)[number];

export interface ContentLayoutBreadcrumbItem {
  readonly active?: boolean;
  readonly href?: string;
  readonly id: string;
  readonly label: string;
  /** Shows a menu chevron when the crumb opens a submenu. */
  readonly menu?: boolean;
  readonly onSelect?: () => void;
}

export interface ContentLayoutFooterLink {
  readonly href: string;
  readonly id: string;
  readonly label: string;
}

export interface ContentLayoutGeometry {
  readonly height: number;
  readonly width: number;
  readonly x: number;
  readonly y: number;
}

export interface ContentLayoutInsetOverrides {
  readonly bottom?: string;
  readonly left?: string;
  readonly right?: string;
  readonly top?: string;
}

export type ContentLayoutInsetDefaults = Required<ContentLayoutInsetOverrides>;

export interface ContentLayoutResizeConfig extends ContentLayoutInsetOverrides {
  readonly adjustable?: boolean;
  readonly maxHeight?: number;
  readonly maxWidth?: number;
  readonly minHeight?: number;
  readonly minWidth?: number;
}

export interface ContentLayoutSidebarConfig {
  readonly ariaLabel?: string;
  readonly className?: string;
  readonly collapsed?: boolean;
  readonly collapsedWidth?: string;
  readonly defaultCollapsed?: boolean;
  readonly onCollapsedChange?: (collapsed: boolean) => void;
  readonly width?: string;
}

export interface ContentLayoutBottomDrawerConfig {
  readonly className?: string;
  readonly defaultOpen?: boolean;
  readonly label?: string;
  readonly maxHeight?: string;
  readonly minHeight?: string;
  readonly onOpenChange?: (open: boolean) => void;
  readonly open?: boolean;
}

export interface ContentLayoutBreadcrumbsTopbarProps {
  readonly className?: string;
  readonly items: readonly ContentLayoutBreadcrumbItem[];
  readonly trailing?: ReactNode;
}

export interface ContentLayoutFooterProps {
  readonly className?: string;
  readonly copyright?: ReactNode;
  readonly links?: readonly ContentLayoutFooterLink[];
}

export interface ContentLayoutSidebarProps {
  readonly children?: ReactNode;
  readonly config?: ContentLayoutSidebarConfig;
  readonly defaultWidth?: string;
  readonly side: ContentLayoutSide;
}

export type ContentLayoutSidebarPanelProps = ContentLayoutSidebarProps & {
  readonly children: ReactNode;
};

export interface ContentLayoutBottomDrawerProps {
  readonly children?: ReactNode;
  readonly config?: ContentLayoutBottomDrawerConfig;
}

export type ContentLayoutBottomDrawerPanelProps =
  ContentLayoutBottomDrawerProps & {
    readonly children: ReactNode;
  };

export interface ContentLayoutBodyGridInput {
  readonly hasLeftSidebar: boolean;
  readonly hasRightSidebar: boolean;
}

export type ContentLayoutResizeStartHandler = (
  event: ReactPointerEvent<HTMLButtonElement>,
  intent: ContentLayoutResizeIntent
) => void;

export interface ContentLayoutBlockProps
  extends Omit<ComponentPropsWithoutRef<"div">, "children">,
    BlockBaseProps {
  readonly bottomDrawer?: ReactNode;
  readonly bottomDrawerConfig?: ContentLayoutBottomDrawerConfig;
  readonly breadcrumbItems?: readonly ContentLayoutBreadcrumbItem[];
  readonly breadcrumbTrailing?: ReactNode;
  readonly children?: ReactNode;
  readonly contentClassName?: string;
  readonly footer?: ReactNode;
  readonly footerCopyright?: ReactNode;
  readonly footerLinks?: readonly ContentLayoutFooterLink[];
  readonly leftSidebar?: ReactNode;
  readonly leftSidebarConfig?: ContentLayoutSidebarConfig;
  readonly resizeConfig?: ContentLayoutResizeConfig;
  readonly rightSidebar?: ReactNode;
  readonly rightSidebarConfig?: ContentLayoutSidebarConfig;
  readonly stageRef?: RefObject<HTMLElement | null>;
}
