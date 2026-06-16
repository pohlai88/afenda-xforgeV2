import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  dashboardBlockCardSurfaceClass,
  dashboardDataTableTableClass,
  dashboardFloatingPanelClass,
  dashboardKpiCardTintClass,
  dashboardSystemCanvasClass,
} from "../components/blocks/afenda-blocks/dashboard/dashboard-block-recipes";
import { DashboardPage } from "../components/blocks/afenda-blocks/dashboard/dashboard-page/dashboard-page";
import { DEFAULT_DASHBOARD_PAGE_PROVIDER_STYLE } from "../components/blocks/afenda-blocks/dashboard/dashboard-page/dashboard-page-constants";
import { dashboardPageFooterClass } from "../components/blocks/afenda-blocks/dashboard/dashboard-page/dashboard-page-footer-recipes";
import {
  dashboardAppSidebarContainClass,
  dashboardPageChartSectionClass,
  dashboardPageContainerClass,
  dashboardPageContentClass,
  dashboardPageInsetClass,
  dashboardPageMainClass,
  dashboardPageProviderClass,
} from "../components/blocks/afenda-blocks/dashboard/dashboard-page/dashboard-page-recipes";
import {
  dashboardDataTableGridClass,
  dashboardDataTableHeaderClass,
  dashboardDataTableTabsListClass,
} from "../components/blocks/afenda-blocks/dashboard/data-table/dashboard-data-table-recipes";
import { sectionCardsCardClass } from "../components/blocks/afenda-blocks/dashboard/kpi-card/dashboard-section-cards-recipes";
import {
  siteHeaderActionsClass,
  siteHeaderInnerClass,
  siteHeaderShellClass,
} from "../components/blocks/afenda-blocks/dashboard/site-header/dashboard-site-header-recipes";
import { dashboardNavTopbarShellClass } from "../components/blocks/afenda-blocks/dashboard/topbar/dashboard-topbar-recipes";

const dashboardRoot = join(
  fileURLToPath(new URL(".", import.meta.url)),
  "..",
  "components",
  "blocks",
  "afenda-blocks",
  "dashboard"
);

const dashboardPageSource = readFileSync(
  join(dashboardRoot, "dashboard-page", "dashboard-page.tsx"),
  "utf8"
);

const dashboardDataTableSource = readFileSync(
  join(dashboardRoot, "data-table", "dashboard-data-table.tsx"),
  "utf8"
);

const sidebarPrimitiveSource = readFileSync(
  join(
    fileURLToPath(new URL(".", import.meta.url)),
    "..",
    "components",
    "afenda-ui",
    "sidebar.tsx"
  ),
  "utf8"
);

/** Tokens that flatten the floating inset panel back onto the default background */
const forbiddenInsetFlattenTokens = [
  "!shadow-none",
  "md:peer-data-[variant=inset]:!m-0",
  "md:peer-data-[variant=inset]:!ml-0",
  "md:peer-data-[variant=inset]:!rounded-none",
  "md:peer-data-[variant=inset]:peer-data-[state=collapsed]:!ml-0",
  "md:peer-data-[variant=inset]:!shadow-none",
] as const;

/** Wrapper fills that cover sidebar + content as one built surface */
const forbiddenWrapperBackgroundTokens = [
  "bg-canvas",
  "bg-surface-muted",
  "bg-surface-canvas",
  "bg-sidebar",
  "has-data-[variant=inset]:!bg-canvas",
  "has-data-[variant=inset]:bg-canvas",
  "min-h-svh bg-canvas",
] as const;

/** Sidebar inner fills that break embedded nav on default background */
const forbiddenSidebarInnerFillTokens = [
  "[&_[data-slot=sidebar-inner]]:bg-sidebar",
  "[&_[data-slot=sidebar-inner]]:bg-surface-raised",
  "[&_[data-slot=sidebar-inner]]:!bg-sidebar",
] as const;

function extractClassFromMarkup(
  markup: string,
  slot: string
): string | undefined {
  const tagPattern = new RegExp(`<[a-z][^>]*data-slot="${slot}"[^>]*>`, "iu");
  const tag = tagPattern.exec(markup)?.[0];
  if (!tag) {
    return undefined;
  }

  return /class="([^"]*)"/u.exec(tag)?.[1];
}

function normalizeMarkupClass(className: string): string {
  return className.replaceAll("&amp;", "&");
}

function assertDashboardProviderRecipe(className: string, label: string): void {
  assertNoBuiltWrapperBackground(className, label);
  assertEmbeddedSidebar(className, label);
}

function assertRenderedProviderShell(className: string, label: string): void {
  const normalized = normalizeMarkupClass(className);
  expect(normalized, `${label} must cancel inset gutter fill`).toContain(
    "has-data-[variant=inset]:!bg-transparent"
  );
  expect(normalized, `${label} must not add canvas wrapper fill`).not.toMatch(
    /(?:^|\s)!?bg-canvas(?:\s|$)/
  );
  assertEmbeddedSidebar(className, label);
}

function assertNoBuiltWrapperBackground(
  className: string,
  label: string
): void {
  const normalized = normalizeMarkupClass(className);
  for (const token of forbiddenWrapperBackgroundTokens) {
    expect(
      normalized,
      `${label} must not paint wrapper with ${token}`
    ).not.toContain(token);
  }
  expect(normalized, `${label} must cancel inset gutter fill`).toContain(
    "has-data-[variant=inset]:!bg-transparent"
  );
}

function assertEmbeddedSidebar(className: string, label: string): void {
  const normalized = normalizeMarkupClass(className);
  expect(normalized, `${label} must transparentize sidebar inner`).toContain(
    "[&_[data-slot=sidebar-inner]]:!bg-transparent"
  );
  for (const token of forbiddenSidebarInnerFillTokens) {
    expect(normalized, `${label} must not use ${token}`).not.toContain(token);
  }
}

function _assertInsetNotFlattened(className: string, label: string): void {
  for (const token of forbiddenInsetFlattenTokens) {
    expect(
      className,
      `${label} must not flatten inset with ${token}`
    ).not.toContain(token);
  }
}

function findFlatSurfaceViolations(source: string): string[] {
  const violations: string[] = [];

  for (const line of source.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("*") || trimmed.startsWith("//")) {
      continue;
    }

    if (
      /(?:hover:|focus-visible:|focus:|active:|data-\[state|group-hover:)/.test(
        line
      )
    ) {
      continue;
    }

    for (const token of forbiddenInsetFlattenTokens) {
      if (line.includes(token)) {
        violations.push(token);
      }
    }

    for (const token of forbiddenWrapperBackgroundTokens) {
      if (line.includes(token)) {
        violations.push(token);
      }
    }

    for (const token of forbiddenSidebarInnerFillTokens) {
      if (line.includes(token)) {
        violations.push(token);
      }
    }

    if (line.includes("has-data-[variant=inset]:!bg-sidebar")) {
      violations.push("has-data-[variant=inset]:!bg-sidebar");
    }
  }

  return violations;
}

describe("dashboard-01 inset floating panel recipes", () => {
  it("uses canvas for the system shell and sidebar for the floating panel token", () => {
    expect(dashboardSystemCanvasClass).toBe("bg-canvas");
    expect(dashboardFloatingPanelClass).toBe("bg-sidebar");
  });

  it("keeps cards outline-only on the floating panel", () => {
    expect(dashboardBlockCardSurfaceClass).toContain("!bg-transparent");
    expect(dashboardBlockCardSurfaceClass).toContain("!shadow-none");
    expect(dashboardBlockCardSurfaceClass).not.toContain("bg-surface-raised");
    expect(dashboardBlockCardSurfaceClass).not.toContain("shadow-panel");
  });

  it("uses a subtle KPI tint instead of a second card fill", () => {
    expect(dashboardKpiCardTintClass).toContain("to-transparent");
    expect(dashboardKpiCardTintClass).not.toContain("to-surface-raised");
    expect(dashboardKpiCardTintClass).not.toContain("bg-surface-raised");
  });

  it("strips nested table panel surfaces inside the data-table outline", () => {
    expect(dashboardDataTableTableClass).toContain("!bg-transparent");
    expect(dashboardDataTableTableClass).toContain("!shadow-none");
    expect(dashboardDataTableTableClass).toContain("!border-0");
  });

  it("sets transparent provider and shadcn dashboard-01 page wiring", () => {
    assertDashboardProviderRecipe(dashboardPageProviderClass, "provider");

    expect(siteHeaderShellClass).not.toContain("sticky");
    expect(siteHeaderShellClass).not.toContain("rounded-t-");
    expect(siteHeaderShellClass).not.toContain("bg-sidebar");
    expect(siteHeaderShellClass).toContain("border-b");
    expect(siteHeaderInnerClass).toContain("px-4");
    expect(siteHeaderInnerClass).toContain("lg:px-6");
    expect(siteHeaderActionsClass).toContain("ml-auto");

    expect(dashboardPageMainClass).toBe("flex flex-1 flex-col");
    expect(dashboardPageContainerClass).toBe(
      "@container/main flex flex-1 flex-col gap-2"
    );
    expect(dashboardPageContentClass).toBe(
      "flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6"
    );
    expect(dashboardPageChartSectionClass).toBe("");
    expect(dashboardPageContainerClass).not.toContain(
      "px-[var(--dashboard-chrome-inset)]"
    );

    expect(sectionCardsCardClass).toContain(dashboardBlockCardSurfaceClass);

    expect(dashboardDataTableHeaderClass).toContain("bg-sidebar");
    expect(dashboardDataTableGridClass).not.toContain("shadow-panel");
    expect(dashboardDataTableTabsListClass).toContain("!bg-transparent");
  });

  it("exposes shadcn-compatible header height on the provider", () => {
    expect(DEFAULT_DASHBOARD_PAGE_PROVIDER_STYLE).toMatchObject({
      "--header-height": expect.any(String),
      "--dashboard-site-header-height": expect.any(String),
      "--dashboard-nav-topbar-height": expect.any(String),
      "--dashboard-footer-height": expect.any(String),
      "--dashboard-sidebar-bottom": "0px",
      "--dashboard-sidebar-top": "0px",
      "--dashboard-chrome-inset": "var(--xforge-layout-site-inset)",
    });
    expect(DEFAULT_DASHBOARD_PAGE_PROVIDER_STYLE["--header-height"]).toBe(
      DEFAULT_DASHBOARD_PAGE_PROVIDER_STYLE["--dashboard-site-header-height"]
    );
  });

  it("contains sidebar to the dashboard body row height", () => {
    expect(dashboardAppSidebarContainClass).toContain("!absolute");
    expect(dashboardAppSidebarContainClass).toContain(
      "!top-[var(--dashboard-sidebar-top,0px)]"
    );
    expect(dashboardAppSidebarContainClass).toContain(
      "!bottom-[var(--dashboard-sidebar-bottom,0px)]"
    );
    expect(dashboardAppSidebarContainClass).toContain("!h-auto");
    expect(dashboardAppSidebarContainClass).not.toContain("h-svh");
  });

  it("uses transparent sticky shell for embedded nav topbar", () => {
    expect(dashboardNavTopbarShellClass).toContain("bg-transparent");
    expect(dashboardNavTopbarShellClass).not.toContain("bg-surface-raised");
    expect(dashboardNavTopbarShellClass).toContain("sticky");
    expect(dashboardNavTopbarShellClass).toContain("top-0");
  });

  it("renders footer on canvas below the inset panel", () => {
    expect(dashboardPageFooterClass).toContain("bg-transparent");
    expect(dashboardPageFooterClass).not.toContain("border-t");
    expect(dashboardPageFooterClass).not.toContain("bg-sidebar");
  });
});

describe("dashboard page composition contract", () => {
  it("defaults to inset variant for floating main panel", () => {
    expect(dashboardPageSource).toMatch(
      /DEFAULT_APP_SIDEBAR_VARIANT\s*=\s*"inset"/
    );
    expect(dashboardPageSource).not.toMatch(
      /DEFAULT_APP_SIDEBAR_VARIANT\s*=\s*"sidebar"/
    );
    expect(dashboardPageSource).toContain("dashboardPageProviderClass");
  });

  it("wires table panel stripping in the data table block", () => {
    expect(dashboardDataTableSource).toContain("dashboardDataTableTableClass");
    expect(dashboardDataTableSource).toMatch(
      /<Table className=\{dashboardDataTableTableClass\}/
    );
  });

  it("uses bg-sidebar on SidebarInset with inset lift from the primitive", () => {
    expect(sidebarPrimitiveSource).toContain("function SidebarInset");
    expect(sidebarPrimitiveSource).toMatch(/SidebarInset[\s\S]*bg-sidebar/);
    expect(dashboardPageSource).toContain("dashboardPageInsetClass");
    expect(dashboardPageInsetClass).toContain(
      "md:rounded-[var(--card-radius)]"
    );
    expect(dashboardPageInsetClass).toContain("md:overflow-hidden");
    expect(dashboardPageInsetClass).toContain("md:shadow-panel");
  });

  it("renders transparent wrapper shell, embedded sidebar, and inset variant", () => {
    const markup = renderToStaticMarkup(createElement(DashboardPage));

    expect(markup).toContain('data-slot="dashboard-page"');
    expect(markup).toContain('data-slot="dashboard-chrome"');
    expect(markup).toContain('data-slot="dashboard-nav-topbar"');
    expect(markup).toContain('data-slot="dashboard-body"');
    expect(markup).toContain('data-slot="dashboard-main-column"');
    expect(markup).toContain('data-slot="sidebar-inset"');
    expect(markup).toContain('data-slot="dashboard-footer"');
    expect(markup).toContain('data-slot="content-layout-footer"');
    expect(markup).toContain('data-slot="nav-started"');

    const insetIndex = markup.indexOf('data-slot="sidebar-inset"');
    const insetCloseIndex = markup.indexOf("</main>", insetIndex);
    const footerIndex = markup.indexOf('data-slot="dashboard-footer"');
    expect(insetIndex, "inset missing").toBeGreaterThan(-1);
    expect(footerIndex, "footer missing").toBeGreaterThan(insetIndex);
    expect(
      footerIndex,
      "footer must sit outside sidebar-inset"
    ).toBeGreaterThan(insetCloseIndex);
    expect(markup).not.toContain('data-variant="sidebar"');

    const wrapperClass = extractClassFromMarkup(markup, "dashboard-page");
    const topbarClass = extractClassFromMarkup(markup, "dashboard-nav-topbar");
    const insetClass = extractClassFromMarkup(markup, "sidebar-inset");

    expect(wrapperClass, "wrapper class missing").toBeDefined();
    expect(topbarClass, "nav topbar class missing").toBeDefined();
    expect(insetClass, "inset class missing").toBeDefined();

    assertRenderedProviderShell(wrapperClass!, "rendered wrapper");
    expect(
      normalizeMarkupClass(topbarClass!),
      "nav topbar must stay transparent"
    ).toContain("bg-transparent");
    expect(
      normalizeMarkupClass(insetClass!),
      "inset should inherit primitive bg-sidebar"
    ).toContain("bg-sidebar");
    expect(
      normalizeMarkupClass(insetClass!),
      "dashboard page must apply explicit inset geometry when wrapped in main-column"
    ).toContain("md:rounded-[var(--card-radius)]");
    expect(
      normalizeMarkupClass(insetClass!),
      "inset must clip header/content to preserve rounded corners"
    ).toContain("md:overflow-hidden");
    expect(
      normalizeMarkupClass(insetClass!),
      "inset should keep floating lift"
    ).toContain("md:shadow-panel");
    expect(
      normalizeMarkupClass(insetClass!),
      "inset radius must come from primitive only"
    ).toContain("rounded-[var(--card-radius)]");
    expect(
      normalizeMarkupClass(insetClass!),
      "no dashboard inset margin overrides"
    ).not.toContain("!mt-0");
  });
});

describe("dashboard recipe file governance", () => {
  it("does not reintroduce built wrapper backgrounds in dashboard-page-recipes.ts", () => {
    const source = readFileSync(
      join(dashboardRoot, "dashboard-page", "dashboard-page-recipes.ts"),
      "utf8"
    );

    expect(
      findFlatSurfaceViolations(source),
      findFlatSurfaceViolations(source).join("\n")
    ).toEqual([]);
  });
});
