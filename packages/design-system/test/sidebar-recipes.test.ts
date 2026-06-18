import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  operatorAppSidebarShellClass,
  sidebarNavPanelNavClass,
  sidebarProfileInitials,
} from "../components/blocks/afenda-blocks/sidebars/sidebar-recipes";
import { blockRecipe } from "../components/blocks/block-recipes";

const sidebarsRoot = join(
  fileURLToPath(new URL(".", import.meta.url)),
  "..",
  "components",
  "blocks",
  "afenda-blocks",
  "sidebars"
);

const forbiddenSelfPackageImports = [/from\s+["']@repo\/design-system(?:\/[^"']*)?["']/];

describe("sidebar block recipes", () => {
  it("composes nav panel spacing from blockStack", () => {
    expect(sidebarNavPanelNavClass).toContain(blockRecipe("blockStack"));
  });

  it("composes operator shell from blockShell and icon rail contract", () => {
    expect(operatorAppSidebarShellClass).toContain(blockRecipe("blockShell"));
    expect(operatorAppSidebarShellClass).toContain("overscroll-y-contain");
  });

  it("derives profile initials consistently", () => {
    expect(sidebarProfileInitials("Jordan Lee")).toBe("JL");
    expect(sidebarProfileInitials("ops")).toBe("O");
  });

  it("does not self-import the public package from sidebar block components", () => {
    const violations: string[] = [];

    for (const file of walk(sidebarsRoot)) {
      if (!/\.tsx$/.test(file) || file.endsWith("sidebar-recipes.ts")) {
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
