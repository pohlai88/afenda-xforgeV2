import { describe, expect, it } from "vitest";
import {
  collectSidebarNavItemDescriptors,
  resolveAfendaAppSidebarNavItemDescriptor,
  resolveAfendaAppSidebarNavLayout,
} from "../components/blocks/afenda-blocks/afenda-appshell/sidebar/sidebar-nav-descriptors";
import { collectSidebarNavItems } from "../components/blocks/afenda-blocks/afenda-appshell/sidebar/sidebar-nav-types";
import { resolveActiveSidebarNavItemId } from "../components/blocks/afenda-blocks/afenda-appshell/sidebar/sidebar-nav-utils";
import { normalizeTopbarUtilitiesState } from "../components/blocks/afenda-blocks/afenda-appshell/topbar/topbar-utilities-storage";

const testIconRegistry = {
  settings: () => null,
  shield: () => null,
} as const;

describe("collectSidebarNavItemDescriptors", () => {
  it("returns empty groups when descriptor nav is undefined", () => {
    expect(collectSidebarNavItemDescriptors(undefined)).toEqual([]);
  });

  it("collects main, scroll, and footer descriptor groups", () => {
    const groups = collectSidebarNavItemDescriptors({
      main: {
        groupSlot: "app-sidebar-main-nav",
        label: "Main",
        items: [
          {
            id: "home",
            kind: "product",
            label: "Home",
            href: "/",
            iconSrc: "/x.png",
          },
        ],
      },
      scroll: [
        {
          groupSlot: "app-sidebar-erp-nav",
          label: "ERP",
          items: [
            {
              id: "crm",
              kind: "icon",
              label: "CRM",
              href: "/crm",
              iconKey: "shield",
            },
          ],
        },
      ],
      footer: {
        groupSlot: "app-sidebar-settings-nav",
        label: "Settings",
        items: [
          {
            id: "settings",
            kind: "icon",
            label: "Settings",
            href: "/settings",
            iconKey: "settings",
          },
        ],
      },
    });

    expect(groups).toHaveLength(3);
    expect(groups[0]?.[0]?.id).toBe("home");
    expect(groups[1]?.[0]?.id).toBe("crm");
    expect(groups[2]?.[0]?.id).toBe("settings");
  });
});

describe("resolveAfendaAppSidebarNavLayout", () => {
  it("maps icon keys through the registry", () => {
    const layout = resolveAfendaAppSidebarNavLayout(
      {
        main: {
          groupSlot: "app-sidebar-main-nav",
          label: "Main",
          items: [
            {
              id: "settings",
              kind: "icon",
              label: "Settings",
              href: "/settings",
              iconKey: "settings",
            },
          ],
        },
      },
      testIconRegistry
    );

    expect(layout.main?.items[0]?.kind).toBe("icon");
    if (layout.main?.items[0]?.kind === "icon") {
      expect(layout.main.items[0].icon).toBe(testIconRegistry.settings);
    }
  });

  it("throws for unknown icon keys", () => {
    expect(() =>
      resolveAfendaAppSidebarNavItemDescriptor(
        {
          id: "missing",
          kind: "icon",
          label: "Missing",
          href: "/missing",
          iconKey: "missing-key",
        },
        testIconRegistry
      )
    ).toThrow(/Unknown sidebar nav icon key/);
  });
});

describe("collectSidebarNavItems", () => {
  it("returns empty groups when nav is undefined", () => {
    expect(collectSidebarNavItems(undefined)).toEqual([]);
  });

  it("collects main, scroll, and footer item groups", () => {
    const groups = collectSidebarNavItems({
      main: {
        groupSlot: "app-sidebar-main-nav",
        label: "Main",
        items: [
          {
            id: "home",
            kind: "icon",
            label: "Home",
            href: "/",
            icon: () => null,
          },
        ],
      },
      scroll: [
        {
          groupSlot: "app-sidebar-erp-nav",
          label: "ERP",
          items: [
            {
              id: "crm",
              kind: "icon",
              label: "CRM",
              href: "/crm",
              icon: () => null,
            },
          ],
        },
      ],
      footer: {
        groupSlot: "app-sidebar-settings-nav",
        label: "Settings",
        items: [
          {
            id: "settings",
            kind: "icon",
            label: "Settings",
            href: "/settings",
            icon: () => null,
          },
        ],
      },
    });

    expect(groups).toHaveLength(3);
    expect(groups[0]?.[0]?.id).toBe("home");
    expect(groups[1]?.[0]?.id).toBe("crm");
    expect(groups[2]?.[0]?.id).toBe("settings");
  });
});

describe("resolveActiveSidebarNavItemId", () => {
  const items = [
    { id: "dashboard", href: "/dashboard" },
    { id: "orbit-case", href: "/orbit-case" },
    { id: "orbit-detail", href: "/orbit-case/lead" },
  ] as const;

  it("prefers the longest matching href prefix", () => {
    expect(resolveActiveSidebarNavItemId("/orbit-case/lead/123", items)).toBe(
      "orbit-detail"
    );
  });

  it("matches exact paths", () => {
    expect(resolveActiveSidebarNavItemId("/dashboard", items)).toBe(
      "dashboard"
    );
  });
});

describe("normalizeTopbarUtilitiesState", () => {
  it("rejects unknown utility ids and preserves catalog order", () => {
    const normalized = normalizeTopbarUtilitiesState({
      order: ["search", "not-a-real-utility", "help"],
      visible: ["search", "not-a-real-utility"],
    });

    expect(normalized.visible).toEqual(["search"]);
    expect(normalized.order.includes("help")).toBe(true);
    expect(normalized.order.includes("not-a-real-utility" as never)).toBe(
      false
    );
  });
});
