/**
 * Nav topbar chrome only — SidebarInset radius/margin/shadow come from afenda-ui primitive (shadcn parity).
 */
const dashboardPageProviderClass = [
  "min-h-svh w-full flex-col",
  "has-data-[variant=inset]:!bg-transparent",
  "[&_[data-slot=sidebar-inner]]:!bg-transparent",
  "[&_[data-slot=sidebar-inner]]:shadow-none",
].join(" ");

const dashboardPageChromeClass = [
  "grid min-h-0 min-w-0 flex-1",
  "grid-rows-[var(--dashboard-nav-topbar-height)_minmax(0,1fr)]",
].join(" ");

const dashboardPageBodyClass =
  "relative flex min-h-0 min-w-0 flex-1 overflow-hidden";

const dashboardAppSidebarContainClass = [
  "!absolute",
  "!top-[var(--dashboard-sidebar-top,0px)]",
  "!bottom-[var(--dashboard-sidebar-bottom,0px)]",
  "!h-auto",
  "!max-h-full",
].join(" ");

const dashboardPageMainColumnClass = "flex min-h-0 min-w-0 flex-1 flex-col";

/**
 * DashboardPage wraps SidebarInset inside a right-column container, so the
 * primitive's peer-data inset geometry does not activate here. Apply the
 * floating panel treatment at the block layer explicitly.
 */
const dashboardPageInsetClass = [
  "md:m-2 md:ml-0",
  "md:overflow-hidden",
  "md:rounded-[var(--card-radius)]",
  "md:shadow-panel",
].join(" ");

const dashboardPageFooterSlotClass = [
  "flex shrink-0 items-center",
  "[height:var(--dashboard-footer-height,0px)]",
  "px-4 lg:px-6",
].join(" ");

/** shadcn dashboard-01 page.tsx */
const dashboardPageMainClass = "flex flex-1 flex-col";

const dashboardPageContainerClass =
  "@container/main flex flex-1 flex-col gap-2";

const dashboardPageContentClass =
  "flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6";

const dashboardPageChartSectionClass = "";

export {
  dashboardAppSidebarContainClass,
  dashboardPageBodyClass,
  dashboardPageChartSectionClass,
  dashboardPageChromeClass,
  dashboardPageContainerClass,
  dashboardPageContentClass,
  dashboardPageFooterSlotClass,
  dashboardPageInsetClass,
  dashboardPageMainClass,
  dashboardPageMainColumnClass,
  dashboardPageProviderClass,
};
