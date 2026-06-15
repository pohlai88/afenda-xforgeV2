import type {
  MetadataDataSources,
  MetadataPage,
} from "@repo/design-system/components/blocks";
import { MetadataPageRenderer } from "@repo/design-system/components/blocks/metadata-renderer";
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
