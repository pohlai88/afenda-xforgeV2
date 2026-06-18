import {
  navGroupLabelClass,
  navGroupShellClass,
  navItemBaseClass,
  navItemIconClass,
  navItemIdleClass,
  navItemLabelClass,
  navItemSelectedClass,
  sidebarLinkClass,
} from "../../shadcn-dashboard-01/nav-main-recipes";

const appSidebarMainNavShellClass = [
  "shrink-0 py-1",
  "group-data-[collapsible=icon]:py-0",
].join(" ");

const appSidebarScrollAreaClass = [
  "min-h-0 flex-1",
  "[&_[data-slot=scroll-area-scrollbar][data-orientation=horizontal]]:hidden",
  "[&_[data-slot=scroll-area-scrollbar][data-orientation=vertical]]:w-1",
  "[&_[data-slot=scroll-area-scrollbar][data-orientation=vertical]]:border-l-0",
  "[&_[data-slot=scroll-area-scrollbar][data-orientation=vertical]]:p-0",
  "[&_[data-slot=scroll-area-thumb]]:bg-border-default/20",
  "[&_[data-slot=scroll-area-thumb]]:hover:bg-border-default/35",
  "group-data-[collapsible=icon]:[&_[data-slot=scroll-area-scrollbar][data-orientation=vertical]]:hidden",
].join(" ");

const appSidebarScrollContentClass = [
  "flex flex-col gap-4 py-1 pr-1",
  "group-data-[collapsible=icon]:gap-1",
  "group-data-[collapsible=icon]:py-0",
  "group-data-[collapsible=icon]:pr-0",
].join(" ");

const appSidebarFooterClass = [
  "mt-auto flex shrink-0 flex-col gap-2 pt-2 pb-[env(safe-area-inset-bottom,0px)]",
  "group-data-[collapsible=icon]:gap-1",
  "group-data-[collapsible=icon]:border-0",
  "group-data-[collapsible=icon]:pt-1.5",
].join(" ");

const appSidebarFooterSettingsClass = "min-w-0";

const appSidebarFooterUserShellClass = "min-w-0 w-full";

const appSidebarFooterUserTriggerClass = [
  "flex h-12 w-full min-w-0 items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-none transition-colors duration-80 hover:bg-surface-hover focus-visible:ring-2 focus-visible:ring-ring/30 data-[state=open]:bg-surface-hover",
  "group-data-[collapsible=icon]:size-8!",
  "group-data-[collapsible=icon]:h-8!",
  "group-data-[collapsible=icon]:justify-center",
  "group-data-[collapsible=icon]:gap-0",
  "group-data-[collapsible=icon]:p-0!",
  "group-data-[collapsible=icon]:hover:bg-transparent",
  "group-data-[collapsible=icon]:data-[state=open]:bg-transparent",
].join(" ");

const appSidebarFooterUserAvatarClass = [
  "size-8 shrink-0 rounded-lg",
  "group-data-[collapsible=icon]:size-7!",
  "group-data-[collapsible=icon]:rounded-md",
].join(" ");

const appSidebarFooterUserAvatarFallbackClass =
  "rounded-lg bg-surface-muted text-xs font-medium text-text-primary";

const appSidebarFooterUserIdentityClass =
  "grid min-w-0 flex-1 text-left text-sm leading-tight";

const appSidebarFooterUserNameClass = "truncate font-medium text-text-primary";

const appSidebarFooterUserEmailClass =
  "truncate text-[length:var(--xforge-font-caption-size)] text-text-secondary";

const appSidebarFooterUserMenuIconClass =
  "ml-auto size-4 shrink-0 text-text-secondary";

const appSidebarFooterUserMenuContentClass =
  "w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg";

const appSidebarFooterUserMenuIdentityRowClass =
  "flex items-center gap-2 px-1 py-1.5 text-left text-sm";

const appSidebarNavItemsClass = [
  "grid min-w-0 gap-1",
  "group-data-[collapsible=icon]:gap-0.5",
  "group-data-[collapsible=icon]:px-0",
].join(" ");

const appSidebarNavProductIconClass = [
  "size-4 shrink-0 rounded-sm object-cover object-center",
  "group-data-[collapsible=icon]:size-4!",
  "group-data-[collapsible=icon]:max-h-4",
  "group-data-[collapsible=icon]:max-w-4",
].join(" ");

export {
  appSidebarFooterClass,
  appSidebarFooterSettingsClass,
  appSidebarFooterUserAvatarClass,
  appSidebarFooterUserAvatarFallbackClass,
  appSidebarFooterUserEmailClass,
  appSidebarFooterUserIdentityClass,
  appSidebarFooterUserMenuContentClass,
  appSidebarFooterUserMenuIconClass,
  appSidebarFooterUserMenuIdentityRowClass,
  appSidebarFooterUserShellClass,
  appSidebarFooterUserNameClass,
  appSidebarFooterUserTriggerClass,
  appSidebarMainNavShellClass,
  appSidebarNavItemsClass,
  appSidebarNavProductIconClass,
  appSidebarScrollAreaClass,
  appSidebarScrollContentClass,
  navGroupLabelClass,
  navGroupShellClass,
  navItemBaseClass,
  navItemIconClass,
  navItemIdleClass,
  navItemLabelClass,
  navItemSelectedClass,
  sidebarLinkClass,
};
