import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  afendaBlockRecipe,
  afendaRecipe,
  Box,
  Button,
  blockRecipe,
  cn,
  createMetadataDiagnosticsCollector,
  createMetadataDiagnosticsDispatcher,
  DashboardPage,
  DesignSystemProvider,
  Field,
  Focusable,
  Grid,
  Inline,
  Input,
  MetricText,
  ModeToggle,
  metadataBlockSchema,
  metadataPageSchema,
  recipe,
  resolveMetadataBinding,
  Select,
  Stack,
  supportedBlockTypes,
  Table,
  Text,
} from "..";

const wildcardExportPattern = /export\s+\*\s+from\s+["']/;

describe("public design-system facade", () => {
  it("keeps the documented stable runtime exports available", () => {
    for (const exportName of stableRuntimeExports) {
      expect(stableRuntimeExportValues[exportName], exportName).toBeDefined();
    }
  });

  it("keeps the facade explicit instead of using wildcard re-exports", () => {
    const source = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "..", "index.tsx"),
      "utf8"
    );

    expect(source).not.toMatch(wildcardExportPattern);
  });

  it("keeps implementation files from self-importing package public paths", () => {
    const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
    const implementationRoots = ["components", "hooks", "lib", "providers"];

    for (const filePath of implementationRoots.flatMap((directory) =>
      getSourceFiles(join(packageRoot, directory))
    )) {
      const source = readFileSync(filePath, "utf8");

      expect(source, filePath).not.toMatch(
        /from\s+["']@repo\/design-system(?:\/[^"']*)?["']/
      );
    }
  });
});

const stableRuntimeExportValues = {
  afendaBlockRecipe,
  afendaRecipe,
  blockRecipe,
  Box,
  Button,
  cn,
  createMetadataDiagnosticsCollector,
  createMetadataDiagnosticsDispatcher,
  DashboardPage,
  DesignSystemProvider,
  Field,
  Focusable,
  Grid,
  Inline,
  Input,
  metadataBlockSchema,
  metadataPageSchema,
  MetricText,
  ModeToggle,
  recipe,
  resolveMetadataBinding,
  Select,
  Stack,
  supportedBlockTypes,
  Table,
  Text,
} as const;

const stableRuntimeExports = [
  "cn",
  "DesignSystemProvider",
  "ModeToggle",
  "recipe",
  "afendaRecipe",
  "blockRecipe",
  "afendaBlockRecipe",
  "Button",
  "Field",
  "Input",
  "Select",
  "Table",
  "Box",
  "Stack",
  "Inline",
  "Grid",
  "Text",
  "MetricText",
  "Focusable",
  "DashboardPage",
  "metadataPageSchema",
  "metadataBlockSchema",
  "createMetadataDiagnosticsCollector",
  "createMetadataDiagnosticsDispatcher",
  "resolveMetadataBinding",
  "supportedBlockTypes",
] as const satisfies readonly (keyof typeof stableRuntimeExportValues)[];

function getSourceFiles(directory: string): readonly string[] {
  const entries = readdirSync(directory).flatMap((entry) => {
    const entryPath = join(directory, entry);
    const stats = statSync(entryPath);

    if (stats.isDirectory()) {
      return getSourceFiles(entryPath);
    }

    return /\.(?:ts|tsx)$/.test(entry) ? [entryPath] : [];
  });

  return entries.sort((a, b) => a.localeCompare(b));
}
