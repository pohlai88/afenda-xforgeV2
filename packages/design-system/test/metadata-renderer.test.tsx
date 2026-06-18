import { describe, expect, it } from "vitest";
import {
  createMetadataBlockRenderContext,
  metadataBlockSchema,
  metadataBlockSchema as publicMetadataBlockSchema,
  metadataBlockSchemas as publicMetadataBlockSchemas,
  metadataPageSchema as publicMetadataPageSchema,
  resolveDefaultMetadataPermission,
  resolveMetadataBinding as publicResolveMetadataBinding,
  resolveMetadataBlockActions,
  resolveMetadataPermission,
  supportedBlockTypes,
} from "../components/blocks";
import {
  approvalControlCenterMetadata,
  auditEvidenceReviewMetadata,
  tenantConfigurationMetadata,
} from "./metadata-renderer-fixtures";
import type { MetadataBlock, MetadataPage } from "../components/blocks/metadata-schema";
import { metadataPageSchema } from "../components/blocks/metadata-schema";

describe("metadata renderer contract", () => {
  it("resolves raw object sources as ready data", () => {
    const result = publicResolveMetadataBinding(
      { path: "summary.total", source: "approvals" },
      {
        approvals: {
          summary: { total: 4 },
        },
      }
    );

    expect(result.status).toBe("ready");
    expect(result.value).toBe(4);
  });

  it("resolves fallback values for missing paths", () => {
    const result = publicResolveMetadataBinding(
      { fallback: 0, path: "summary.total", source: "approvals" },
      {
        approvals: {
          summary: {},
        },
      }
    );

    expect(result.status).toBe("ready");
    expect(result.value).toBe(0);
  });

  it("does not treat undefined fallback values as ready data", () => {
    const result = publicResolveMetadataBinding(
      { fallback: undefined, path: "summary.total", source: "approvals" },
      {
        approvals: {
          summary: {},
        },
      }
    );

    expect(result.status).toBe("missing-path");
  });

  it("resolves empty fallback values for empty source states", () => {
    const result = publicResolveMetadataBinding(
      { emptyFallback: [], path: "rows", source: "approvals" },
      {
        approvals: {
          state: "empty",
        },
      }
    );

    expect(result.status).toBe("ready");
    expect(result.value).toEqual([]);
  });

  it("reports missing required paths and sources", () => {
    const result = publicResolveMetadataBinding(
      { path: "summary.total", required: true, source: "approvals" },
      {}
    );

    expect(result.status).toBe("missing-source");
    expect(result.diagnostic?.status).toBe("missing-source");
  });

  it("reports expected type mismatches", () => {
    const result = publicResolveMetadataBinding(
      {
        expectedType: "number",
        path: "summary.total",
        source: "approvals",
      },
      {
        approvals: {
          summary: { total: "four" },
        },
      }
    );

    expect(result.status).toBe("invalid-type");
    expect(result.diagnostic?.status).toBe("invalid-type");
  });

  it("reports loading, error, forbidden, empty, and stale source states", () => {
    expect(
      publicResolveMetadataBinding({ path: "rows", source: "queue" }, {
        queue: { state: "loading" },
      }).status
    ).toBe("loading");
    expect(
      publicResolveMetadataBinding({ path: "rows", source: "queue" }, {
        queue: { error: { message: "Failed" }, state: "error" },
      }).status
    ).toBe("error");
    expect(
      publicResolveMetadataBinding({ path: "rows", source: "queue" }, {
        queue: { state: "forbidden" },
      }).status
    ).toBe("forbidden");
    expect(
      publicResolveMetadataBinding({ path: "rows", source: "queue" }, {
        queue: { state: "empty" },
      }).status
    ).toBe("empty");
    expect(
      publicResolveMetadataBinding({ path: "rows", source: "queue" }, {
        queue: { data: { rows: [] }, state: "stale" },
      }).status
    ).toBe("stale");
  });

  it("allows subjects with matching role, permission, and capability", () => {
    const decision = resolveDefaultMetadataPermission(
      {
        actionKey: "approve",
        blockId: "approval-header",
        blockType: "pageHeader",
        type: "action",
      },
      {
        capabilities: ["pageHeader:primary:approve"],
        permissions: ["blocks.pageHeader.primary.approve"],
        roles: ["operator"],
      }
    );

    expect(decision.status).toBe("allowed");
  });

  it("denies subjects for role, permission, and capability mismatches", () => {
    const decision = resolveDefaultMetadataPermission(
      {
        actionKey: "approve",
        blockId: "approval-header",
        blockType: "pageHeader",
        roles: ["admin"],
        type: "action",
      },
      {
        roles: ["operator"],
      }
    );

    expect(decision.status).toBe("denied");
  });

  it("uses custom resolver denial reasons", () => {
    const decision = resolveMetadataPermission(
      {
        actionKey: "approve",
        blockId: "approval-header",
        blockType: "pageHeader",
        type: "action",
      },
      {
        resolvePermission: () => ({
          code: "tenant-policy",
          reason: "Tenant policy blocks this approval.",
          status: "denied",
        }),
      }
    );

    expect(decision).toMatchObject({
      code: "tenant-policy",
      reason: "Tenant policy blocks this approval.",
      status: "denied",
    });
  });

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

  it("normalizes reversible critical bulk action confirmation", () => {
    const block = parseBlock({
      actions: [
        {
          critical: true,
          key: "archive",
          label: "Archive selected",
          variant: "critical",
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
    expect(actions?.[0]?.critical).toBe(true);
    expect(actions?.[0]?.disabled).toBe(false);
    expect(actions?.[0]?.reason).toBe(
      "Requires confirmation and audit logging."
    );
  });

  it("disables mutating actions for readonly permission context", () => {
    const block = parseBlock({
      actions: [
        {
          key: "edit-policy",
          label: "Edit policy",
        },
        {
          href: "/audit",
          key: "view-audit",
          label: "View audit",
        },
      ],
      blockId: "readonly-actions",
      title: "Readonly actions",
      type: "pageHeader",
    });
    const context = createMetadataBlockRenderContext(block, {
      capabilities: [
        "pageHeader:primary:edit-policy",
        "pageHeader:primary:view-audit",
      ],
      isReadonly: true,
      permissions: [
        "blocks.pageHeader.primary.edit-policy",
        "blocks.pageHeader.primary.view-audit",
      ],
    });
    const actions = resolveMetadataBlockActions(
      getBlockActions(block),
      context,
      "primary"
    );

    expect(actions?.[0]?.disabled).toBe(true);
    expect(actions?.[0]?.reason).toBe(
      "This block is read-only in the current context."
    );
    expect(actions?.[1]?.disabled).toBe(false);
  });

  it("keeps fixture metadata valid", () => {
    for (const fixture of stableMetadataFixtures) {
      expect(metadataPageSchema.safeParse(fixture).success).toBe(true);
      expect(fixture.version).toBe(1);
    }
  });

  it("keeps supported metadata block types aligned with schema exports", () => {
    expect(Object.keys(publicMetadataBlockSchemas).sort()).toEqual(
      [...supportedBlockTypes].sort()
    );
  });

  it("keeps metadata schema exports available", () => {
    expect(publicMetadataBlockSchema).toBeDefined();
    expect(publicMetadataPageSchema).toBeDefined();
    expect(publicResolveMetadataBinding).toBeDefined();
    expect(resolveDefaultMetadataPermission).toBeDefined();
  });
});

const stableMetadataFixtures = [
  approvalControlCenterMetadata,
  auditEvidenceReviewMetadata,
  tenantConfigurationMetadata,
] as const satisfies readonly MetadataPage[];

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
