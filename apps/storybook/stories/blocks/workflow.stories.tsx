import { Button } from "@repo/design-system/components/afenda-ui/button";
import type {
  ApprovalQueueRow,
  AuditTrailEvent,
  CommandSearchGroup,
  EntitySummaryField,
  EvidenceRecord,
  PolicyLockRow,
  RiskEvidenceItem,
  StatsMetric,
  StatusTimelineItem,
} from "@repo/design-system/components/blocks";
import {
  ApprovalControlCenter,
  AuditEvidenceWorkspace,
  BatchPostingReview,
  PolicyLockManager,
  TenantOperationsWorkspace,
} from "@repo/design-system/components/blocks";
import type { Meta, StoryObj } from "@storybook/react";
import {
  DownloadIcon,
  LockOpenIcon,
  RefreshCwIcon,
  ShieldCheckIcon,
} from "lucide-react";

import { layoutStoryParameters } from "../../.storybook/essentials";

const meta = {
  title: "Blocks/Workflow",
  tags: ["autodocs", "block"],
  parameters: {
    ...layoutStoryParameters,
    layout: "centered",
    docs: {
      description: {
        component:
          "Phase 2 workflow composition blocks for governed ERP operations. These compose foundation, operator, and advanced blocks without storing domain data in the design system.",
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const scope = {
  tenant: "Northwind Trading",
  period: "June close",
  timezone: "UTC+07",
};

const metrics: StatsMetric[] = [
  {
    id: "risk",
    label: "Approval risk",
    value: "72",
    description: "Weighted by SLA, amount, and policy lock.",
    tone: "warning",
  },
  {
    id: "ready",
    label: "Ready to post",
    value: "86",
    description: "Validated records awaiting batch approval.",
    tone: "success",
  },
  {
    id: "audit",
    label: "Audit events",
    value: "1,284",
    description: "Immutable events captured this period.",
    tone: "info",
  },
  {
    id: "exceptions",
    label: "Exceptions",
    value: "14",
    description: "Records held by policy or owner lock.",
    tone: "critical",
  },
];

const approvals: ApprovalQueueRow[] = [
  {
    amount: "86,420.00",
    approvalId: "AP-10482",
    assignee: "Mina Shah",
    evidence: "Invoice and vendor match",
    requestedAt: "10:42",
    risk: "success",
    sla: "1h 12m",
    tenant: "Northwind Trading",
  },
  {
    amount: "14,310.50",
    approvalId: "AP-10479",
    assignee: "Jon Bell",
    evidence: "Evidence required",
    requestedAt: "10:18",
    risk: "warning",
    sla: "38m",
    tenant: "Aster Foods",
  },
  {
    amount: "122,900.00",
    approvalId: "AP-10471",
    assignee: "Priya N.",
    evidence: "Policy lock",
    requestedAt: "09:51",
    risk: "critical",
    sla: "Past due",
    tenant: "Mercury Parts",
  },
];

const evidence: RiskEvidenceItem[] = [
  {
    actor: "Policy engine",
    detail: "AP-7.4 requires second approver for high-value vendor posting.",
    id: "risk-policy",
    time: "10:18",
    tone: "warning",
  },
  {
    actor: "Mina Shah",
    detail: "Vendor invoice, receiving note, and owner confirmation attached.",
    id: "risk-attachment",
    time: "10:42",
    tone: "success",
  },
];

const searchGroups: CommandSearchGroup[] = [
  {
    heading: "Approvals",
    items: [
      {
        description: "Evidence required / SLA 38m",
        id: "cmd-ap-10479",
        keywords: ["approval", "aster", "sla"],
        title: "AP-10479",
        tone: "warning",
      },
      {
        description: "Ready to post",
        id: "cmd-ap-10482",
        keywords: ["approval", "northwind", "ready"],
        title: "AP-10482",
        tone: "success",
      },
    ],
  },
];

const tenantFields: EntitySummaryField[] = [
  {
    id: "tenant-id",
    label: "Tenant ID",
    value: "TEN-0042",
    meta: "Thailand operating unit",
    mono: true,
  },
  {
    id: "owner",
    label: "Control owner",
    value: "Mina Shah",
    meta: "Finance operations",
  },
  {
    id: "posting-window",
    label: "Posting window",
    value: "17:00 UTC+07",
    meta: "Closes in 6h 11m",
    mono: true,
    tone: "info",
  },
  {
    id: "lock-state",
    label: "Lock state",
    value: "Policy gated",
    meta: "AP-7.4 evidence required",
    tone: "warning",
  },
];

const timeline: StatusTimelineItem[] = [
  {
    id: "schema",
    label: "Schema checks passed",
    description:
      "Tenant, vendor, and currency fields matched the period schema.",
    time: "09:45",
    tone: "success",
    meta: "No field drift",
  },
  {
    id: "policy",
    label: "Policy engine review",
    description: "High-value threshold requires supporting evidence.",
    time: "10:18",
    tone: "warning",
    meta: "AP-7.4",
  },
];

const auditEvents: AuditTrailEvent[] = [
  {
    id: "audit-3842",
    time: "10:42:31",
    actor: "Mina Shah",
    action: "attached evidence to",
    target: "AP-10479",
    outcome: "Captured",
    tone: "success",
  },
  {
    id: "audit-3838",
    time: "10:18:04",
    actor: "Policy engine",
    action: "flagged SLA risk for",
    target: "Aster Foods",
    outcome: "Watch",
    tone: "warning",
  },
];

const evidenceRecords: EvidenceRecord[] = [
  {
    evidenceId: "EV-8842",
    kind: "Invoice",
    owner: "Mina Shah",
    retention: "7y",
    status: "Accepted",
    tone: "success",
    updatedAt: "10:42",
  },
  {
    evidenceId: "EV-8839",
    kind: "Receiving note",
    owner: "Jon Bell",
    retention: "7y",
    status: "Review",
    tone: "warning",
    updatedAt: "10:18",
  },
];

const locks: PolicyLockRow[] = [
  {
    lockId: "LOCK-7421",
    owner: "Policy engine",
    policy: "AP-7.4",
    scope: "High-value vendor posting",
    state: "Evidence required",
    tone: "warning",
    unlockAt: "Manual",
  },
  {
    lockId: "LOCK-7402",
    owner: "Risk desk",
    policy: "VR-3.8",
    scope: "Vendor risk threshold",
    state: "Blocked",
    tone: "critical",
    unlockAt: "Review",
  },
];

const batches = [
  {
    amount: "232,111.75",
    batchId: "BATCH-184",
    owner: "Mina Shah",
    records: "86",
    status: "Ready",
    tenant: "Northwind Trading",
    tone: "success" as const,
  },
  {
    amount: "14,310.50",
    batchId: "BATCH-183",
    owner: "Jon Bell",
    records: "4",
    status: "Evidence required",
    tenant: "Aster Foods",
    tone: "warning" as const,
  },
];

export const ApprovalCenter: Story = {
  render: () => (
    <main className="w-[min(1180px,calc(100vw-32px))] min-w-0">
      <ApprovalControlCenter
        actions={<WorkflowActions />}
        approvals={approvals}
        evidence={evidence}
        metrics={metrics}
        progress={{
          label: "Evidence completeness",
          tone: "warning",
          value: 68,
        }}
        scope={scope}
        searchGroups={searchGroups}
      />
    </main>
  ),
};

export const TenantWorkspace: Story = {
  render: () => (
    <main className="grid w-[min(1120px,calc(100vw-32px))] min-w-0">
      <TenantOperationsWorkspace
        actions={<WorkflowActions />}
        auditEvents={auditEvents}
        fields={tenantFields}
        filter={{
          activeFilters: [
            { id: "tenant", label: "Tenant: Northwind" },
            { id: "period", label: "Period: June close" },
          ],
          resultCount: 128,
        }}
        metrics={metrics}
        scope={scope}
        timeline={timeline}
      />
    </main>
  ),
};

export const AuditEvidence: Story = {
  render: () => (
    <main className="grid w-[min(1120px,calc(100vw-32px))] min-w-0">
      <AuditEvidenceWorkspace
        actions={<WorkflowActions />}
        auditEvents={auditEvents}
        evidence={evidence}
        evidenceRecords={evidenceRecords}
        metrics={metrics}
        progress={{ label: "Evidence coverage", tone: "success", value: 84 }}
        scope={scope}
      />
    </main>
  ),
};

export const PolicyLocks: Story = {
  render: () => (
    <main className="grid w-[min(1120px,calc(100vw-32px))] min-w-0">
      <PolicyLockManager
        actions={
          <>
            <Button size="sm" variant="secondary">
              <LockOpenIcon aria-hidden="true" className="size-4" />
              Request unlock
            </Button>
            <Button size="sm" variant="quiet">
              <RefreshCwIcon aria-hidden="true" className="size-4" />
              Refresh
            </Button>
          </>
        }
        evidence={evidence}
        locks={locks}
        metrics={metrics.slice(0, 3)}
        scope={scope}
      />
    </main>
  ),
};

export const BatchPosting: Story = {
  render: () => (
    <main className="grid w-[min(1120px,calc(100vw-32px))] min-w-0">
      <BatchPostingReview
        actions={<WorkflowActions />}
        auditEvents={auditEvents}
        batches={batches}
        metrics={metrics}
        scope={scope}
      />
    </main>
  ),
};

function WorkflowActions() {
  return (
    <>
      <Button size="sm" variant="primary">
        <ShieldCheckIcon aria-hidden="true" className="size-4" />
        Approve ready
      </Button>
      <Button size="sm" variant="quiet">
        <DownloadIcon aria-hidden="true" className="size-4" />
        Export
      </Button>
    </>
  );
}
