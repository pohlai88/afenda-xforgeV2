import { DEFAULT_DASHBOARD_NAV_TOPBAR_HEIGHT } from "../topbar/dashboard-topbar-constants";
import { DASHBOARD_CHROME_INSET } from "./dashboard-page-spacing";

export const DASHBOARD_PAGE_DESCRIPTION =
  "Composed dashboard-01 page with transparent nav topbar, sidebar, page header, KPI cards, chart, data table, and site footer.";

/** Matches shadcn dashboard-01 (72 × 4px spacing unit). Afenda sidebar default is 17rem. */
export const DEFAULT_DASHBOARD_PAGE_SIDEBAR_WIDTH = "18rem";

/** Site header height (12 × 4px spacing unit). */
export const DEFAULT_DASHBOARD_PAGE_HEADER_HEIGHT = "3rem";

/** Reserved footer band below sidebar + inset (12 × 4px spacing unit). */
export const DEFAULT_DASHBOARD_FOOTER_HEIGHT = "3rem";

export const DEFAULT_DASHBOARD_PAGE_PROVIDER_STYLE = {
  "--dashboard-chrome-inset": DASHBOARD_CHROME_INSET,
  "--dashboard-footer-height": DEFAULT_DASHBOARD_FOOTER_HEIGHT,
  "--dashboard-nav-topbar-height": DEFAULT_DASHBOARD_NAV_TOPBAR_HEIGHT,
  "--dashboard-sidebar-bottom": "0px",
  "--dashboard-sidebar-top": "0px",
  "--dashboard-site-header-height": DEFAULT_DASHBOARD_PAGE_HEADER_HEIGHT,
  "--header-height": DEFAULT_DASHBOARD_PAGE_HEADER_HEIGHT,
  "--sidebar-width": DEFAULT_DASHBOARD_PAGE_SIDEBAR_WIDTH,
} as const;
