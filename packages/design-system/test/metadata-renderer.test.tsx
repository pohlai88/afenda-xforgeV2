import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  approvalControlCenterMetadata,
  tenantConfigurationMetadata,
} from "../components/blocks/fixtures";
import { MetadataPageRenderer } from "../components/blocks/metadata-page-renderer";
import {
  createMetadataBlockRenderContext,
  resolveMetadataBlockActions,
} from "../components/blocks/metadata-renderer-core";
import {
  type MetadataBlock,
  metadataBlockSchema,
  metadataPageSchema,
} from "../components/blocks/schema";

describe("metadata renderer contract", () => {
  it("rejects unknown block types before renderer fallback", () => {
    const result = metadataPageSchema.safeParse({
      blocks: [
        {
          blockId: "unsupported-chart",
          title: "Unsupported chart",
          type: "chartPanel",
        },
      ],
      pageId: "unsupported-block-workspace",
      version: 1,
    });

    expect(result.success).toBe(false);
    expect(getIssuePaths(result)).toContain("blocks.0.type");
  });

  it("rejects blocks without blockId", () => {
    const result = metadataPageSchema.safeParse({
      blocks: [
        {
          title: "Missing identity",
          type: "pageHeader",
        },
      ],
      pageId: "missing-block-id",
      version: 1,
    });

    expect(result.success).toBe(false);
    expect(getIssuePaths(result)).toContain("blocks.0.blockId");
  });

  it("disables governed actions for forbidden orchestration", () => {
    const block = parseBlock({
      actions: [
        {
          key: "request-access",
          label: "Request access",
          variant: "secondary",
        },
      ],
      blockId: "forbidden-policy-header",
      orchestration: { isForbidden: true },
      title: "Approval policy",
      type: "pageHeader",
    });
    const context = createMetadataBlockRenderContext(block);
    const actions = resolveMetadataBlockActions(
      getBlockActions(block),
      context,
      "primary"
    );

    expect(actions?.[0]?.disabled).toBe(true);
    expect(actions?.[0]?.reason).toBe(
      "Current permissions do not allow this operation."
    );
    expect(actions?.[0]?.permission).toBe(
      "blocks.pageHeader.primary.request-access"
    );
  });

  it("resolves readonly state from metadata orchestration", () => {
    const block = tenantConfigurationMetadata.blocks[0];
    const context = createMetadataBlockRenderContext(block);

    expect(context.baseProps.state).toBe("readonly");
    expect(context.baseProps.tone).toBe("warning");
  });

  it("normalizes reversible destructive bulk action confirmation", () => {
    const block = parseBlock({
      actions: [
        {
          destructive: true,
          key: "archive",
          label: "Archive selected",
          variant: "destructive",
        },
      ],
      blockId: "bulk-action-confirmation",
      selectedCount: 3,
      type: "bulkActionBar",
    });
    const context = createMetadataBlockRenderContext(block);
    const actions = resolveMetadataBlockActions(
      getBlockActions(block),
      context,
      "primary"
    );

    expect(actions?.[0]?.confirmationLabel).toBe("Archive selected");
    expect(actions?.[0]?.destructive).toBe(true);
    expect(actions?.[0]?.disabled).toBe(false);
    expect(actions?.[0]?.reason).toBe(
      "Requires confirmation and audit logging."
    );
  });

  it("keeps fixture metadata valid", () => {
    expect(
      metadataPageSchema.safeParse(approvalControlCenterMetadata).success
    ).toBe(true);
    expect(
      metadataPageSchema.safeParse(tenantConfigurationMetadata).success
    ).toBe(true);
  });

  it("renders valid page metadata with expected block slots", () => {
    const markup = renderToStaticMarkup(
      <MetadataPageRenderer
        dataSources={{
          approvals: {
            rows: [{ approvalId: "AP-100", tenant: "Northwind" }],
          },
        }}
        page={{
          blocks: [
            {
              blockId: "approval-header",
              title: "Approval workspace",
              type: "pageHeader",
            },
            {
              blockId: "approval-table",
              columns: [
                {
                  header: "Approval ID",
                  id: "approvalId",
                  kind: "id",
                },
              ],
              data: {
                path: "rows",
                required: true,
                source: "approvals",
              },
              title: "Approval queue",
              type: "dataTable",
            },
          ],
          pageId: "valid-render",
          version: 1,
        }}
      />
    );

    expect(markup).toContain('data-slot="metadata-page-renderer-block"');
    expect(markup).toContain('data-slot="page-header-block"');
    expect(markup).toContain('data-slot="data-table-shell-block"');
    expect(markup).toContain("AP-100");
  });

  it("renders a diagnostic for invalid page metadata", () => {
    const markup = renderToStaticMarkup(
      <MetadataPageRenderer
        page={{
          blocks: [],
          pageId: "invalid-render",
          version: 1,
        }}
      />
    );

    expect(markup).toContain("Invalid page metadata");
    expect(markup).toContain('data-block-id="metadata-page"');
  });

  it("renders a diagnostic for missing required bindings", () => {
    const markup = renderToStaticMarkup(
      <MetadataPageRenderer
        dataSources={{}}
        page={{
          blocks: [
            {
              blockId: "required-title",
              title: {
                path: "header.title",
                required: true,
                source: "workspace",
              },
              type: "pageHeader",
            },
          ],
          pageId: "missing-required-binding",
          version: 1,
        }}
      />
    );

    expect(markup).toContain("Missing required binding");
    expect(markup).toContain(
      "Required binding &quot;workspace:header.title&quot; did not resolve."
    );
  });

  it("renders a diagnostic for non-array table bindings", () => {
    const markup = renderToStaticMarkup(
      <MetadataPageRenderer
        dataSources={{
          approvals: {
            rows: "not rows",
          },
        }}
        page={{
          blocks: [
            {
              blockId: "invalid-table",
              columns: [{ header: "Approval ID", id: "approvalId" }],
              data: {
                path: "rows",
                source: "approvals",
              },
              title: "Invalid table",
              type: "dataTable",
            },
          ],
          pageId: "invalid-table-binding",
          version: 1,
        }}
      />
    );

    expect(markup).toContain("Invalid table binding");
    expect(markup).toContain(
      "Data binding &quot;approvals:rows&quot; did not resolve to an array."
    );
  });

  it("renders forbidden orchestration as disabled governed actions", () => {
    const markup = renderToStaticMarkup(
      <MetadataPageRenderer
        page={{
          blocks: [
            {
              actions: [
                {
                  key: "sync",
                  label: "Sync now",
                },
              ],
              blockId: "forbidden-header",
              orchestration: { isForbidden: true },
              title: "Forbidden policy",
              type: "pageHeader",
            },
          ],
          pageId: "forbidden-render",
          version: 1,
        }}
      />
    );

    expect(markup).toContain("disabled");
    expect(markup).toContain(
      'data-reason="Current permissions do not allow this operation."'
    );
    expect(markup).toContain(
      'data-permission="blocks.pageHeader.primary.sync"'
    );
  });
});

function parseBlock(block: unknown): MetadataBlock {
  const result = metadataBlockSchema.safeParse(block);

  if (!result.success) {
    throw new Error(`Invalid block fixture: ${result.error.message}`);
  }

  return result.data;
}

function getBlockActions(block: MetadataBlock) {
  return "actions" in block ? block.actions : undefined;
}

function getIssuePaths(
  result: ReturnType<typeof metadataPageSchema.safeParse>
) {
  if (result.success) {
    return [];
  }

  return result.error.issues.map((issue) => issue.path.join("."));
}
