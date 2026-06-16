/**
 * dashboard-01 surface system — canvas outer shell, floating white main panel,
 * outline-only blocks on the raised inset (shadcn dashboard-01 inset model).
 */

/** System / outer canvas behind embedded sidebar */
const dashboardSystemCanvasClass = "bg-canvas";

/** Floating main column fill — maps to shadcn bg-background / Afenda bg-sidebar */
const dashboardFloatingPanelClass = "bg-sidebar";

/** Cards/charts: hairline border only, inherit the floating panel fill */
const dashboardBlockCardSurfaceClass = [
  "!bg-transparent",
  "!shadow-none",
  "border-border-subtle",
].join(" ");

/** Optional KPI tint without introducing a second surface color */
const dashboardKpiCardTintClass =
  "bg-gradient-to-t from-brand-primary/[0.03] to-transparent dark:from-brand-primary/[0.06]";

/** Strip afenda-ui Table panel wrapper inside the data-table outline */
const dashboardDataTableTableClass =
  "!rounded-none !border-0 !bg-transparent !p-0 !shadow-none";

export {
  dashboardBlockCardSurfaceClass,
  dashboardDataTableTableClass,
  dashboardFloatingPanelClass,
  dashboardKpiCardTintClass,
  dashboardSystemCanvasClass,
};
