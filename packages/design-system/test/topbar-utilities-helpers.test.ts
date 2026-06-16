import { describe, expect, it } from "vitest";
import type { TopbarUtilitiesMarketItem } from "../components/blocks/afenda-blocks/topbars/topbar-types";
import {
  buildCatalogMaps,
  buildPinnedActions,
  buildPinnedOrder,
  resolveDefaultEnabledIds,
} from "../components/blocks/afenda-blocks/topbars/topbar-utilities-helpers";

const catalog: readonly TopbarUtilitiesMarketItem[] = [
  { id: "help", label: "Help", icon: null },
  { id: "feedback", label: "Feedback", icon: null },
  { id: "notifications", label: "Notifications", icon: null },
  { id: "search", label: "Search", icon: null },
];

describe("resolveDefaultEnabledIds", () => {
  it("preserves explicit defaults within the pinned slot limit", () => {
    expect(
      resolveDefaultEnabledIds(catalog, [
        "help",
        "feedback",
        "notifications",
        "search",
      ])
    ).toEqual(["help", "feedback", "notifications", "search"]);
  });

  it("falls back to the first catalog entries when defaults are omitted", () => {
    expect(resolveDefaultEnabledIds(catalog)).toEqual([
      "help",
      "feedback",
      "notifications",
      "search",
    ]);
  });
});

describe("buildPinnedOrder", () => {
  it("keeps only enabled ids in order and respects the pin cap", () => {
    expect(
      buildPinnedOrder(
        ["search", "help", "feedback", "notifications"],
        ["help", "notifications"],
        2
      )
    ).toEqual(["help", "notifications"]);
  });
});

describe("buildPinnedActions", () => {
  it("maps pinned order back to catalog actions", () => {
    const { catalogById } = buildCatalogMaps(catalog);

    expect(buildPinnedActions(catalogById, ["feedback", "help"])).toEqual([
      catalog[1],
      catalog[0],
    ]);
  });
});
