import { sidebarIconRailBlockItemClass } from "@repo/design-system/components/afenda-ui/sidebar-rail-recipes";

const dashboardSidebarBrandButtonClass = [
  sidebarIconRailBlockItemClass,
  "data-[slot=sidebar-menu-button]:p-1.5",
].join(" ");

const dashboardSidebarBrandIconClass = "size-5 shrink-0";

const dashboardSidebarBrandLabelClass =
  "truncate text-base font-semibold text-sidebar-foreground";

export {
  dashboardSidebarBrandButtonClass,
  dashboardSidebarBrandIconClass,
  dashboardSidebarBrandLabelClass,
};
