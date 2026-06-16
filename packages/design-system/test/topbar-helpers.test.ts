import { describe, expect, it } from "vitest";

import { resolveTopbarSidebarControl } from "../components/blocks/afenda-blocks/topbars/topbar-helpers";

describe("resolveTopbarSidebarControl", () => {
  it("returns null when sidebar control is omitted or false", () => {
    expect(resolveTopbarSidebarControl()).toBeNull();
    expect(resolveTopbarSidebarControl(false)).toBeNull();
  });

  it("returns default props when sidebar control is true", () => {
    expect(resolveTopbarSidebarControl(true)).toEqual({});
  });

  it("returns explicit props when an object is provided", () => {
    expect(
      resolveTopbarSidebarControl({ menuLabel: "Sidebar", side: "top" })
    ).toEqual({ menuLabel: "Sidebar", side: "top" });
  });
});
