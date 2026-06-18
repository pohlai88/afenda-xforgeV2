import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  AdvancedDataTable,
  ApprovalControlCenter,
  ApprovalQueueBlock,
  AuditEvidenceWorkspace,
  AuthenticatedAppShellBlock,
  afendaBlockRecipe,
  afendaRecipe,
  BatchPostingReview,
  Box,
  Button,
  blockRecipe,
  CommandSearchBlock,
  cn,
  createMetadataDiagnosticsCollector,
  createMetadataDiagnosticsDispatcher,
  DesignSystemProvider,
  EmptyPanel,
  Field,
  FilterBar,
  Focusable,
  FormSection,
  Grid,
  Inline,
  Input,
  MetadataPageRenderer,
  MetricText,
  ModeToggle,
  metadataBlockSchema,
  metadataPageSchema,
  OperationalDashboardShell,
  PageHeader,
  PolicyLockManager,
  RecordEditorBlock,
  RiskEvidencePanel,
  recipe,
  resolveMetadataBinding,
  Select,
  Stack,
  StatsStrip,
  Table,
  TenantOperationsWorkspace,
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
  AdvancedDataTable,
  afendaBlockRecipe,
  afendaRecipe,
  ApprovalControlCenter,
  ApprovalQueueBlock,
  AuthenticatedAppShellBlock,
  AuditEvidenceWorkspace,
  BatchPostingReview,
  blockRecipe,
  Box,
  Button,
  cn,
  CommandSearchBlock,
  createMetadataDiagnosticsCollector,
  createMetadataDiagnosticsDispatcher,
  DesignSystemProvider,
  EmptyPanel,
  Field,
  FilterBar,
  Focusable,
  FormSection,
  Grid,
  Inline,
  Input,
  MetadataPageRenderer,
  metadataBlockSchema,
  metadataPageSchema,
  MetricText,
  ModeToggle,
  OperationalDashboardShell,
  PageHeader,
  PolicyLockManager,
  recipe,
  RecordEditorBlock,
  resolveMetadataBinding,
  RiskEvidencePanel,
  Select,
  Stack,
  StatsStrip,
  Table,
  TenantOperationsWorkspace,
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
  "PageHeader",
  "FilterBar",
  "StatsStrip",
  "EmptyPanel",
  "FormSection",
  "AdvancedDataTable",
  "CommandSearchBlock",
  "ApprovalQueueBlock",
  "AuthenticatedAppShellBlock",
  "RiskEvidencePanel",
  "RecordEditorBlock",
  "OperationalDashboardShell",
  "ApprovalControlCenter",
  "TenantOperationsWorkspace",
  "AuditEvidenceWorkspace",
  "PolicyLockManager",
  "BatchPostingReview",
  "MetadataPageRenderer",
  "metadataPageSchema",
  "metadataBlockSchema",
  "createMetadataDiagnosticsCollector",
  "createMetadataDiagnosticsDispatcher",
  "resolveMetadataBinding",
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
