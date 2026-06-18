import { blockRecipe } from "../../../block-recipes";

/** Transparent nav strip — embedded on body default bg, no blockChrome fill */
const dashboardNavTopbarShellClass = [
  blockRecipe("blockShell"),
  "sticky top-0 z-[var(--xforge-z-sticky)] flex h-[var(--dashboard-nav-topbar-height,var(--xforge-layout-app-topbar))] shrink-0 items-center justify-between gap-3 bg-transparent px-4 text-sidebar-foreground antialiased lg:px-6",
].join(" ");

const dashboardNavTopbarLeftClass = "flex min-w-0 items-center gap-1";

const dashboardNavTopbarRightClass =
  "flex shrink-0 items-center justify-end gap-0.5";

export {
  dashboardNavTopbarLeftClass,
  dashboardNavTopbarRightClass,
  dashboardNavTopbarShellClass,
};
