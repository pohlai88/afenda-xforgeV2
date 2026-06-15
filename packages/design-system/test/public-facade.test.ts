import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import * as facade from "../design-system";

describe("public design-system facade", () => {
  it("keeps the documented stable runtime exports available", () => {
    for (const exportName of stableRuntimeExports) {
      expect(facade[exportName], exportName).toBeDefined();
    }
  });

  it("keeps the facade explicit instead of using wildcard re-exports", () => {
    const source = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "..", "design-system.ts"),
      "utf8"
    );

    expect(source).not.toMatch(/export\s+\*\s+from\s+["']/);
  });
});

const stableRuntimeExports = [
  "cn",
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
] as const satisfies readonly (keyof typeof facade)[];
