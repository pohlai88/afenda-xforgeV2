import type {
  MetadataDataSourceEnvelope,
  MetadataDataSources,
  MetadataPage,
  MetadataPermissionContext,
} from "@repo/design-system/design-system";
import { MetadataPageRenderer } from "@repo/design-system/design-system";
import type { Meta, StoryObj } from "@storybook/react";

import {
  layoutStoryParameters,
  mobileViewportParameters,
} from "../../.storybook/essentials";

const meta = {
  title: "Blocks/Metadata Renderer",
  component: MetadataPageRenderer,
  tags: ["autodocs", "block"],
  parameters: {
    ...layoutStoryParameters,
    layout: "centered",
    docs: {
      description: {
        component:
          "Safely renders registered Afenda blocks from versioned page metadata. Invalid block metadata renders a bounded diagnostic state instead of breaking the page.",
      },
    },
  },
} satisfies Meta<typeof MetadataPageRenderer>;

export default meta;

type Story = StoryObj<typeof meta>;

const metadataPage = {
  blocks: [
    {
      actions: [
        {
          actionId: "refresh",
          key: "refresh",
          label: "Refresh",
          variant: "secondary",
        },
        {
          auditEvent: "approval.export.requested",
          disabled: true,
          key: "export",
          label: "Export",
          reason: "Exports require evidence manager approval.",
          variant: "quiet",
        },
      ],
      blockId: "approval-header",
      description:
        "Tenant-scoped close controls rendered from metadata, not hard-coded JSX.",
      meta: [
        { id: "tenant", label: "Northwind Trading" },
        { id: "period", label: "June close" },
      ],
      status: { label: "Controlled", tone: "success" },
      title: "Approval metadata workspace",
      type: "pageHeader",
    },
    {
      blockId: "approval-metrics",
      columns: 3,
      metrics: [
        {
          description: "Weighted by SLA and policy state.",
          id: "risk",
          label: "Approval risk",
          tone: "warning",
          value: 72,
        },
        {
          description: "Validated records awaiting approval.",
          id: "ready",
          label: "Ready to post",
          tone: "success",
          value: 86,
        },
        {
          description: "Captured during this period.",
          id: "events",
          label: "Audit events",
          tone: "info",
          value: "1,284",
        },
      ],
      type: "statsStrip",
    },
    {
      activeFilters: [
        { id: "tenant", label: "Tenant: Northwind", tone: "info" },
        { id: "sla", label: "SLA < 4h", tone: "warning" },
      ],
      blockId: "approval-filters",
      resultCount: { fallback: 3, path: "summary.total", source: "approvals" },
      searchPlaceholder: "Search approvals...",
      type: "filterBar",
    },
    {
      blockId: "approval-selection",
      label: "2 approvals selected",
      selectedCount: 2,
      type: "bulkActionBar",
    },
    {
      blockId: "approval-table",
      bulkActions: [
        {
          destructive: true,
          key: "void",
          label: "Void selected",
          variant: "destructive",
        },
      ],
      columns: [
        { header: "Approval ID", id: "approvalId", kind: "id" },
        { header: "Tenant", id: "tenant" },
        { header: "Owner", id: "owner" },
        { align: "right", header: "Amount", id: "amount", kind: "money" },
        { header: "SLA", id: "sla" },
      ],
      data: { path: "rows", source: "approvals" },
      footer: {
        fallback: "3 approvals loaded",
        path: "summary.label",
        source: "approvals",
      },
      selectedCount: 2,
      title: "Approval queue",
      type: "dataTable",
    },
  ],
  pageId: "approval-metadata-workspace",
  version: 1,
} satisfies MetadataPage;

const composedMetadataPage = {
  blocks: [
    ...metadataPage.blocks,
    {
      blockId: "approval-risk-panel",
      description:
        "Risk escalation is shown only when the bound workspace source enables it.",
      intent: "risk",
      title: "SLA escalation",
      tone: "warning",
      type: "emptyPanel",
    },
    {
      blockId: "approval-audit-panel",
      description:
        "Evidence review depends on the approval queue being present in the composed layout.",
      intent: "audit",
      title: "Audit evidence review",
      type: "emptyPanel",
    },
  ],
  layout: {
    density: "compact",
    regions: [
      {
        children: [
          {
            blockId: "approval-header",
            layoutId: "approval-header-item",
            type: "block",
          },
          {
            blockId: "approval-metrics",
            layoutId: "approval-metrics-item",
            type: "block",
          },
          {
            columns: [
              {
                children: [
                  {
                    layoutId: "approval-work-queue",
                    title: "Approval work queue",
                    type: "group",
                    children: [
                      {
                        blockId: "approval-filters",
                        layoutId: "approval-filters-item",
                        type: "block",
                      },
                      {
                        blockId: "approval-selection",
                        layoutId: "approval-selection-item",
                        type: "block",
                      },
                      {
                        blockId: "approval-table",
                        layoutId: "approval-table-item",
                        type: "block",
                      },
                    ],
                  },
                ],
                columnId: "queue",
              },
              {
                children: [
                  {
                    layoutId: "approval-review-tabs",
                    tabs: [
                      {
                        children: [
                          {
                            blockId: "approval-risk-panel",
                            layoutId: "approval-risk-item",
                            type: "block",
                            visibility: {
                              binding: {
                                path: "summary.showRisk",
                                source: "approvals",
                              },
                              equals: true,
                            },
                          },
                        ],
                        label: "Risk",
                        tabId: "risk",
                      },
                      {
                        children: [
                          {
                            blockId: "approval-audit-panel",
                            dependencies: [
                              {
                                blockId: "approval-table",
                                mode: "visible",
                              },
                            ],
                            layoutId: "approval-audit-item",
                            type: "block",
                          },
                        ],
                        label: "Audit",
                        tabId: "audit",
                      },
                    ],
                    title: "Review panels",
                    type: "tabs",
                  },
                ],
                columnId: "review",
              },
            ],
            layoutId: "approval-page-columns",
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
        label: "Approval control center",
        regionId: "workspace",
      },
    ],
    type: "regions",
  },
  pageId: "approval-composed-layout-workspace",
  version: 1,
} satisfies MetadataPage;

const dataSources: MetadataDataSources = {
  approvals: {
    rows: [
      {
        amount: "86,420.00",
        approvalId: "AP-10482",
        owner: "Mina Shah",
        sla: "1h 12m",
        tenant: "Northwind Trading",
      },
      {
        amount: "14,310.50",
        approvalId: "AP-10479",
        owner: "Jon Bell",
        sla: "38m",
        tenant: "Aster Foods",
      },
      {
        amount: "122,900.00",
        approvalId: "AP-10471",
        owner: "Priya N.",
        sla: "Past due",
        tenant: "Mercury Parts",
      },
    ],
    summary: {
      label: "3 approvals loaded from metadata binding",
      showRisk: true,
      total: 3,
    },
  },
};

const orchestratedPage = {
  blocks: [
    {
      actions: [
        {
          actionId: "sync",
          auditEvent: "vendor.sync.requested",
          key: "sync",
          label: "Sync now",
          variant: "secondary",
        },
      ],
      blockId: "offline-policy-header",
      description:
        "Offline state is supplied by metadata orchestration and disables governed actions.",
      orchestration: { isOffline: true },
      title: "Vendor policy sync",
      type: "pageHeader",
    },
    {
      blockId: "sla-risk-metrics",
      columns: 3,
      intent: "risk",
      metrics: [
        {
          description:
            "SLA breach is critical but escalation actions remain available.",
          id: "breach",
          label: "Breached queues",
          tone: "critical",
          value: 4,
        },
        {
          description: "Operators with pending review assignments.",
          id: "owners",
          label: "Owners",
          value: 9,
        },
        {
          description: "Policy changes queued for evidence review.",
          id: "evidence",
          label: "Evidence gaps",
          tone: "warning",
          value: 12,
        },
      ],
      orchestration: { riskLevel: "breach" },
      type: "statsStrip",
    },
  ],
  pageId: "orchestrated-state-workspace",
  version: 1,
} satisfies MetadataPage;

const denseRows = Array.from({ length: 18 }, (_, index) => {
  const source =
    dataSources.approvals &&
    typeof dataSources.approvals === "object" &&
    "rows" in dataSources.approvals &&
    Array.isArray(dataSources.approvals.rows)
      ? dataSources.approvals.rows[index % dataSources.approvals.rows.length]
      : undefined;

  return {
    ...(typeof source === "object" && source ? source : {}),
    approvalId: `AP-${10_600 - index}`,
    tenant: `Tenant ${String(index + 1).padStart(2, "0")}`,
  };
});

const denseDataSources: MetadataDataSources = {
  approvals: {
    rows: denseRows,
    summary: {
      label: "18 approvals loaded from metadata binding",
      total: denseRows.length,
    },
  },
};

const denseMetadataPage = {
  blocks: [
    {
      blockId: "dense-approval-header",
      density: "compact",
      description:
        "Dense metadata path validates compact block spacing and high-row table rendering.",
      title: "Dense approval metadata",
      type: "pageHeader",
    },
    {
      blockId: "dense-approval-table",
      columns: [
        { header: "Approval ID", id: "approvalId", kind: "id" },
        { header: "Tenant", id: "tenant" },
        { header: "Owner", id: "owner" },
        { align: "right", header: "Amount", id: "amount", kind: "money" },
        { header: "SLA", id: "sla" },
      ],
      data: { path: "rows", source: "approvals" },
      density: "compact",
      footer: {
        fallback: "18 approvals loaded",
        path: "summary.label",
        source: "approvals",
      },
      title: "Dense approval queue",
      type: "dataTable",
    },
  ],
  pageId: "dense-metadata-workspace",
  version: 1,
} satisfies MetadataPage;

const forbiddenConfigPage = {
  blocks: [
    {
      actions: [
        {
          actionId: "requestAccess",
          key: "request-access",
          label: "Request access",
          permission: "approval.policy.requestAccess",
          variant: "secondary",
        },
      ],
      blockId: "forbidden-policy-header",
      description:
        "Forbidden orchestration should render a critical state and disable governed metadata actions.",
      orchestration: { isForbidden: true },
      title: "Approval policy",
      type: "pageHeader",
    },
    {
      actions: [
        {
          key: "retry",
          label: "Retry load",
          variant: "secondary",
        },
      ],
      blockId: "forbidden-runtime",
      description: "Policy configuration is hidden for this tenant role.",
      state: "forbidden",
      title: "Permission required",
      type: "runtimeState",
    },
  ],
  pageId: "forbidden-metadata-workspace",
  version: 1,
} satisfies MetadataPage;

const unsupportedBlockPage = {
  blocks: [
    {
      blockId: "unsupported-chart",
      title: "Unsupported chart",
      type: "chartPanel",
    },
  ],
  pageId: "unsupported-block-workspace",
  version: 1,
};

const malformedBlockPage = {
  blocks: [
    {
      blockId: "malformed-header",
      title: "",
      type: "pageHeader",
    },
  ],
  pageId: "malformed-block-workspace",
  version: 1,
};

const liveBindingPage = {
  blocks: [
    {
      blockId: "live-binding-header",
      description:
        "Source state is supplied by a loader and consumed by the renderer.",
      title: {
        fallback: "Live approval queue",
        path: "summary.title",
        source: "liveApprovals",
      },
      type: "pageHeader",
    },
    {
      blockId: "live-binding-stats",
      columns: 3,
      metrics: [
        {
          id: "total",
          label: "Loaded",
          value: {
            expectedType: "number",
            fallback: 0,
            path: "summary.total",
            source: "liveApprovals",
          },
        },
        {
          id: "selected",
          label: "Selected",
          value: {
            expectedType: "number",
            fallback: 0,
            path: "summary.selected",
            source: "liveApprovals",
          },
        },
        {
          id: "risk",
          label: "Risk",
          tone: "warning",
          value: {
            fallback: "Watch",
            path: "summary.risk",
            source: "liveApprovals",
          },
        },
      ],
      type: "statsStrip",
    },
    {
      blockId: "live-binding-filters",
      filtersBinding: {
        expectedType: "array",
        path: "filters.active",
        source: "liveApprovals",
      },
      resultCount: {
        expectedType: "number",
        fallback: 0,
        path: "summary.total",
        source: "liveApprovals",
      },
      searchValueBinding: {
        fallback: "",
        path: "filters.query",
        source: "liveApprovals",
      },
      type: "filterBar",
    },
    {
      actions: [
        {
          disabled: {
            expectedType: "boolean",
            path: "actions.post.disabled",
            source: "liveApprovals",
          },
          key: "post",
          label: {
            fallback: "Post ready",
            path: "actions.post.label",
            source: "liveApprovals",
          },
          reason: {
            fallback: "Available for this source state.",
            path: "actions.post.reason",
            source: "liveApprovals",
          },
          variant: "primary",
        },
      ],
      blockId: "live-binding-table",
      columns: [
        { header: "Approval ID", id: "approvalId", kind: "id" },
        { header: "Tenant", id: "tenant" },
        { align: "right", header: "Amount", id: "amount", kind: "money" },
      ],
      data: {
        emptyFallback: [],
        expectedType: "array",
        path: "rows",
        required: true,
        source: "liveApprovals",
      },
      footer: {
        fallback: "No loaded records",
        path: "summary.label",
        source: "liveApprovals",
      },
      selectedCount: {
        expectedType: "number",
        fallback: 0,
        path: "summary.selected",
        source: "liveApprovals",
      },
      title: "Live bound queue",
      type: "dataTable",
    },
  ],
  pageId: "live-binding-workspace",
  version: 1,
} satisfies MetadataPage;

const readyLiveSource = {
  data: {
    actions: {
      post: {
        disabled: false,
        label: "Post 2 ready",
        reason: "All selected approvals have complete evidence.",
      },
    },
    filters: {
      active: [{ id: "risk", label: "Risk: watch", tone: "warning" }],
      query: "AP-",
    },
    rows: [
      {
        amount: "86,420.00",
        approvalId: "AP-10482",
        tenant: "Northwind Trading",
      },
      {
        amount: "122,900.00",
        approvalId: "AP-10471",
        tenant: "Mercury Parts",
      },
    ],
    summary: {
      label: "2 live approvals loaded",
      risk: "Watch",
      selected: 2,
      title: "Live approval queue",
      total: 2,
    },
  },
  state: "ready",
} satisfies MetadataDataSourceEnvelope;

const sourceStateData = {
  empty: {
    data: {
      rows: [],
      summary: {
        label: "No approvals matched the current loader context",
        selected: 0,
        total: 0,
      },
    },
    state: "empty",
  },
  error: {
    error: { message: "Approval service did not return a valid response." },
    state: "error",
  },
  forbidden: {
    diagnostics: { message: "Current role cannot inspect approval data." },
    state: "forbidden",
  },
  loading: {
    state: "loading",
  },
  ready: readyLiveSource,
  stale: {
    ...readyLiveSource,
    diagnostics: { message: "Approval source is older than the SLA window." },
    staleAt: "2026-06-15T09:00:00Z",
    state: "stale",
  },
} satisfies Record<string, MetadataDataSourceEnvelope>;

const governancePage = {
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
          variant: "primary",
        },
        {
          href: "/audit/evidence",
          key: "view-audit",
          label: "View audit",
          variant: "secondary",
        },
      ],
      blockId: "governance-header",
      description:
        "Denied actions remain visible with reason, permission, capability, and audit metadata.",
      title: "Governed approval workspace",
      type: "pageHeader",
    },
    {
      blockId: "governance-restricted-panel",
      capability: "tenant:configuration",
      description: "Only tenant administrators can inspect this setup panel.",
      permission: "tenant.configuration.read",
      roles: ["tenant-admin"],
      title: "Tenant configuration",
      type: "emptyPanel",
    },
  ],
  pageId: "governance-runtime-page",
  version: 1,
} satisfies MetadataPage;

const governancePermissionContext = {
  capabilities: ["pageHeader:primary:view-audit"],
  permissions: ["blocks.pageHeader.primary.view-audit"],
  roles: ["viewer"],
} satisfies MetadataPermissionContext;

function liveBindingArgs(source: MetadataDataSourceEnvelope): Story["args"] {
  return {
    dataSources: {
      liveApprovals: source,
    },
    page: liveBindingPage,
  };
}

export const ApprovalWorkspace: Story = {
  args: {
    dataSources,
    page: metadataPage,
  },
  render: (args) => (
    <div className="w-[min(1120px,calc(100vw-2rem))]">
      <MetadataPageRenderer {...args} />
    </div>
  ),
};

export const OrchestratedStatePage: Story = {
  args: {
    page: orchestratedPage,
  },
  render: (args) => (
    <div className="w-[min(920px,calc(100vw-2rem))]">
      <MetadataPageRenderer {...args} />
    </div>
  ),
};

export const DenseDataConfig: Story = {
  args: {
    dataSources: denseDataSources,
    page: denseMetadataPage,
  },
  render: (args) => (
    <div className="w-[min(1180px,calc(100vw-2rem))]">
      <MetadataPageRenderer {...args} />
    </div>
  ),
};

export const ComposedErpPageLayout: Story = {
  args: {
    dataSources,
    page: composedMetadataPage,
  },
  render: (args) => (
    <div className="w-[min(1240px,calc(100vw-2rem))]">
      <MetadataPageRenderer {...args} />
    </div>
  ),
};

export const ForbiddenConfig: Story = {
  args: {
    page: forbiddenConfigPage,
  },
  render: (args) => (
    <div className="w-[min(920px,calc(100vw-2rem))]">
      <MetadataPageRenderer {...args} />
    </div>
  ),
};

export const MobileLayoutConfig: Story = {
  args: {
    dataSources,
    page: metadataPage,
  },
  parameters: {
    ...mobileViewportParameters,
  },
  render: (args) => (
    <div className="w-[calc(100vw-24px)]">
      <MetadataPageRenderer {...args} />
    </div>
  ),
};

export const MissingTableBinding: Story = {
  args: {
    dataSources: {},
    page: metadataPage,
  },
  render: (args) => (
    <div className="w-[min(920px,calc(100vw-2rem))]">
      <MetadataPageRenderer {...args} />
    </div>
  ),
};

export const UnsupportedBlockConfig: Story = {
  args: {
    page: unsupportedBlockPage,
  },
  render: (args) => (
    <div className="w-[min(740px,calc(100vw-2rem))]">
      <MetadataPageRenderer {...args} />
    </div>
  ),
};

export const MalformedBlockConfig: Story = {
  args: {
    page: malformedBlockPage,
  },
  render: (args) => (
    <div className="w-[min(740px,calc(100vw-2rem))]">
      <MetadataPageRenderer {...args} />
    </div>
  ),
};

export const InvalidPage: Story = {
  args: {
    page: {
      blocks: [],
      pageId: "invalid-empty",
      version: 1,
    },
  },
  render: (args) => (
    <div className="w-[min(740px,calc(100vw-2rem))]">
      <MetadataPageRenderer {...args} />
    </div>
  ),
};

export const PermissionGovernanceRuntime: Story = {
  args: {
    page: governancePage,
    permissionContext: governancePermissionContext,
  },
  render: (args) => (
    <div className="w-[min(920px,calc(100vw-2rem))]">
      <MetadataPageRenderer {...args} />
    </div>
  ),
};

export const MetadataDebugPanel: Story = {
  args: {
    dataSources: {},
    debug: true,
    page: metadataPage,
  },
  render: (args) => (
    <div className="w-[min(1120px,calc(100vw-2rem))]">
      <MetadataPageRenderer {...args} />
    </div>
  ),
};

export const LiveReadySource: Story = {
  args: liveBindingArgs(sourceStateData.ready),
  render: (args) => (
    <div className="w-[min(1120px,calc(100vw-2rem))]">
      <MetadataPageRenderer {...args} />
    </div>
  ),
};

export const LiveLoadingSource: Story = {
  args: liveBindingArgs(sourceStateData.loading),
  render: (args) => (
    <div className="w-[min(920px,calc(100vw-2rem))]">
      <MetadataPageRenderer {...args} />
    </div>
  ),
};

export const LiveEmptySource: Story = {
  args: liveBindingArgs(sourceStateData.empty),
  render: (args) => (
    <div className="w-[min(920px,calc(100vw-2rem))]">
      <MetadataPageRenderer {...args} />
    </div>
  ),
};

export const LiveErrorSource: Story = {
  args: liveBindingArgs(sourceStateData.error),
  render: (args) => (
    <div className="w-[min(920px,calc(100vw-2rem))]">
      <MetadataPageRenderer {...args} />
    </div>
  ),
};

export const LiveForbiddenSource: Story = {
  args: liveBindingArgs(sourceStateData.forbidden),
  render: (args) => (
    <div className="w-[min(920px,calc(100vw-2rem))]">
      <MetadataPageRenderer {...args} />
    </div>
  ),
};

export const LiveStaleSource: Story = {
  args: liveBindingArgs(sourceStateData.stale),
  render: (args) => (
    <div className="w-[min(1120px,calc(100vw-2rem))]">
      <MetadataPageRenderer {...args} />
    </div>
  ),
};
