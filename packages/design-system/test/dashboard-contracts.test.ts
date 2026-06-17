import { describe, expect, it } from "vitest";

import { CHART_AREA_TIME_RANGE_OPTIONS } from "../components/blocks/afenda-blocks/dashboard/chart/dashboard-chart-constants";
import { DEMO_DASHBOARD_CHART_AREA_DATA } from "../components/blocks/afenda-blocks/dashboard/chart/dashboard-chart-data";
import { CHART_AREA_TIME_RANGES } from "../components/blocks/afenda-blocks/dashboard/dashboard-contracts";
import { DEMO_DASHBOARD_DATA_TABLE_ROWS } from "../components/blocks/afenda-blocks/dashboard/data-table/dashboard-data-table-demo-data";
import { DEMO_DASHBOARD_SECTION_CARDS } from "../components/blocks/afenda-blocks/dashboard/kpi-card/dashboard-section-cards-demo-data";

const dashboardContractFixtures = [
  { id: "chart-area-data", value: DEMO_DASHBOARD_CHART_AREA_DATA },
  { id: "data-table-rows", value: DEMO_DASHBOARD_DATA_TABLE_ROWS },
  { id: "section-cards", value: DEMO_DASHBOARD_SECTION_CARDS },
] as const;

describe("dashboard contract serializability", () => {
  it("keeps demo dashboard fixtures JSON-serializable", () => {
    for (const fixture of dashboardContractFixtures) {
      expect(() => assertSerializable(fixture.value, fixture.id)).not.toThrow();
      expect(JSON.parse(JSON.stringify(fixture.value))).toEqual(fixture.value);
    }
  });

  it("derives chart time range options from the canonical range set", () => {
    const canonical = new Set(CHART_AREA_TIME_RANGES);
    const optionValues = CHART_AREA_TIME_RANGE_OPTIONS.map(
      (option) => option.value
    );

    expect(new Set(optionValues)).toEqual(canonical);
    expect(optionValues).toHaveLength(CHART_AREA_TIME_RANGES.length);

    for (const option of CHART_AREA_TIME_RANGE_OPTIONS) {
      expect(option.label.length).toBeGreaterThan(0);
    }
  });
});

function assertSerializable(value: unknown, path: string): void {
  const valueType = typeof value;

  if (
    value === undefined ||
    valueType === "function" ||
    valueType === "symbol" ||
    valueType === "bigint"
  ) {
    throw new TypeError(`${path} is not JSON-serializable`);
  }

  if (value === null || valueType !== "object") {
    return;
  }

  if (Array.isArray(value)) {
    for (const [index, item] of value.entries()) {
      assertSerializable(item, `${path}[${index}]`);
    }
    return;
  }

  for (const [key, item] of Object.entries(value)) {
    assertSerializable(item, `${path}.${key}`);
  }
}
