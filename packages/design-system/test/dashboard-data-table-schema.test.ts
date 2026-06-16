import { describe, expect, it } from "vitest";

import { DEMO_DASHBOARD_DATA_TABLE_ROWS } from "../components/blocks/afenda-blocks/dashboard/data-table/dashboard-data-table-demo-data";
import { dashboardDataTableSchema } from "../components/blocks/afenda-blocks/dashboard/data-table/dashboard-data-table-schema";

describe("dashboardDataTableSchema", () => {
  it("parses every demo dashboard data table row", () => {
    for (const row of DEMO_DASHBOARD_DATA_TABLE_ROWS) {
      const result = dashboardDataTableSchema.safeParse(row);

      expect(result.success, `row ${row.id} should match schema`).toBe(true);
    }
  });

  it("parses the full demo dataset as an array", () => {
    const result = dashboardDataTableSchema
      .array()
      .safeParse(DEMO_DASHBOARD_DATA_TABLE_ROWS);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data).toHaveLength(DEMO_DASHBOARD_DATA_TABLE_ROWS.length);
    }
  });

  it("rejects rows with invalid status or section type", () => {
    const [firstRow] = DEMO_DASHBOARD_DATA_TABLE_ROWS;
    expect(firstRow).toBeDefined();

    expect(
      dashboardDataTableSchema.safeParse({
        ...firstRow,
        status: "Invalid",
      }).success
    ).toBe(false);

    expect(
      dashboardDataTableSchema.safeParse({
        ...firstRow,
        type: "Unknown section",
      }).success
    ).toBe(false);
  });
});
