import type { MetadataDataSources } from "../metadata-renderer";
import type { MetadataPage } from "../schema";

const approvalControlCenterMetadata = {
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

const approvalControlCenterDataSources = {
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

export { approvalControlCenterDataSources, approvalControlCenterMetadata };
