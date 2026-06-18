export { AfendaAppShell } from "./app-shell";
export { AppShellSidebarProvider, useAppShellSidebar } from "./app-shell-sidebar-context";
export {
  resolveAppShellSidebarActiveWidth,
  resolveAppShellSidebarExpanded,
} from "./app-shell-sidebar-utils";
export {
  APP_SHELL_FOOTER_HEIGHT,
  APP_SHELL_RAIL_WIDTH,
  APP_SHELL_SIDEBAR_ICON_RAIL_WIDTH,
  APP_SHELL_SIDEBAR_WIDTH,
  APP_SHELL_TOPBAR_HEIGHT,
} from "./app-shell-recipes";
export type { SidebarBehaviorMode } from "../../../afenda-ui/sidebar-behavior";
export type {
  AfendaAppContentBottomDrawerProps,
  AfendaAppContentBreadcrumbItem,
  AfendaAppContentHeaderProps,
  AfendaAppContentLeftRailProps,
  AfendaAppContentProps,
  AfendaAppContentRightRailProps,
  AfendaAppFooterProps,
  AfendaAppShellProps,
  AfendaAppSidebarProps,
  AfendaAppTopbarProps,
  TopbarBrandDiskProps,
  TopbarContextOption,
  TopbarContextScope,
  TopbarContextSwitcherProps,
  TopbarDemoSelection,
  TopbarLinkedNav,
  TopbarActionsMenuGroup,
  TopbarActionsMenuItem,
  TopbarActionsMenuProps,
  TopbarRightActionsProps,
  TopbarUtilityId,
} from "./app-shell-types";
export {
  AfendaAppContent,
  AfendaAppContentBottomDrawer,
  AfendaAppContentHeader,
  AfendaAppContentLayoutProvider,
  AfendaAppContentLeftRail,
  AfendaAppContentRightRail,
  useAfendaAppContentLayout,
} from "./content";
export { AfendaAppFooter } from "./footer";
export {
  APP_SIDEBAR_DEMO_USER,
  APP_SIDEBAR_ERP_NAV_ITEMS,
  APP_SIDEBAR_MAIN_NAV_ITEMS,
  APP_SIDEBAR_PORTAL_NAV_ITEMS,
  APP_SIDEBAR_SETTINGS_NAV_ITEMS,
  AfendaAppSidebar,
  resolveActiveSidebarNavItemIds,
  SidebarNavUser,
} from "./sidebar";
export {
  AfendaAppTopbar,
  getTopbarDemoDefaultSelection,
  TOPBAR_DEMO_ACTION_GROUPS,
  TOPBAR_UTILITY_CATALOG,
  TOPBAR_UTILITY_DEFAULT_PINNED,
  TOPBAR_UTILITY_MAX_PINNED,
  TopbarActionsMenu,
  TopbarBrandDisk,
  TopbarContextSwitcher,
  TopbarRightActions,
  TopbarScopeSwitchers,
  TopbarSidebarControl,
  TopbarSidebarTrigger,
  TopbarThemeToggle,
  TopbarUtilitiesBar,
  TopbarUtilitiesMarketplace,
  TopbarUtilitiesProvider,
  useTopbarLinkedNav,
  useTopbarUtilities,
} from "./topbar";
