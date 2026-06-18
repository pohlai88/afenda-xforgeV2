import { sidebarIconRailBlockItemClass } from "../../../afenda-ui/sidebar-rail-recipes";

const navGroupShellClass = "min-w-0 gap-1 p-0";

const navGroupLabelClass = "px-2 tracking-[0.04em]";

const navItemBaseClass =
  "group flex h-8 w-full min-w-0 items-center gap-2 rounded-md px-2 text-[12px] leading-4 transition-colors duration-80";

const navItemIdleClass = [
  "text-sidebar-foreground/88 hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
  sidebarIconRailBlockItemClass,
].join(" ");

const navItemSelectedClass = [
  "relative bg-brand-primary/10 font-medium text-brand-primary before:absolute before:inset-y-1 before:left-0 before:w-0.5 before:rounded-full before:bg-brand-primary",
  "group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:font-normal group-data-[collapsible=icon]:text-brand-primary group-data-[collapsible=icon]:before:content-none",
  sidebarIconRailBlockItemClass,
].join(" ");

const navItemIconClass = "size-4 shrink-0";

const navItemLabelClass =
  "min-w-0 flex-1 truncate group-data-[collapsible=icon]:hidden";

const sidebarLinkClass =
  "flex w-full min-w-0 items-center gap-2 outline-none";

export {
  navGroupLabelClass,
  navGroupShellClass,
  navItemBaseClass,
  navItemIconClass,
  navItemIdleClass,
  navItemLabelClass,
  navItemSelectedClass,
  sidebarLinkClass,
};
