import type {
  DASHBOARD_DATA_TABLE_REVIEWERS,
  DASHBOARD_DATA_TABLE_SECTION_TYPES,
  DASHBOARD_DATA_TABLE_STATUSES,
  DASHBOARD_DATA_TABLE_TAB_VIEWS,
} from "./dashboard-data-table-constants";
import type { DashboardDataTableRow } from "./dashboard-data-table-schema";

export type DashboardDataTableStatus =
  (typeof DASHBOARD_DATA_TABLE_STATUSES)[number];

export type DashboardDataTableSectionType =
  (typeof DASHBOARD_DATA_TABLE_SECTION_TYPES)[number];

export type DashboardDataTableReviewer =
  (typeof DASHBOARD_DATA_TABLE_REVIEWERS)[number];

export type DashboardDataTableTabView =
  (typeof DASHBOARD_DATA_TABLE_TAB_VIEWS)[number]["value"];

export interface DashboardDataTableProps {
  readonly className?: string;
  readonly data: readonly DashboardDataTableRow[];
}
