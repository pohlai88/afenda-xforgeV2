import {
  ApprovalDecisionTrail,
  EvidenceChecklist,
  ImmutableAuditTimeline,
  PolicyExceptionSummary,
  RowEvidencePanel,
} from "@repo/design-system/components/blocks";
import type { Meta, StoryObj } from "@storybook/react";
import {
  DownloadIcon,
  FileCheck2Icon,
  FileSearchIcon,
  HistoryIcon,
  ShieldCheckIcon,
} from "lucide-react";

import { layoutStoryParameters } from "../../.storybook/essentials";

const meta = {
  title: "Blocks/Evidence Audit",
  tags: ["autodocs", "block"],
  parameters: {
    ...layoutStoryParameters,
    layout: "centered",
    docs: {
      description: {
        component:
          "Evidence and audit blocks for governed ERP flows: row evidence panels, immutable timelines, approval decision trails, policy exceptions, and attachment checklists.",
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const evidenceFields = [
  {
    id: "tenant",
    label: "Tenant",
    value: "Northwind Trading",
  },
  {
    id: "batch",
    label: "Batch",
    value: "BATCH-2026-06-18",
    mono: true,
  },
  {
    id: "control",
    label: "Control state",
    value: "Policy exception",
    tone: "warning" as const,
  },
  {
    id: "retention",
    label: "Retention",
    value: "7 years",
    mono: true,
  },
];

const artifacts = [
  {
    id: "ev-10479",
    label: "Vendor invoice package",
    kind: "PDF",
    status: "Hash verified",
    tone: "success" as const,
    owner: "Mina Shah",
    updatedAt: "10:42",
    description: "Invoice, PO match, and delivery note for the held batch.",
    href: "#",
    hrefLabel: "Open vendor invoice package evidence",
  },
  {
    id: "ev-10480",
    label: "Threshold approval note",
    kind: "Memo",
    status: "Awaiting approver",
    tone: "warning" as const,
    owner: "Jon Bell",
    updatedAt: "10:18",
    description:
      "Required for AP-7.4 because total exposure exceeds tenant cap.",
  },
  {
    id: "ev-10481",
    label: "Vendor bank validation",
    kind: "Control",
    status: "Captured",
    tone: "info" as const,
    owner: "Policy engine",
    updatedAt: "09:51",
  },
];

const auditEvents = [
  {
    id: "audit-90018",
    sequence: "90018",
    time: "10:42:31",
    actor: "Mina Shah",
    action: "attached invoice evidence to",
    target: "BATCH-2026-06-18",
    outcome: "Captured",
    tone: "success" as const,
    source: "Evidence service",
    hash: "sha256:86fd...9c20",
  },
  {
    id: "audit-90011",
    sequence: "90011",
    time: "10:18:04",
    actor: "Policy engine",
    action: "opened policy exception for",
    target: "AP-7.4",
    outcome: "Exception",
    tone: "warning" as const,
    source: "Policy runtime",
    hash: "sha256:74ac...31be",
  },
  {
    id: "audit-89992",
    sequence: "89992",
    time: "09:51:20",
    actor: "Jon Bell",
    action: "requested approval decision on",
    target: "tenant posting batch",
    outcome: "Queued",
    tone: "info" as const,
    source: "Approval workflow",
    hash: "sha256:33ad...8f42",
  },
];

const decisions = [
  {
    id: "decision-1",
    actor: "Mina Shah",
    role: "AP operator",
    decision: "Submitted",
    tone: "info" as const,
    time: "09:51",
    policy: "AP-7.4",
    evidenceCount: 2,
    reason: "Submitted batch with invoice package and bank validation.",
  },
  {
    id: "decision-2",
    actor: "Policy engine",
    role: "Automated control",
    decision: "Exception opened",
    tone: "warning" as const,
    time: "10:18",
    policy: "Tenant exposure cap",
    evidenceCount: 3,
    reason: "Batch exposure exceeds configured threshold by 12.4%.",
  },
  {
    id: "decision-3",
    actor: "Ravi Menon",
    role: "Finance manager",
    decision: "Pending",
    tone: "neutral" as const,
    time: "Now",
    policy: "Manager approval",
    evidenceCount: 3,
    reason: "Awaiting final approval note before posting.",
  },
];

const exceptions = [
  {
    id: "PEX-1842",
    policy: "AP-7.4 exposure threshold",
    scope: "Northwind / June close",
    owner: "Ravi Menon",
    severity: "High",
    status: "Approval required",
    tone: "warning" as const,
    evidenceCount: 3,
    dueAt: "11:30",
    description:
      "Posting is locked until manager approval confirms the threshold override.",
  },
  {
    id: "PEX-1838",
    policy: "Vendor bank change",
    scope: "Vendor 44018",
    owner: "Policy engine",
    severity: "Medium",
    status: "Evidence captured",
    tone: "info" as const,
    evidenceCount: 2,
    dueAt: "13:00",
  },
];

const checklistItems = [
  {
    id: "invoice",
    label: "Invoice package",
    description: "Invoice, purchase order, and delivery confirmation.",
    checked: true,
    required: true,
    status: "Attached",
    tone: "success" as const,
    evidenceId: "EV-10479",
    owner: "Mina Shah",
    dueAt: "10:42",
  },
  {
    id: "bank",
    label: "Vendor bank validation",
    checked: true,
    required: true,
    status: "Verified",
    tone: "success" as const,
    evidenceId: "EV-10481",
    owner: "Policy engine",
    dueAt: "09:51",
  },
  {
    id: "approval-note",
    label: "Threshold approval note",
    description: "Manager note must name the exception and posting batch.",
    checked: false,
    required: true,
    status: "Missing",
    tone: "warning" as const,
    owner: "Ravi Menon",
    dueAt: "11:30",
  },
  {
    id: "tax",
    label: "Tax residency support",
    checked: false,
    required: false,
    status: "Optional",
    tone: "neutral" as const,
    owner: "AP team",
  },
];

const evidenceActions = [
  {
    key: "export-evidence",
    label: "Export",
    icon: <DownloadIcon aria-hidden="true" />,
    variant: "quiet" as const,
    capability: "evidence.export",
  },
  {
    key: "review-evidence",
    label: "Review",
    icon: <FileSearchIcon aria-hidden="true" />,
    variant: "secondary" as const,
    capability: "evidence.review",
  },
];

export const EvidenceWorkspace: Story = {
  render: () => (
    <main className="grid w-[min(1180px,calc(100vw-32px))] min-w-0 gap-4 xl:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
      <div className="grid min-w-0 content-start gap-4">
        <RowEvidencePanel
          actions={evidenceActions}
          artifacts={artifacts}
          description="Selected row evidence for a locked posting batch."
          fields={evidenceFields}
          rowId="BATCH-2026-06-18"
          rowLabel="Posting batch"
          status={{ label: "Evidence required", tone: "warning" }}
          title="Row evidence panel"
        />
        <EvidenceChecklist
          actions={[
            {
              key: "attach",
              label: "Attach",
              icon: <FileCheck2Icon aria-hidden="true" />,
              variant: "secondary",
              capability: "evidence.attach",
            },
          ]}
          description="Required attachments before the posting lock can release."
          items={checklistItems}
          title="Attachment checklist"
        />
      </div>
      <div className="grid min-w-0 content-start gap-4">
        <PolicyExceptionSummary
          actions={[
            {
              key: "approve-exception",
              label: "Approve",
              icon: <ShieldCheckIcon aria-hidden="true" />,
              variant: "secondary",
              permission: "policy.exception.approve",
            },
          ]}
          description="Open policy exceptions blocking this batch."
          exceptions={exceptions}
          title="Policy exception summary"
        />
        <ApprovalDecisionTrail
          decisions={decisions}
          description="Decision history for the approval and policy override path."
          title="Approval decision trail"
        />
        <ImmutableAuditTimeline
          actions={[
            {
              key: "full-history",
              label: "History",
              icon: <HistoryIcon aria-hidden="true" />,
              variant: "quiet",
            },
          ]}
          description="Append-only event trail with source and hash metadata."
          events={auditEvents}
          title="Immutable audit timeline"
        />
      </div>
    </main>
  ),
};

export const RowEvidence: Story = {
  render: () => (
    <main className="grid w-[min(760px,calc(100vw-32px))] min-w-0 gap-4">
      <RowEvidencePanel
        actions={evidenceActions}
        artifacts={artifacts}
        description="A compact drawer-style panel for the selected data-table row."
        fields={evidenceFields}
        rowId="BATCH-2026-06-18"
        rowLabel="Posting batch"
        status={{ label: "Evidence required", tone: "warning" }}
        title="Row evidence panel"
      />
    </main>
  ),
};

export const ImmutableTimeline: Story = {
  render: () => (
    <main className="grid w-[min(860px,calc(100vw-32px))] min-w-0 gap-4">
      <ImmutableAuditTimeline
        description="Append-only audit events with sequence, source, and hash references."
        events={auditEvents}
        title="Immutable audit timeline"
      />
    </main>
  ),
};

export const DecisionTrail: Story = {
  render: () => (
    <main className="grid w-[min(820px,calc(100vw-32px))] min-w-0 gap-4">
      <ApprovalDecisionTrail
        decisions={decisions}
        description="Approval decisions, roles, policies, and attached evidence counts."
        title="Approval decision trail"
      />
    </main>
  ),
};

export const PolicyExceptions: Story = {
  render: () => (
    <main className="grid w-[min(860px,calc(100vw-32px))] min-w-0 gap-4">
      <PolicyExceptionSummary
        description="Policy exceptions that block approval or posting."
        exceptions={exceptions}
        title="Policy exception summary"
      />
    </main>
  ),
};

export const AttachmentChecklist: Story = {
  render: () => (
    <main className="grid w-[min(760px,calc(100vw-32px))] min-w-0 gap-4">
      <EvidenceChecklist
        description="Evidence completeness for audit-safe posting."
        items={checklistItems}
        title="Attachment checklist"
      />
    </main>
  ),
};
