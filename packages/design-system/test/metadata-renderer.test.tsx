import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  AdvancedDataTable,
  ApprovalControlCenter,
  ApprovalQueueBlock,
  AuditEvidenceWorkspace,
  AuditSafeCriticalAction,
  AuditTrailPanel,
  BatchPostingReview,
  BulkActionBar,
  blockRegistryEntries,
  CommandSearchBlock,
  createMetadataDiagnosticsCollector,
  createMetadataDiagnosticsDispatcher,
  DataTableShell,
  EmptyPanel,
  FilterBar,
  FormSection,
  MetadataPageRenderer,
  OperationalDashboardShell,
  PageHeader,
  PermissionActionToolbar,
  PolicyLockManager,
  metadataBlockSchema as publicMetadataBlockSchema,
  metadataBlockSchemas as publicMetadataBlockSchemas,
  metadataPageSchema as publicMetadataPageSchema,
  resolveMetadataBinding as publicResolveMetadataBinding,
  QualityGatesBlock,
  RecordEditorBlock,
  RiskEvidencePanel,
  RuntimeStateBlock,
  SaveStateStrip,
  StatsStrip,
  supportedBlockTypes,
  TenantOperationsWorkspace,
} from "../components/blocks";
import {
  approvalControlCenterDataSources,
  approvalControlCenterMetadata,
  auditEvidenceReviewDataSources,
  auditEvidenceReviewMetadata,
  tenantConfigurationDataSources,
  tenantConfigurationMetadata,
} from "./metadata-renderer-fixtures";
import {
  createMetadataBlockRenderContext,
  resolveDefaultMetadataPermission,
  resolveMetadataBlockActions,
  resolveMetadataPermission,
} from "../components/blocks/metadata-renderer-core";
import {
  type MetadataBlock,
  type MetadataPage,
  metadataBlockSchema,
  metadataPageSchema,
} from "../components/blocks/metadata-schema";

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
      { emptyFallback: 0, path: "summary.total", source: "approvals" },
      {
        approvals: {
          state: "empty",
        },
      }
    );

    expect(result.status).toBe("ready");
    expect(result.value).toBe(0);
  });

  it("reports missing required paths and sources", () => {
    const missingPath = publicResolveMetadataBinding(
      { path: "summary.total", required: true, source: "approvals" },
      {
        approvals: {
          summary: {},
        },
      }
    );
    const missingSource = publicResolveMetadataBinding(
      { path: "rows", required: true, source: "approvals" },
      {}
    );

    expect(missingPath.status).toBe("missing-path");
    expect(missingPath.diagnostic?.message).toBe(
      'Data binding "approvals:summary.total" did not resolve.'
    );
    expect(missingSource.status).toBe("missing-source");
    expect(missingSource.diagnostic?.message).toBe(
      'Data source "approvals" is missing.'
    );
  });

  it("reports expected type mismatches", () => {
    const result = publicResolveMetadataBinding(
      { expectedType: "array", path: "rows", source: "approvals" },
      {
        approvals: {
          rows: "not rows",
        },
      }
    );

    expect(result.status).toBe("invalid-type");
    expect(result.diagnostic?.message).toBe(
      'Data binding "approvals:rows" did not match expected type "array".'
    );
  });

  it("reports loading, error, forbidden, empty, and stale source states", () => {
    expect(
      publicResolveMetadataBinding(
        { path: "rows", source: "loading" },
        { loading: { state: "loading" } }
      ).status
    ).toBe("loading");
    expect(
      publicResolveMetadataBinding(
        { path: "rows", source: "error" },
        {
          error: {
            error: { message: "Approval service failed." },
            state: "error",
          },
        }
      ).diagnostic?.message
    ).toBe("Approval service failed.");
    expect(
      publicResolveMetadataBinding(
        { path: "rows", source: "forbidden" },
        { forbidden: { state: "forbidden" } }
      ).status
    ).toBe("forbidden");
    expect(
      publicResolveMetadataBinding(
        { path: "rows", source: "empty" },
        { empty: { state: "empty" } }
      ).status
    ).toBe("empty");
    expect(
      publicResolveMetadataBinding(
        { path: "rows", source: "stale" },
        { stale: { data: { rows: [] }, state: "stale" } }
      ).status
    ).toBe("stale");
  });

  it("allows subjects with matching role, permission, and capability", () => {
    const decision = resolveDefaultMetadataPermission(
      {
        blockId: "approval-header",
        blockType: "pageHeader",
        capability: "approval:approve",
        permission: "approval.approve",
        roles: ["approver"],
        type: "block",
      },
      {
        capabilities: ["approval:approve"],
        permissions: ["approval.approve"],
        roles: ["approver"],
      }
    );

    expect(decision.status).toBe("allowed");
  });

  it("denies subjects for role, permission, and capability mismatches", () => {
    expect(
      resolveDefaultMetadataPermission(
        {
          blockId: "approval-header",
          blockType: "pageHeader",
          roles: ["approver"],
          type: "block",
        },
        { roles: ["viewer"] }
      )
    ).toMatchObject({ code: "role-mismatch", status: "denied" });
    expect(
      resolveDefaultMetadataPermission(
        {
          blockId: "approval-header",
          blockType: "pageHeader",
          permission: "approval.approve",
          type: "block",
        },
        { permissions: ["approval.read"] }
      )
    ).toMatchObject({ code: "permission-mismatch", status: "denied" });
    expect(
      resolveDefaultMetadataPermission(
        {
          blockId: "approval-header",
          blockType: "pageHeader",
          capability: "approval:approve",
          type: "block",
        },
        { capabilities: ["approval:read"] }
      )
    ).toMatchObject({ code: "capability-mismatch", status: "denied" });
  });

  it("uses custom resolver denial reasons", () => {
    const decision = resolveMetadataPermission(
      {
        blockId: "approval-header",
        blockType: "pageHeader",
        permission: "approval.approve",
        type: "block",
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

  it("renders every stable metadata fixture without falling back to invalid metadata", () => {
    for (const fixture of stableMetadataFixtures) {
      const markup = renderToStaticMarkup(
        <MetadataPageRenderer page={fixture} />
      );

      expect(markup).toContain('data-slot="metadata-page-renderer-block"');
      expect(markup).toContain(`data-page-id="${fixture.pageId}"`);
      expect(markup).not.toContain("Invalid page metadata");
    }
  });

  it("keeps documented stable block API exports available", () => {
    for (const [exportName, exportValue] of documentedStableValueExports) {
      expect(exportValue, exportName).toBeDefined();
    }
  });

  it("keeps supported metadata block types aligned across schema and registry", () => {
    expect(blockRegistryEntries.map((entry) => entry.type)).toEqual([
      ...supportedBlockTypes,
    ]);
    expect(Object.keys(publicMetadataBlockSchemas).sort()).toEqual(
      [...supportedBlockTypes].sort()
    );

    for (const entry of blockRegistryEntries) {
      expect(entry.importName, entry.type).toBeTruthy();
      expect(entry.dataSlot, entry.type).toMatch(blockDataSlotPattern);
      expect(entry.description, entry.type).toBeTruthy();
    }
  });

  it("keeps stable metadata fixtures renderable with diagnostics and data sources", () => {
    for (const fixture of stableMetadataFixtureCases) {
      const diagnostics = createMetadataDiagnosticsCollector();
      const markup = renderToStaticMarkup(
        <MetadataPageRenderer
          dataSources={fixture.dataSources}
          diagnostics={diagnostics}
          page={fixture.page}
        />
      );

      expect(markup).toContain('data-slot="metadata-page-renderer-block"');
      expect(markup).toContain(`data-page-id="${fixture.page.pageId}"`);
      expect(markup).not.toContain("Invalid page metadata");
      expect(diagnostics.report.diagnostics).not.toContainEqual(
        expect.objectContaining({ code: "page.invalid" })
      );
      expect(diagnostics.report.telemetry).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: "metadata.block.rendered" }),
        ])
      );
    }
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

  it("renders metadata page layouts with regions, columns, groups, and tabs", () => {
    const markup = renderToStaticMarkup(
      <MetadataPageRenderer
        dataSources={{
          approvals: {
            showRisk: true,
          },
        }}
        page={{
          blocks: [
            {
              blockId: "layout-header",
              title: "Approval control center",
              type: "pageHeader",
            },
            {
              blockId: "layout-stats",
              metrics: [
                {
                  id: "pending",
                  label: "Pending",
                  value: "14",
                },
              ],
              type: "statsStrip",
            },
            {
              blockId: "layout-risk",
              description: "SLA breach controls are active.",
              title: "Risk escalation",
              type: "emptyPanel",
            },
            {
              blockId: "layout-audit",
              description: "Evidence is ready for review.",
              title: "Audit evidence",
              type: "emptyPanel",
            },
          ],
          layout: {
            density: "compact",
            regions: [
              {
                children: [
                  {
                    blockId: "layout-header",
                    layoutId: "header-item",
                    type: "block",
                  },
                  {
                    columns: [
                      {
                        children: [
                          {
                            blockId: "layout-stats",
                            layoutId: "stats-item",
                            type: "block",
                          },
                          {
                            blockId: "layout-risk",
                            layoutId: "risk-item",
                            type: "block",
                            visibility: {
                              binding: {
                                path: "showRisk",
                                source: "approvals",
                              },
                              equals: true,
                            },
                          },
                        ],
                        columnId: "main",
                      },
                      {
                        children: [
                          {
                            layoutId: "audit-tabs",
                            tabs: [
                              {
                                children: [
                                  {
                                    blockId: "layout-audit",
                                    dependencies: [
                                      {
                                        blockId: "layout-stats",
                                        mode: "visible",
                                      },
                                    ],
                                    layoutId: "audit-item",
                                    type: "block",
                                  },
                                ],
                                label: "Evidence",
                                tabId: "evidence",
                              },
                            ],
                            type: "tabs",
                          },
                        ],
                        columnId: "side",
                      },
                    ],
                    layoutId: "operations-columns",
                    responsive: [
                      {
                        breakpoint: "base",
                        columns: 1,
                        stack: true,
                      },
                      {
                        breakpoint: "lg",
                        columns: 2,
                      },
                    ],
                    type: "columns",
                  },
                ],
                label: "Operations workspace",
                regionId: "workspace",
              },
            ],
            type: "regions",
          },
          pageId: "layout-render",
          version: 1,
        }}
      />
    );

    expect(markup).toContain('data-slot="metadata-page-layout-block"');
    expect(markup).toContain('data-region-id="workspace"');
    expect(markup).toContain('data-slot="metadata-layout-columns"');
    expect(markup).toContain('data-slot="metadata-layout-tabs"');
    expect(markup).toContain("Risk escalation");
    expect(markup).toContain("Audit evidence");
    expect(markup).toContain(
      'data-layout-responsive="base:columns:1:stack lg:columns:2"'
    );
  });

  it("applies layout visibility and dependency rules", () => {
    const markup = renderToStaticMarkup(
      <MetadataPageRenderer
        dataSources={{
          approvals: {
            showRisk: false,
          },
        }}
        page={{
          blocks: [
            {
              blockId: "visible-header",
              title: "Visible header",
              type: "pageHeader",
            },
            {
              blockId: "hidden-risk",
              title: "Hidden risk",
              type: "emptyPanel",
            },
            {
              blockId: "dependent-audit",
              title: "Dependent audit",
              type: "emptyPanel",
            },
          ],
          layout: {
            regions: [
              {
                children: [
                  {
                    blockId: "visible-header",
                    layoutId: "visible-header-item",
                    type: "block",
                  },
                  {
                    blockId: "hidden-risk",
                    layoutId: "hidden-risk-item",
                    type: "block",
                    visibility: {
                      binding: {
                        path: "showRisk",
                        source: "approvals",
                      },
                      equals: true,
                    },
                  },
                  {
                    blockId: "dependent-audit",
                    dependencies: [
                      {
                        blockId: "hidden-risk",
                        mode: "visible",
                      },
                    ],
                    layoutId: "dependent-audit-item",
                    type: "block",
                  },
                ],
                regionId: "workspace",
              },
            ],
            type: "regions",
          },
          pageId: "layout-visibility",
          version: 1,
        }}
      />
    );

    expect(markup).toContain("Visible header");
    expect(markup).not.toContain("Hidden risk");
    expect(markup).not.toContain("Dependent audit");
  });

  it("does not satisfy visible layout dependencies with hidden governed blocks", () => {
    const markup = renderToStaticMarkup(
      <MetadataPageRenderer
        page={{
          blocks: [
            {
              blockId: "governed-source",
              permission: "layout.hidden",
              title: "Hidden governed source",
              type: "pageHeader",
            },
            {
              blockId: "dependent-panel",
              title: "Dependent panel",
              type: "emptyPanel",
            },
          ],
          layout: {
            regions: [
              {
                children: [
                  {
                    blockId: "governed-source",
                    layoutId: "governed-source-item",
                    type: "block",
                  },
                  {
                    blockId: "dependent-panel",
                    dependencies: [
                      {
                        blockId: "governed-source",
                        mode: "visible",
                      },
                    ],
                    layoutId: "dependent-panel-item",
                    type: "block",
                  },
                ],
                regionId: "workspace",
              },
            ],
            type: "regions",
          },
          pageId: "hidden-governance-layout",
          version: 1,
        }}
        permissionContext={{
          resolvePermission: (subject) =>
            subject.blockId === "governed-source"
              ? {
                  code: "hidden-by-policy",
                  reason: "The source block is hidden by policy.",
                  status: "hidden",
                }
              : { status: "allowed" },
        }}
      />
    );

    expect(markup).not.toContain("Hidden governed source");
    expect(markup).not.toContain("Dependent panel");
  });

  it("rejects invalid metadata layout references", () => {
    const result = metadataPageSchema.safeParse({
      blocks: [
        {
          blockId: "known-header",
          title: "Known header",
          type: "pageHeader",
        },
      ],
      layout: {
        regions: [
          {
            children: [
              {
                blockId: "known-header",
                layoutId: "known-item",
                type: "block",
              },
              {
                blockId: "missing-block",
                layoutId: "missing-item",
                type: "block",
              },
            ],
            regionId: "workspace",
          },
        ],
        type: "regions",
      },
      pageId: "invalid-layout",
      version: 1,
    });

    expect(result.success).toBe(false);
    expect(getIssueMessages(result)).toContain(
      'Layout references unknown blockId "missing-block"'
    );
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
    expect(markup).toContain("Data source &quot;workspace&quot; is missing.");
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

  it("renders denied blocks as forbidden runtime states with governance metadata", () => {
    const markup = renderToStaticMarkup(
      <MetadataPageRenderer
        page={{
          blocks: [
            {
              blockId: "restricted-header",
              capability: "approval:admin",
              permission: "approval.admin",
              roles: ["admin"],
              title: "Restricted approvals",
              type: "pageHeader",
            },
          ],
          pageId: "restricted-page",
          version: 1,
        }}
        permissionContext={{
          capabilities: ["approval:read"],
          permissions: ["approval.read"],
          roles: ["viewer"],
        }}
      />
    );

    expect(markup).toContain("Access restricted");
    expect(markup).toContain('data-governance-status="denied"');
    expect(markup).toContain('data-governance-code="role-mismatch"');
    expect(markup).toContain('data-permission="approval.admin"');
    expect(markup).toContain('data-capability="approval:admin"');
    expect(markup).toContain('data-required-roles="admin"');
  });

  it("renders denied actions as visible disabled actions with audit metadata", () => {
    const markup = renderToStaticMarkup(
      <MetadataPageRenderer
        page={{
          blocks: [
            {
              actions: [
                {
                  auditEvent: "approval.approve.requested",
                  auditScope: "tenant:northwind",
                  capability: "approval:approve",
                  key: "approve",
                  label: "Approve",
                  permission: "approval.approve",
                  roles: ["approver"],
                },
              ],
              blockId: "approval-header",
              title: "Approval workspace",
              type: "pageHeader",
            },
          ],
          pageId: "denied-action-page",
          version: 1,
        }}
        permissionContext={{
          capabilities: ["approval:read"],
          permissions: ["approval.read"],
          roles: ["viewer"],
        }}
      />
    );

    expect(markup).toContain("Approve");
    expect(markup).toContain("disabled");
    expect(markup).toContain('data-governance-status="denied"');
    expect(markup).toContain('data-governance-code="role-mismatch"');
    expect(markup).toContain('data-audit-event="approval.approve.requested"');
    expect(markup).toContain('data-audit-scope="tenant:northwind"');
    expect(markup).toContain('data-reason="Requires approver role."');
    expect(markup).toContain(
      'aria-describedby="tenant-northwind-approve-action-reason"'
    );
    expect(markup).toContain('id="tenant-northwind-approve-action-reason"');
  });

  it("renders allowed actions as enabled with audit metadata", () => {
    const markup = renderToStaticMarkup(
      <MetadataPageRenderer
        page={{
          blocks: [
            {
              actions: [
                {
                  auditEvent: "approval.approve.requested",
                  auditScope: "tenant:northwind",
                  capability: "approval:approve",
                  key: "approve",
                  label: "Approve",
                  permission: "approval.approve",
                  roles: ["approver"],
                },
              ],
              blockId: "approval-header",
              title: "Approval workspace",
              type: "pageHeader",
            },
          ],
          pageId: "allowed-action-page",
          version: 1,
        }}
        permissionContext={{
          capabilities: ["approval:approve"],
          permissions: ["approval.approve"],
          roles: ["approver"],
        }}
      />
    );

    expect(markup).not.toContain("<button disabled");
    expect(markup).toContain('data-governance-status="allowed"');
    expect(markup).toContain('data-audit-event="approval.approve.requested"');
    expect(markup).toContain('data-audit-scope="tenant:northwind"');
    expect(markup).not.toContain("Available for the current metadata scope.");
  });

  it("renders readonly actions with readonly denial reasons", () => {
    const markup = renderToStaticMarkup(
      <MetadataPageRenderer
        page={{
          blocks: [
            {
              actions: [
                {
                  key: "edit-policy",
                  label: "Edit policy",
                },
              ],
              blockId: "readonly-render-header",
              title: "Readonly policy",
              type: "pageHeader",
            },
          ],
          pageId: "readonly-render-page",
          version: 1,
        }}
        permissionContext={{
          capabilities: ["pageHeader:primary:edit-policy"],
          isReadonly: true,
          permissions: ["blocks.pageHeader.primary.edit-policy"],
        }}
      />
    );

    expect(markup).toContain("disabled");
    expect(markup).toContain(
      'data-reason="This block is read-only in the current context."'
    );
  });

  it("renders metadata-bound action labels, hrefs, disabled state, and reasons", () => {
    const markup = renderToStaticMarkup(
      <MetadataPageRenderer
        dataSources={{
          actions: {
            disabled: true,
            href: "/approvals/retry",
            label: "Retry sync",
            reason: "Sync is locked by policy.",
          },
        }}
        page={{
          blocks: [
            {
              actions: [
                {
                  href: {
                    path: "href",
                    source: "actions",
                  },
                  key: "retry-sync",
                  label: {
                    path: "label",
                    source: "actions",
                  },
                  variant: "secondary",
                },
                {
                  disabled: {
                    path: "disabled",
                    source: "actions",
                  },
                  key: "locked-sync",
                  label: "Locked sync",
                  reason: {
                    path: "reason",
                    source: "actions",
                  },
                },
              ],
              blockId: "bound-action-header",
              title: "Bound actions",
              type: "pageHeader",
            },
          ],
          pageId: "bound-actions-render",
          version: 1,
        }}
      />
    );

    expect(markup).toContain('href="/approvals/retry"');
    expect(markup).toContain("Retry sync");
    expect(markup).toContain("Locked sync");
    expect(markup).toContain("disabled");
    expect(markup).toContain('data-reason="Sync is locked by policy."');
  });

  it("renders source-state diagnostics for loading, error, and forbidden sources", () => {
    const page = {
      blocks: [
        {
          blockId: "state-table",
          columns: [{ header: "Approval ID", id: "approvalId" }],
          data: {
            expectedType: "array",
            path: "rows",
            required: true,
            source: "approvals",
          },
          title: "State table",
          type: "dataTable",
        },
      ],
      pageId: "source-state-page",
      version: 1,
    };

    expect(
      renderToStaticMarkup(
        <MetadataPageRenderer
          dataSources={{ approvals: { state: "loading" } }}
          page={page}
        />
      )
    ).toContain("Loading source data");
    expect(
      renderToStaticMarkup(
        <MetadataPageRenderer
          dataSources={{
            approvals: {
              error: { message: "Approval service failed." },
              state: "error",
            },
          }}
          page={page}
        />
      )
    ).toContain("Approval service failed.");
    expect(
      renderToStaticMarkup(
        <MetadataPageRenderer
          dataSources={{ approvals: { state: "forbidden" } }}
          page={page}
        />
      )
    ).toContain("Source access restricted");
  });

  it("preserves stale source data with diagnostic attributes", () => {
    const markup = renderToStaticMarkup(
      <MetadataPageRenderer
        dataSources={{
          approvals: {
            data: {
              rows: [{ approvalId: "AP-STALE" }],
            },
            diagnostics: {
              message: "Approval data is older than SLA.",
            },
            state: "stale",
          },
        }}
        page={{
          blocks: [
            {
              blockId: "stale-table",
              columns: [{ header: "Approval ID", id: "approvalId" }],
              data: {
                expectedType: "array",
                path: "rows",
                source: "approvals",
              },
              title: "Stale table",
              type: "dataTable",
            },
          ],
          pageId: "stale-source-page",
          version: 1,
        }}
      />
    );

    expect(markup).toContain("AP-STALE");
    expect(markup).toContain('data-binding-status="stale"');
    expect(markup).toContain("Approval data is older than SLA.");
  });

  it("emits render diagnostics, telemetry, and normalized action audit payloads", () => {
    const diagnostics = createMetadataDiagnosticsCollector();

    renderToStaticMarkup(
      <MetadataPageRenderer
        diagnostics={diagnostics}
        page={{
          blocks: [
            {
              actions: [
                {
                  key: "approve",
                  label: "Approve",
                  variant: "primary",
                },
              ],
              blockId: "audited-header",
              title: "Audited workspace",
              type: "pageHeader",
            },
          ],
          pageId: "diagnostic-action-page",
          version: 1,
        }}
      />
    );

    expect(diagnostics.report.diagnostics).toContainEqual(
      expect.objectContaining({
        blockId: "audited-header",
        code: "block.rendered",
        pageId: "diagnostic-action-page",
      })
    );
    expect(diagnostics.report.diagnostics).toContainEqual(
      expect.objectContaining({
        code: "config.missing",
        details: expect.objectContaining({
          actionKey: "approve",
          field: "auditEvent",
        }),
      })
    );
    expect(diagnostics.report.telemetry).toContainEqual(
      expect.objectContaining({
        blockId: "audited-header",
        name: "metadata.action.normalized",
      })
    );
    expect(diagnostics.report.audit).toContainEqual(
      expect.objectContaining({
        actionKey: "approve",
        auditEvent: "pageHeader.primary.approve",
        auditScope: "audited-header",
        capability: "pageHeader:primary:approve",
        event: "metadata.action.normalized",
        permission: "blocks.pageHeader.primary.approve",
      })
    );
  });

  it("emits state audit payloads for orchestrated blocks", () => {
    const diagnostics = createMetadataDiagnosticsCollector();

    renderToStaticMarkup(
      <MetadataPageRenderer
        diagnostics={diagnostics}
        page={{
          blocks: [
            {
              blockId: "offline-header",
              orchestration: { isOffline: true },
              title: "Offline workspace",
              type: "pageHeader",
            },
          ],
          pageId: "diagnostic-state-page",
          version: 1,
        }}
      />
    );

    expect(diagnostics.report.audit).toContainEqual(
      expect.objectContaining({
        blockId: "offline-header",
        event: "metadata.state.changed",
        pageId: "diagnostic-state-page",
        state: "readonly",
        tone: "warning",
      })
    );
    expect(diagnostics.report.telemetry).toContainEqual(
      expect.objectContaining({
        blockId: "offline-header",
        name: "metadata.state.changed",
      })
    );
  });

  it("emits binding diagnostics and renders the debug panel in debug mode", () => {
    const diagnostics = createMetadataDiagnosticsCollector();
    const markup = renderToStaticMarkup(
      <MetadataPageRenderer
        dataSources={{}}
        debug
        diagnostics={diagnostics}
        page={{
          blocks: [
            {
              blockId: "required-table",
              columns: [{ header: "Approval ID", id: "approvalId" }],
              data: {
                path: "rows",
                required: true,
                source: "approvals",
              },
              title: "Required table",
              type: "dataTable",
            },
          ],
          pageId: "diagnostic-binding-page",
          version: 1,
        }}
      />
    );

    expect(diagnostics.report.diagnostics).toContainEqual(
      expect.objectContaining({
        blockId: "required-table",
        code: "binding.missing",
        message: 'Data source "approvals" is missing.',
        pageId: "diagnostic-binding-page",
      })
    );
    expect(markup).toContain('data-slot="metadata-debug-panel-block"');
    expect(markup).toContain('data-diagnostic-count="1"');
    expect(markup).toContain("binding.missing");
  });
});

const stableMetadataFixtures = [
  approvalControlCenterMetadata,
  auditEvidenceReviewMetadata,
  tenantConfigurationMetadata,
] as const satisfies readonly MetadataPage[];

const blockDataSlotPattern = /-block$/;

const stableMetadataFixtureCases = [
  {
    dataSources: approvalControlCenterDataSources,
    page: approvalControlCenterMetadata,
  },
  {
    dataSources: auditEvidenceReviewDataSources,
    page: auditEvidenceReviewMetadata,
  },
  {
    dataSources: tenantConfigurationDataSources,
    page: tenantConfigurationMetadata,
  },
] as const;

const documentedStableValueExports = [
  ["AdvancedDataTable", AdvancedDataTable],
  ["ApprovalControlCenter", ApprovalControlCenter],
  ["ApprovalQueueBlock", ApprovalQueueBlock],
  ["AuditEvidenceWorkspace", AuditEvidenceWorkspace],
  ["AuditSafeCriticalAction", AuditSafeCriticalAction],
  ["AuditTrailPanel", AuditTrailPanel],
  ["BatchPostingReview", BatchPostingReview],
  ["blockRegistryEntries", blockRegistryEntries],
  ["BulkActionBar", BulkActionBar],
  ["CommandSearchBlock", CommandSearchBlock],
  ["DataTableShell", DataTableShell],
  ["EmptyPanel", EmptyPanel],
  ["FilterBar", FilterBar],
  ["FormSection", FormSection],
  ["MetadataPageRenderer", MetadataPageRenderer],
  ["OperationalDashboardShell", OperationalDashboardShell],
  ["PageHeader", PageHeader],
  ["PermissionActionToolbar", PermissionActionToolbar],
  ["PolicyLockManager", PolicyLockManager],
  ["QualityGatesBlock", QualityGatesBlock],
  ["RecordEditorBlock", RecordEditorBlock],
  ["RiskEvidencePanel", RiskEvidencePanel],
  ["RuntimeStateBlock", RuntimeStateBlock],
  ["SaveStateStrip", SaveStateStrip],
  ["StatsStrip", StatsStrip],
  ["TenantOperationsWorkspace", TenantOperationsWorkspace],
  ["createMetadataDiagnosticsCollector", createMetadataDiagnosticsCollector],
  ["createMetadataDiagnosticsDispatcher", createMetadataDiagnosticsDispatcher],
  ["metadataBlockSchema", publicMetadataBlockSchema],
  ["metadataBlockSchemas", publicMetadataBlockSchemas],
  ["metadataPageSchema", publicMetadataPageSchema],
  ["resolveMetadataBinding", publicResolveMetadataBinding],
  ["supportedBlockTypes", supportedBlockTypes],
] as const satisfies readonly (readonly [string, unknown])[];

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

function getIssueMessages(
  result: ReturnType<typeof metadataPageSchema.safeParse>
) {
  if (result.success) {
    return [];
  }

  return result.error.issues.map((issue) => issue.message);
}
