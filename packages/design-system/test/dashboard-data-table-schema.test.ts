import { describe, expect, it } from "vitest";

import { DEMO_DASHBOARD_DATA_TABLE_ROWS } from "../components/blocks/afenda-blocks/shadcn-dashboard-01";
import { dashboardDataTableSchema } from "../components/blocks/afenda-blocks/shadcn-dashboard-01";

describe("dashboard data table schema", () => {
  it("validates demo rows", () => {
    for (const row of DEMO_DASHBOARD_DATA_TABLE_ROWS) {
      expect(dashboardDataTableSchema.parse(row)).toEqual(row);
    }
  });
});
