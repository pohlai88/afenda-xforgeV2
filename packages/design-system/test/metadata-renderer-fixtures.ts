import type { MetadataDataSources } from "../components/blocks/metadata-renderer";
import type { MetadataPage } from "../components/blocks/metadata-schema";

export const approvalControlCenterMetadata = {
  blocks: [
    {
      actions: [
        {
          actionId: "postReady",
          auditEvent: "approval.post_ready.requested",
          key: "post-ready",
          label: "Post ready",
          permission: "approval.post",
          variant: "primary",
        },
      ],
      blockId: "approval-control-header",
      density: "compact",
      description:
        "Tenant-scoped approval queue with governed posting and SLA-aware risk state.",
      intent: "approval",
      status: { label: "SLA watch", tone: "warning" },
      title: "Approval control center",
      type: "pageHeader",
    },
    {
      blockId: "approval-control-stats",
      columns: 3,
      density: "compact",
      metrics: [
        { id: "ready", label: "Ready", tone: "success", value: 86 },
        { id: "risk", label: "SLA risk", tone: "warning", value: 14 },
        { id: "failed", label: "Failed sync", tone: "critical", value: 2 },
      ],
      type: "statsStrip",
    },
    {
      blockId: "approval-control-table",
      columns: [
        { header: "Approval", id: "approvalId", kind: "id" },
        { header: "Tenant", id: "tenant" },
        { header: "Owner", id: "owner" },
        { align: "right", header: "Amount", id: "amount", kind: "money" },
        { align: "right", header: "SLA", id: "sla" },
      ],
      data: { path: "rows", source: "approvals" },
      density: "compact",
      footer: { path: "summary.label", source: "approvals" },
      selectedCount: { path: "summary.selected", source: "approvals" },
      title: "Approval queue",
      type: "dataTable",
    },
  ],
  pageId: "approval-control-center",
  version: 1,
} satisfies MetadataPage;

export const approvalControlCenterDataSources = {
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
        amount: "122,900.00",
        approvalId: "AP-10471",
        owner: "Priya N.",
        sla: "Past due",
        tenant: "Mercury Parts",
      },
    ],
    summary: {
      label: "2 approvals loaded",
      selected: 1,
    },
  },
} satisfies MetadataDataSources;

export const auditEvidenceReviewMetadata = {
  blocks: [
    {
      blockId: "audit-evidence-header",
      description:
        "Evidence review workspace for immutable audit records and failed vendor sync recovery.",
      intent: "audit",
      status: { label: "Evidence required", tone: "warning" },
      title: "Audit evidence review",
      type: "pageHeader",
    },
    {
      blockId: "audit-evidence-empty",
      description:
        "No approved evidence exists for the selected policy exception.",
      intent: "audit",
      title: "Evidence missing",
      tone: "warning",
      type: "emptyPanel",
    },
    {
      actions: [
        {
          actionId: "retrySync",
          auditEvent: "audit.evidence.retry_sync.requested",
          key: "retry-sync",
          label: "Retry sync",
          variant: "secondary",
        },
      ],
      blockId: "audit-evidence-error",
      description:
        "Vendor evidence service failed and requires an operator retry.",
      state: "error",
      title: "Evidence sync failed",
      type: "runtimeState",
    },
  ],
  pageId: "audit-evidence-review",
  version: 1,
} satisfies MetadataPage;

export const auditEvidenceReviewDataSources = {
  evidence: {
    summary: {
      missing: 1,
      synced: 0,
    },
  },
} satisfies MetadataDataSources;

export const tenantConfigurationMetadata = {
  blocks: [
    {
      actions: [
        {
          actionId: "requestAccess",
          key: "request-access",
          label: "Request access",
          permission: "tenant.configuration.requestAccess",
          variant: "secondary",
        },
      ],
      blockId: "tenant-config-header",
      description:
        "Configuration metadata fixture for policy setup, permissions, and readonly runtime state.",
      intent: "configuration",
      orchestration: { isReadonly: true },
      status: { label: "Read-only", tone: "warning" },
      title: "Tenant configuration",
      type: "pageHeader",
    },
    {
      activeFilters: [
        { id: "scope", label: "Scope: tenant", tone: "info" },
        { id: "mode", label: "Mode: readonly", tone: "warning" },
      ],
      blockId: "tenant-config-filters",
      resultCount: { path: "summary.total", source: "settings" },
      searchPlaceholder: "Search settings...",
      type: "filterBar",
    },
    {
      blockId: "tenant-config-state",
      description:
        "Current role can inspect policy settings but cannot modify approval rules.",
      state: "readonly",
      title: "Configuration locked",
      type: "runtimeState",
    },
  ],
  pageId: "tenant-configuration",
  version: 1,
} satisfies MetadataPage;

export const tenantConfigurationDataSources = {
  settings: {
    summary: {
      total: 24,
    },
  },
} satisfies MetadataDataSources;
