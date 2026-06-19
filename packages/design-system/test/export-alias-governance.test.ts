import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { AFENDA_INTERNAL_IMPLEMENTATION_PATH_PREFIXES } from "../contracts/afenda-export.contract";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

function collectExportedNamesFromSource(source: string): string[] {
  const names: string[] = [];

  for (const match of source.matchAll(/\bexport\s*{([^}]+)}/g)) {
    const exportList = match[1] ?? "";

    for (const item of exportList.split(",")) {
      const trimmed = item.trim();

      if (trimmed.startsWith("type ")) {
        continue;
      }

      const aliasMatch = trimmed.match(
        /^([A-Z][A-Za-z0-9]*)\s+as\s+([A-Z][A-Za-z0-9]*)$/
      );

      if (aliasMatch) {
        names.push(aliasMatch[1] ?? "", aliasMatch[2] ?? "");
        continue;
      }

      const exportedName = trimmed
        .replace(/\s+as\s+[A-Z][A-Za-z0-9]*$/, "")
        .trim();

      if (/^[A-Z][A-Za-z0-9]*$/.test(exportedName)) {
        names.push(exportedName);
      }
    }
  }

  return names.filter((name) => name.length > 0);
}

describe("export alias governance", () => {
  it("records both sides of export-as aliases in block barrel", () => {
    const indexSource = readFileSync(
      join(
        packageRoot,
        "components/blocks/afenda-blocks/shadcn-dashboard-01/index.ts"
      ),
      "utf8"
    );
    const exportedNames = new Set(collectExportedNamesFromSource(indexSource));

    expect(exportedNames.has("DashboardDataTable")).toBe(true);
    expect(exportedNames.has("DashboardNavTopbar")).toBe(true);
    expect(exportedNames.has("DataTable")).toBe(true);
    expect(exportedNames.has("NavTopbar")).toBe(true);
  });

  it("records SiteHeader export from site-header wrapper", () => {
    const siteHeaderSource = readFileSync(
      join(
        packageRoot,
        "components/blocks/afenda-blocks/shadcn-dashboard-01/site-header.tsx"
      ),
      "utf8"
    );

    expect(siteHeaderSource.includes("export function SiteHeader")).toBe(true);
  });
});

describe("internal implementation path scope", () => {
  it("excludes components/ui from governed layout surfaces", () => {
    expect(AFENDA_INTERNAL_IMPLEMENTATION_PATH_PREFIXES).toContain(
      "components/ui/"
    );
  });
});
