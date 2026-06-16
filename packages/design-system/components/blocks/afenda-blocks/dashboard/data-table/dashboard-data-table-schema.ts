import { z } from "zod";
import {
  DASHBOARD_DATA_TABLE_SECTION_TYPES,
  DASHBOARD_DATA_TABLE_STATUSES,
} from "./dashboard-data-table-constants";

export const dashboardDataTableSchema = z.object({
  id: z.number().int().positive(),
  header: z.string().min(1),
  type: z.enum(DASHBOARD_DATA_TABLE_SECTION_TYPES),
  status: z.enum(DASHBOARD_DATA_TABLE_STATUSES),
  target: z.string(),
  limit: z.string(),
  reviewer: z.string(),
});

export type DashboardDataTableRow = z.infer<typeof dashboardDataTableSchema>;
