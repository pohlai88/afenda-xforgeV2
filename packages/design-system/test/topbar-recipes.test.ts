import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { topbarBrandDiskClass } from "../components/blocks/afenda-blocks/shadcn-dashboard-01/topbar/topbar-recipes";

const topbarsRoot = join(
  fileURLToPath(new URL(".", import.meta.url)),
  "..",
  "components",
  "blocks",
  "afenda-blocks",
  "shadcn-dashboard-01",
  "topbar"
);

const forbiddenSelfPackageImports = [/from\s+["']@repo\/design-system(?:\/[^"']*)?["']/];

describe("topbar block recipes", () => {
  it("exposes brand disk styling", () => {
    expect(topbarBrandDiskClass).toContain("rounded-full");
  });

  it("does not self-import the public package from topbar components", () => {
    const violations: string[] = [];

    for (const file of walk(topbarsRoot)) {
      if (!/\.tsx$/.test(file) || file.endsWith("topbar-recipes.ts")) {
        continue;
      }

      const source = readFileSync(file, "utf8");
      for (const pattern of forbiddenSelfPackageImports) {
        if (pattern.test(source)) {
          violations.push(`${file}: ${pattern}`);
        }
      }
    }

    expect(violations).toEqual([]);
  });
});

function walk(path: string): string[] {
  const entries = readdirSync(path);
  const files: string[] = [];

  for (const entry of entries) {
    const child = join(path, entry);
    const stat = statSync(child);

    if (stat.isDirectory()) {
      files.push(...walk(child));
      continue;
    }

    files.push(child);
  }

  return files;
}
