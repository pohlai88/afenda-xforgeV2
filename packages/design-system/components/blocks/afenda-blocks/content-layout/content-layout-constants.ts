import type {
  ContentLayoutBreadcrumbItem,
  ContentLayoutFooterLink,
  ContentLayoutInsetDefaults,
} from "./content-layout-types";

export const DEFAULT_CONTENT_LAYOUT_INSETS: ContentLayoutInsetDefaults = {
  top: "var(--xforge-layout-site-inset)",
  right: "var(--xforge-layout-site-inset)",
  bottom: "var(--xforge-layout-site-inset)",
  left: "var(--xforge-layout-site-inset)",
};

export const DEFAULT_CONTENT_LAYOUT_MIN_WIDTH = 640;
export const DEFAULT_CONTENT_LAYOUT_MIN_HEIGHT = 360;

export const DEFAULT_CONTENT_LAYOUT_SIDEBAR_WIDTH =
  "var(--xforge-layout-site-sidebar)";
export const DEFAULT_CONTENT_LAYOUT_SIDEBAR_COLLAPSED_WIDTH = "2.75rem";
export const DEFAULT_CONTENT_LAYOUT_RIGHT_SIDEBAR_WIDTH =
  "var(--xforge-layout-audit-rail)";

export const DEFAULT_CONTENT_LAYOUT_TOPBAR_HEIGHT =
  "var(--xforge-layout-site-topbar)";

export const DEFAULT_CONTENT_LAYOUT_BOTTOM_DRAWER_MAX =
  "var(--xforge-layout-site-bottom-drawer-max)";
export const DEFAULT_CONTENT_LAYOUT_BOTTOM_DRAWER_MIN =
  "var(--xforge-layout-site-bottom-drawer-min)";

export const CONTENT_LAYOUT_RESIZE_HANDLE_SIZE = 8;

export const DEFAULT_CONTENT_LAYOUT_FOOTER_COPYRIGHT = "2026© Afenda Inc.";

export const EMPTY_CONTENT_LAYOUT_BREADCRUMBS: readonly ContentLayoutBreadcrumbItem[] =
  [];
export const EMPTY_CONTENT_LAYOUT_FOOTER_LINKS: readonly ContentLayoutFooterLink[] =
  [];
