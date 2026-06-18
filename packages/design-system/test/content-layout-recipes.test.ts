import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  contentLayoutBlockShellClass,
  contentLayoutSidebarClass,
} from "../components/blocks/afenda-blocks/content-layout/content-layout-recipes";
import { blockRecipe } from "../components/blocks/block-recipes";

const contentLayoutRoot = join(
  fileURLToPath(new URL(".", import.meta.url)),
  "..",
  "components",
  "blocks",
  "afenda-blocks",
  "content-layout"
);

const forbiddenSelfPackageImports = [/from\s+["']@repo\/design-system(?:\/[^"']*)?["']/];

describe("content layout block recipes", () => {
  it("composes shell from blockShell and blockPanel", () => {
    expect(contentLayoutBlockShellClass).toContain(blockRecipe("blockShell"));
    expect(contentLayoutBlockShellClass).toContain(blockRecipe("blockPanel"));
  });

  it("composes sidebar rail from blockRail", () => {
    expect(contentLayoutSidebarClass).toContain(blockRecipe("blockRail"));
  });

  it("does not self-import the public package from content-layout components", () => {
    const violations: string[] = [];

    for (const file of walk(contentLayoutRoot)) {
      if (!/\.tsx$/.test(file) || file.endsWith("content-layout-recipes.ts")) {
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
