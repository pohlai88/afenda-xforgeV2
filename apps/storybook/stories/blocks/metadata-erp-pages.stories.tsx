import type {
  MetadataDataBinding,
  MetadataDataSources,
  MetadataPage,
  MetadataPageRendererProps,
  MetadataScalar,
} from "@repo/design-system";
import { MetadataPageRenderer } from "@repo/design-system";
import type { Meta, StoryObj } from "@storybook/react";

import { layoutStoryParameters } from "../../.storybook/essentials";

const meta = {
  title: "Blocks/ERP Metadata Pages",
  component: MetadataPageRenderer,
  tags: ["autodocs", "block", "erp"],
  parameters: {
    ...layoutStoryParameters,
    layout: "centered",
    docs: {
      description: {
        component:
          "Representative Afenda ERP pages composed from versioned block metadata. These examples exercise page headers, metrics, filters, runtime states, governed bulk actions, empty states, and data tables through the shared registry renderer.",
      },
    },
  },
} satisfies Meta<typeof MetadataPageRenderer>;

export default meta;

type Story = StoryObj<typeof meta>;
type ErpMetadataSource = "approvals" | "auditEvidence" | "tenantSetup";

function bind(
  source: ErpMetadataSource,
  path: string,
  fallback?: MetadataScalar
): MetadataDataBinding {
  const binding = { path, source };

  return fallback === undefined ? binding : { ...binding, fallback };
}

const approvalsQueuePage = {
  blocks: [
    {
      actions: [
        {
          actionId: "refreshQueue",
          auditEvent: "approval_queue.refresh.requested",
          capability: "approval:queue:refresh",
          key: "refresh",
          label: "Refresh",
          permission: "approvals.read",
          roles: ["approver", "controller"],
          variant: "secondary",
        },
        {
          actionId: "postReady",
          auditEvent: "approval_queue.post_ready.requested",
          capability: "approval:batch:post",
          disabled: true,
          key: "post-ready",
          label: "Post ready",
          permission: "approvals.post",
          reason: "Two selected approvals still require evidence review.",
          roles: ["controller"],
          variant: "primary",
        },
      ],
      blockId: "approvals-header",
      density: "compact",
      description:
        "Review tenant-scoped approvals, policy locks, evidence readiness, and SLA risk before operational posting.",
      eyebrow: "ERP / Approvals",
      intent: "approval",
      meta: [
        { id: "tenant", label: bind("approvals", "scope.tenant") },
        { id: "period", label: bind("approvals", "scope.period") },
        { id: "zone", label: bind("approvals", "scope.zone") },
      ],
      status: { label: "SLA watch", tone: "warning" },
      title: "Approvals queue",
      tone: "warning",
      type: "pageHeader",
    },
    {
      blockId: "approvals-stats",
      columns: 4,
      density: "compact",
      intent: "overview",
      metrics: [
        {
          description: "Open requests with policy or SLA attention.",
          id: "open",
          label: "Open approvals",
          tone: "warning",
          value: bind("approvals", "summary.open"),
        },
        {
          description: "Validated records available for governed posting.",
          id: "ready",
          label: "Ready to post",
          tone: "success",
          value: bind("approvals", "summary.ready"),
        },
        {
          description: "Requests that breach the next four-hour window.",
          id: "sla-risk",
          label: "SLA risk",
          tone: "critical",
          value: bind("approvals", "summary.slaRisk"),
        },
        {
          description: "Immutable audit events linked to this queue.",
          id: "audit-events",
          label: "Audit events",
          tone: "info",
          value: bind("approvals", "summary.auditEvents"),
        },
      ],
      type: "statsStrip",
    },
    {
      actions: [
        {
          actionId: "saveView",
          auditEvent: "approval_queue.view_saved",
          key: "save-view",
          label: "Save view",
          permission: "approvals.views.write",
          variant: "quiet",
        },
      ],
      blockId: "approvals-filters",
      density: "compact",
      filtersBinding: bind("approvals", "filters.active"),
      intent: "operation",
      resultCount: bind("approvals", "summary.resultLabel"),
      searchPlaceholder: "Search approval ID, tenant, owner...",
      searchValueBinding: bind("approvals", "filters.query", ""),
      type: "filterBar",
    },
    {
      actions: [
        {
          actionId: "approveSelected",
          auditEvent: "approval_queue.bulk_approved",
          capability: "approval:decision:approve",
          key: "approve",
          label: "Approve selected",
          permission: "approvals.approve",
          roles: ["approver"],
          variant: "primary",
        },
        {
          actionId: "rejectSelected",
          auditEvent: "approval_queue.bulk_rejected",
          capability: "approval:decision:reject",
          confirmationLabel: "Reject selected approvals",
          critical: true,
          key: "reject",
          label: "Reject selected",
          permission: "approvals.reject",
          roles: ["approver"],
          variant: "critical",
        },
      ],
      blockId: "approvals-bulk-actions",
      clearLabel: "Clear selection",
      density: "compact",
      intent: "approval",
      label: bind("approvals", "selection.label"),
      selectedCount: bind("approvals", "selection.count"),
      type: "bulkActionBar",
    },
    {
      actions: [
        {
          actionId: "exportQueue",
          auditEvent: "approval_queue.export_requested",
          key: "export",
          label: "Export",
          permission: "approvals.export",
          variant: "secondary",
        },
      ],
      blockId: "approvals-table",
      bulkActions: [
        {
          actionId: "holdSelected",
          auditEvent: "approval_queue.bulk_hold_requested",
          key: "hold",
          label: "Place hold",
          permission: "approvals.hold",
          reason: "Available for selected rows with unresolved evidence.",
          variant: "secondary",
        },
      ],
      columns: [
        {
          accessorKey: "approvalId",
          header: "Approval",
          id: "approval",
          kind: "id",
        },
        { accessorKey: "tenant", header: "Tenant", id: "tenant" },
        { accessorKey: "owner", header: "Owner", id: "owner" },
        {
          accessorKey: "amount",
          align: "right",
          header: "Amount",
          id: "amount",
          kind: "money",
        },
        {
          accessorKey: "policy",
          header: "Policy",
          id: "policy",
          kind: "status",
        },
        {
          accessorKey: "sla",
          align: "right",
          header: "SLA",
          id: "sla",
          kind: "status",
        },
      ],
      data: bind("approvals", "rows"),
      density: "compact",
      footer: bind("approvals", "summary.footer"),
      intent: "approval",
      selectedCount: bind("approvals", "selection.count"),
      title: "Pending approval records",
      type: "dataTable",
    },
  ],
  pageId: "approvals-queue-page",
  version: 1,
} satisfies MetadataPage;

const tenantSetupPage = {
  blocks: [
    {
      actions: [
        {
          actionId: "inviteAdmin",
          auditEvent: "tenant_setup.admin_invite_started",
          capability: "tenant:admin:invite",
          key: "invite-admin",
          label: "Invite admin",
          permission: "tenant.admin.invite",
          roles: ["tenant-admin"],
          variant: "primary",
        },
        {
          actionId: "resetSandbox",
          auditEvent: "tenant_setup.sandbox_reset_requested",
          capability: "tenant:sandbox:reset",
          confirmationLabel: "Reset tenant sandbox",
          critical: true,
          disabled: true,
          key: "reset-sandbox",
          label: "Reset sandbox",
          permission: "tenant.sandbox.reset",
          reason: "Production tenants require change-control approval first.",
          roles: ["platform-admin"],
          variant: "critical",
        },
      ],
      blockId: "tenant-setup-header",
      density: "compact",
      description:
        "Configure tenant scope, integration readiness, admin ownership, and approval policy before go-live.",
      eyebrow: "ERP / Tenant administration",
      intent: "setup",
      meta: [
        {
          id: "tenant",
          label: bind("tenantSetup", "scope.tenant"),
        },
        {
          id: "environment",
          label: bind("tenantSetup", "scope.environment"),
        },
        {
          id: "region",
          label: bind("tenantSetup", "scope.region"),
        },
      ],
      status: { label: "Configuration guarded", tone: "info" },
      title: "Tenant setup",
      type: "pageHeader",
    },
    {
      blockId: "tenant-setup-stats",
      columns: 4,
      density: "compact",
      intent: "overview",
      metrics: [
        {
          description: "Setup modules already validated.",
          id: "configured",
          label: "Configured",
          tone: "success",
          value: bind("tenantSetup", "summary.configured"),
        },
        {
          description: "Tasks awaiting tenant or platform owner action.",
          id: "open-tasks",
          label: "Open tasks",
          tone: "warning",
          value: bind("tenantSetup", "summary.openTasks"),
        },
        {
          description: "Policies blocking unreviewed operational changes.",
          id: "policy-locks",
          label: "Policy locks",
          tone: "info",
          value: bind("tenantSetup", "summary.policyLocks"),
        },
        {
          description: "Last successful configuration save state.",
          id: "save-state",
          label: "Save state",
          tone: "neutral",
          value: bind("tenantSetup", "summary.saveState"),
        },
      ],
      type: "statsStrip",
    },
    {
      actions: [
        {
          actionId: "requestUnlock",
          auditEvent: "tenant_setup.unlock_requested",
          key: "request-unlock",
          label: "Request unlock",
          permission: "tenant.policy.unlock.request",
          variant: "secondary",
        },
      ],
      blockId: "tenant-setup-runtime",
      density: "compact",
      description:
        "Operational defaults are read-only until evidence owners confirm identity, billing, and integration controls.",
      intent: "configuration",
      state: "readonly",
      title: "Governed setup mode",
      tone: "info",
      type: "runtimeState",
    },
    {
      actions: [
        {
          actionId: "addIntegration",
          auditEvent: "tenant_setup.integration_add_started",
          key: "add-integration",
          label: "Add integration",
          permission: "tenant.integration.write",
          variant: "primary",
        },
      ],
      activeFilters: [
        { id: "owner", label: "Owner: platform ops", tone: "info" },
        { id: "state", label: "State: open", tone: "warning" },
      ],
      blockId: "tenant-setup-filters",
      density: "compact",
      intent: "operation",
      resultCount: bind("tenantSetup", "summary.stepLabel"),
      searchPlaceholder: "Search module, owner, or integration...",
      type: "filterBar",
    },
    {
      actions: [
        {
          actionId: "downloadChecklist",
          auditEvent: "tenant_setup.checklist_downloaded",
          key: "download",
          label: "Download checklist",
          permission: "tenant.setup.read",
          variant: "secondary",
        },
      ],
      blockId: "tenant-setup-table",
      columns: [
        { accessorKey: "module", header: "Module", id: "module" },
        { accessorKey: "owner", header: "Owner", id: "owner" },
        { accessorKey: "state", header: "State", id: "state", kind: "status" },
        { accessorKey: "dependency", header: "Dependency", id: "dependency" },
        {
          accessorKey: "due",
          align: "right",
          header: "Due",
          id: "due",
          kind: "date",
        },
      ],
      data: bind("tenantSetup", "steps"),
      density: "compact",
      footer: bind("tenantSetup", "summary.footer"),
      intent: "setup",
      title: "Setup workplan",
      type: "dataTable",
    },
    {
      actions: [
        {
          actionId: "openEvidence",
          auditEvent: "tenant_setup.evidence_opened",
          key: "open-evidence",
          label: "Open evidence",
          permission: "tenant.evidence.read",
          variant: "secondary",
        },
      ],
      blockId: "tenant-setup-empty",
      density: "compact",
      description:
        "All required identity and billing evidence is attached for this setup stage.",
      intent: "setup",
      title: "No missing evidence",
      tone: "success",
      type: "emptyPanel",
    },
  ],
  pageId: "tenant-setup-page",
  version: 1,
} satisfies MetadataPage;

const auditEvidencePage = {
  blocks: [
    {
      actions: [
        {
          actionId: "sealPacket",
          auditEvent: "audit_evidence.packet_seal_requested",
          capability: "audit:evidence:seal",
          confirmationLabel: "Seal evidence packet",
          key: "seal-packet",
          label: "Seal packet",
          permission: "audit.evidence.seal",
          roles: ["evidence-manager"],
          variant: "primary",
        },
        {
          actionId: "exportEvidence",
          auditEvent: "audit_evidence.export_requested",
          key: "export",
          label: "Export",
          permission: "audit.evidence.export",
          roles: ["auditor", "evidence-manager"],
          variant: "secondary",
        },
      ],
      blockId: "audit-evidence-header",
      density: "compact",
      description:
        "Inspect immutable audit packets, approval trails, policy exceptions, and retained attachments for the selected tenant period.",
      eyebrow: "ERP / Audit evidence",
      intent: "audit",
      meta: [
        {
          id: "tenant",
          label: bind("auditEvidence", "scope.tenant"),
        },
        {
          id: "period",
          label: bind("auditEvidence", "scope.period"),
        },
        {
          id: "retention",
          label: bind("auditEvidence", "scope.retention"),
        },
      ],
      status: { label: "Immutable", tone: "success" },
      title: "Audit evidence",
      type: "pageHeader",
    },
    {
      blockId: "audit-evidence-stats",
      columns: 4,
      density: "compact",
      intent: "overview",
      metrics: [
        {
          description: "Evidence packets ready for auditor inspection.",
          id: "packets",
          label: "Packets",
          tone: "success",
          value: bind("auditEvidence", "summary.packets"),
        },
        {
          description: "Append-only events retained in the packet.",
          id: "immutable-events",
          label: "Immutable events",
          tone: "info",
          value: bind("auditEvidence", "summary.immutableEvents"),
        },
        {
          description: "Exceptions requiring approval trail evidence.",
          id: "exceptions",
          label: "Exceptions",
          tone: "warning",
          value: bind("auditEvidence", "summary.exceptions"),
        },
        {
          description: "Attachments waiting for checksum verification.",
          id: "checksum",
          label: "Checksum pending",
          tone: "critical",
          value: bind("auditEvidence", "summary.checksumPending"),
        },
      ],
      type: "statsStrip",
    },
    {
      blockId: "audit-evidence-runtime",
      density: "compact",
      description:
        "Evidence rows are rendered in read-only mode. Critical actions require explicit confirmation and a retained audit event.",
      intent: "audit",
      state: "readonly",
      title: "Immutable audit mode",
      tone: "success",
      type: "runtimeState",
    },
    {
      actions: [
        {
          actionId: "requestMissing",
          auditEvent: "audit_evidence.missing_requested",
          key: "request-missing",
          label: "Request missing",
          permission: "audit.evidence.request",
          variant: "secondary",
        },
      ],
      blockId: "audit-evidence-filters",
      density: "compact",
      filtersBinding: bind("auditEvidence", "filters.active"),
      intent: "operation",
      resultCount: bind("auditEvidence", "summary.resultLabel"),
      searchPlaceholder: "Search packet, control, owner...",
      type: "filterBar",
    },
    {
      actions: [
        {
          actionId: "openPacket",
          auditEvent: "audit_evidence.packet_opened",
          key: "open-packet",
          label: "Open packet",
          permission: "audit.evidence.read",
          variant: "primary",
        },
      ],
      blockId: "audit-evidence-table",
      columns: [
        { accessorKey: "packetId", header: "Packet", id: "packet", kind: "id" },
        { accessorKey: "control", header: "Control", id: "control" },
        { accessorKey: "owner", header: "Owner", id: "owner" },
        {
          accessorKey: "status",
          header: "Status",
          id: "status",
          kind: "status",
        },
        {
          accessorKey: "attachments",
          align: "right",
          header: "Files",
          id: "attachments",
          kind: "number",
        },
        {
          accessorKey: "updated",
          align: "right",
          header: "Updated",
          id: "updated",
          kind: "date",
        },
      ],
      data: bind("auditEvidence", "rows"),
      density: "compact",
      footer: bind("auditEvidence", "summary.footer"),
      intent: "audit",
      title: "Evidence packets",
      type: "dataTable",
    },
  ],
  pageId: "audit-evidence-page",
  version: 1,
} satisfies MetadataPage;

const metadataDataSources = {
  approvals: {
    filters: {
      active: [
        { id: "status", label: "Status: pending", tone: "warning" },
        { id: "tenant", label: "Tenant: Northwind", tone: "info" },
        { id: "sla", label: "SLA < 4h", tone: "critical" },
      ],
      query: "",
    },
    rows: [
      {
        amount: "$86,420.00",
        approvalId: "AP-10482",
        id: "AP-10482",
        owner: "Mina Shah",
        policy: "Evidence ready",
        sla: "1h 12m",
        tenant: "Northwind Trading",
      },
      {
        amount: "$14,310.50",
        approvalId: "AP-10479",
        id: "AP-10479",
        owner: "Jon Bell",
        policy: "Manager review",
        sla: "38m",
        tenant: "Aster Foods",
      },
      {
        amount: "$122,900.00",
        approvalId: "AP-10471",
        id: "AP-10471",
        owner: "Priya N.",
        policy: "Exception",
        sla: "Past due",
        tenant: "Mercury Parts",
      },
    ],
    scope: {
      period: "June close",
      tenant: "Northwind Trading",
      zone: "UTC+07",
    },
    selection: {
      count: 2,
      label: "2 approvals selected",
    },
    summary: {
      auditEvents: "1,284",
      footer: "3 approvals loaded; 2 selected for guarded action review",
      open: 24,
      ready: 86,
      resultLabel: "24 approvals",
      slaRisk: 4,
    },
  },
  auditEvidence: {
    filters: {
      active: [
        { id: "kind", label: "Kind: approval trail", tone: "info" },
        { id: "status", label: "Status: retained", tone: "success" },
      ],
    },
    rows: [
      {
        attachments: 12,
        control: "AP-DECISION-CHAIN",
        id: "EV-7701",
        owner: "Evidence Ops",
        packetId: "EV-7701",
        status: "Retained",
        updated: "2026-06-14",
      },
      {
        attachments: 8,
        control: "POLICY-EXCEPTION",
        id: "EV-7694",
        owner: "Compliance",
        packetId: "EV-7694",
        status: "Checksum pending",
        updated: "2026-06-13",
      },
      {
        attachments: 19,
        control: "ATTACHMENT-CHECKLIST",
        id: "EV-7688",
        owner: "Tenant Admin",
        packetId: "EV-7688",
        status: "Sealed",
        updated: "2026-06-12",
      },
    ],
    scope: {
      period: "June close",
      retention: "7 years",
      tenant: "Northwind Trading",
    },
    summary: {
      checksumPending: 1,
      exceptions: 3,
      footer: "3 packets visible; immutable event linkage is retained",
      immutableEvents: "3,918",
      packets: 18,
      resultLabel: "18 evidence packets",
    },
  },
  tenantSetup: {
    scope: {
      environment: "Production",
      region: "APAC",
      tenant: "Northwind Trading",
    },
    steps: [
      {
        dependency: "Identity provider",
        due: "Today",
        id: "setup-identity",
        module: "Identity",
        owner: "Platform ops",
        state: "Review",
      },
      {
        dependency: "Billing profile",
        due: "2026-06-17",
        id: "setup-billing",
        module: "Billing",
        owner: "Finance ops",
        state: "Open",
      },
      {
        dependency: "Audit packet",
        due: "2026-06-18",
        id: "setup-audit",
        module: "Audit controls",
        owner: "Compliance",
        state: "Ready",
      },
      {
        dependency: "ERP connector",
        due: "2026-06-19",
        id: "setup-integration",
        module: "Integrations",
        owner: "Tenant admin",
        state: "Blocked",
      },
    ],
    summary: {
      configured: "7 / 10",
      footer: "4 setup modules shown; 1 blocked by integration evidence",
      openTasks: 4,
      policyLocks: 2,
      saveState: "Saved",
      stepLabel: "4 setup steps",
    },
  },
} satisfies MetadataDataSources;

function MetadataPageFrame({
  dataSources = metadataDataSources,
  page,
}: MetadataPageRendererProps) {
  return (
    <div className="w-[min(1180px,calc(100vw-2rem))]">
      <MetadataPageRenderer dataSources={dataSources} page={page} />
    </div>
  );
}

export const ApprovalsQueue: Story = {
  args: {
    dataSources: metadataDataSources,
    page: approvalsQueuePage,
  },
  render: (args) => <MetadataPageFrame {...args} />,
};

export const TenantSetup: Story = {
  args: {
    dataSources: metadataDataSources,
    page: tenantSetupPage,
  },
  render: (args) => <MetadataPageFrame {...args} />,
};

export const AuditEvidence: Story = {
  args: {
    dataSources: metadataDataSources,
    page: auditEvidencePage,
  },
  render: (args) => <MetadataPageFrame {...args} />,
};
