import { describe, expect, it } from "vitest";

import {
  flattenSidebarNavGroups,
  hasOperatorSidebarNavigation,
  isSidebarCardSectionActive,
  isSidebarCardSectionItemActive,
  isSidebarNavItemActive,
  resolveSidebarActiveCardSectionIds,
  resolveSidebarActiveItemIds,
  stripSidebarNavItemSelection,
} from "../components/blocks/afenda-blocks/sidebars/sidebar-nav-helpers";
import type {
  SidebarCardSection,
  SidebarNavItem,
} from "../components/blocks/afenda-blocks/sidebars/sidebar-types";

const baseItem: SidebarNavItem = {
  id: "cms",
  label: "Content",
  href: "/cms",
  icon: () => null,
};

const baseCardSection: SidebarCardSection = {
  id: "system",
  label: "System",
  href: "/system/administration",
  icon: () => null,
  items: [
    {
      id: "notifications",
      label: "Notifications",
      href: "/system/notifications",
    },
  ],
  menuItems: [
    {
      id: "account-security",
      label: "Account security",
      href: "/account/security",
    },
  ],
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

describe("sidebar card section active state", () => {
  it("matches card items with the same path strategy as nav items", () => {
    expect(
      isSidebarCardSectionItemActive("/system/notifications", {
        id: "notifications",
        label: "Notifications",
        href: "/system/notifications",
      })
    ).toBe(true);
    expect(
      isSidebarCardSectionItemActive("/system/notifications/history", {
        id: "notifications",
        label: "Notifications",
        href: "/system/notifications",
      })
    ).toBe(true);
    expect(
      isSidebarCardSectionItemActive("/system/notifications/history", {
        id: "notifications",
        label: "Notifications",
        href: "/system/notifications",
        match: "exact",
      })
    ).toBe(false);
  });

  it("marks a card section active from its menu-only settings links", () => {
    expect(
      isSidebarCardSectionActive("/account/security", baseCardSection)
    ).toBe(true);
    expect([
      ...resolveSidebarActiveCardSectionIds(
        [baseCardSection],
        "/account/security"
      ),
    ]).toEqual(["system"]);
  });
});

describe("hasOperatorSidebarNavigation", () => {
  it("returns false when groups and labels are empty", () => {
    expect(hasOperatorSidebarNavigation([], [])).toBe(false);
  });

  it("returns true when either nav groups or label groups exist", () => {
    expect(
      hasOperatorSidebarNavigation(
        [{ id: "ops", label: "Ops", items: [baseItem] }],
        []
      )
    ).toBe(true);
    expect(
      hasOperatorSidebarNavigation(
        [],
        [
          {
            id: "signals",
            label: "Signals",
            items: [{ id: "s1", label: "Queue", tone: "warning" }],
          },
        ]
      )
    ).toBe(true);
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
    expect(isSidebarNavItemActive("/cms", stripped[0]?.items[0]!)).toBe(true);
  });
});
