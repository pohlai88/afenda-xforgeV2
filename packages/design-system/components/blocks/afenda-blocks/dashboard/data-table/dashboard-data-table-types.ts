import {
  DASHBOARD_DATA_TABLE_REVIEWERS,
  DASHBOARD_DATA_TABLE_TAB_VIEWS,
} from "./dashboard-data-table-constants";
import type { DashboardDataTableRow } from "./dashboard-data-table-schema";

export type DashboardDataTableStatus = DashboardDataTableRow["status"];

export type DashboardDataTableSectionType = DashboardDataTableRow["type"];

export type DashboardDataTableReviewer =
  (typeof DASHBOARD_DATA_TABLE_REVIEWERS)[number];

export type DashboardDataTableTabView =
  (typeof DASHBOARD_DATA_TABLE_TAB_VIEWS)[number]["value"];

export interface DashboardDataTableProps {
  readonly className?: string;
  readonly data: readonly DashboardDataTableRow[];
}
