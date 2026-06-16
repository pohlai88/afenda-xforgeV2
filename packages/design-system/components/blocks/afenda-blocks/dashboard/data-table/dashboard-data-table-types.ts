import type { DashboardDataTableTabView } from "./dashboard-data-table-constants";
import type { DashboardDataTableRow } from "./dashboard-data-table-schema";

export type { DashboardDataTableTabView } from "./dashboard-data-table-constants";

export interface DashboardDataTableTabViewOption {
  readonly badge?: string;
  readonly label: string;
  readonly value: DashboardDataTableTabView;
}

export interface DashboardDataTableProps {
  readonly className?: string;
  readonly data: readonly DashboardDataTableRow[];
}
