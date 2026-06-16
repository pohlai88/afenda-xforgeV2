import { describe, expect, it } from "vitest";

import {
  flattenSidebarNavGroups,
  isSidebarNavItemActive,
  resolveSidebarActiveItemIds,
  stripSidebarNavItemSelection,
} from "../components/blocks/afenda-blocks/sidebars/sidebar-nav-helpers";
import type { SidebarNavItem } from "../components/blocks/afenda-blocks/sidebars/sidebar-types";

const baseItem: SidebarNavItem = {
  id: "cms",
  label: "Content",
  href: "/cms",
  icon: () => null,
};

describe("isSidebarNavItemActive", () => {
  it("honors explicit selected overrides before pathname matching", () => {
    expect(
      isSidebarNavItemActive("/other", { ...baseItem, selected: true })
    ).toBe(true);
    expect(
      isSidebarNavItemActive("/cms", { ...baseItem, selected: false })
    ).toBe(false);
  });

  it("matches exact routes when match is exact", () => {
    const item = { ...baseItem, match: "exact" as const };

    expect(isSidebarNavItemActive("/cms", item)).toBe(true);
    expect(isSidebarNavItemActive("/cms/posts", item)).toBe(false);
  });

  it("matches nested routes with prefix strategy by default", () => {
    expect(isSidebarNavItemActive("/cms", baseItem)).toBe(true);
    expect(isSidebarNavItemActive("/cms/posts/1", baseItem)).toBe(true);
    expect(isSidebarNavItemActive("/cms-admin", baseItem)).toBe(false);
  });

  it("normalizes trailing slashes before comparing paths", () => {
    expect(
      isSidebarNavItemActive("/cms/", { ...baseItem, href: "/cms/" })
    ).toBe(true);
    expect(
      isSidebarNavItemActive("/cms/posts/", {
        ...baseItem,
        href: "/cms/posts/",
      })
    ).toBe(true);
  });

  it("only activates root when pathname is root", () => {
    const home = {
      id: "home",
      label: "Home",
      href: "/",
      icon: () => null,
      match: "exact" as const,
    };

    expect(isSidebarNavItemActive("/", home)).toBe(true);
    expect(isSidebarNavItemActive("/cms", home)).toBe(false);
  });
});

describe("flattenSidebarNavGroups", () => {
  it("returns nav items in group order", () => {
    const groups = [
      {
        id: "a",
        label: "A",
        items: [{ ...baseItem, id: "one" }],
      },
      {
        id: "b",
        label: "B",
        items: [{ ...baseItem, id: "two", href: "/webhooks" }],
      },
    ] as const;

    expect(flattenSidebarNavGroups(groups).map((item) => item.id)).toEqual([
      "one",
      "two",
    ]);
  });
});

describe("resolveSidebarActiveItemIds", () => {
  it("returns only ids that match the current pathname", () => {
    const groups = [
      {
        id: "workspace",
        label: "Workspace",
        items: [
          { ...baseItem, id: "cms", href: "/cms" },
          { ...baseItem, id: "webhooks", href: "/webhooks" },
        ],
      },
    ];

    expect(
      [...resolveSidebarActiveItemIds(groups, "/cms/posts")].sort()
    ).toEqual(["cms"]);
    expect(
      [...resolveSidebarActiveItemIds(groups, "/webhooks")].sort()
    ).toEqual(["webhooks"]);
  });
});

describe("stripSidebarNavItemSelection", () => {
  it("removes static selected flags from nav config", () => {
    const groups = [
      {
        id: "ops",
        label: "Operations",
        items: [{ ...baseItem, selected: true }],
      },
    ];

    const stripped = stripSidebarNavItemSelection(groups);
    expect(stripped[0]?.items[0]?.selected).toBeUndefined();
    expect(isSidebarNavItemActive("/cms", stripped[0]!.items[0]!)).toBe(true);
  });
});
