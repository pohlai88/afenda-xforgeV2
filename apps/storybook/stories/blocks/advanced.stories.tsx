import { Button } from "@repo/design-system/components/afenda-ui/button";
import { Input } from "@repo/design-system/components/afenda-ui/input";
import {
  ApprovalQueueBlock,
  CommandSearchBlock,
  OperationalDashboardShell,
  RecordEditorBlock,
  RiskEvidencePanel,
} from "@repo/design-system/components/blocks";
import type { Meta, StoryObj } from "@storybook/react";
import {
  ClipboardCheckIcon,
  FileTextIcon,
  ShieldCheckIcon,
  UsersIcon,
} from "lucide-react";

import { layoutStoryParameters } from "../../.storybook/essentials";

const meta = {
  title: "Blocks/Advanced",
  tags: ["autodocs", "block"],
  parameters: {
    ...layoutStoryParameters,
    layout: "centered",
    docs: {
      description: {
        component:
          "Advanced Afenda blocks with table state, command search, and operational evidence views.",
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const rows = [
  {
    amount: "86,420.00",
    approvalId: "AP-10482",
    assignee: "Mina Shah",
    evidence: "Invoice and vendor match",
    requestedAt: "10:42",
    risk: "success" as const,
    sla: "1h 12m",
    tenant: "Northwind Trading",
  },
  {
    amount: "14,310.50",
    approvalId: "AP-10479",
    assignee: "Jon Bell",
    evidence: "Evidence required",
    requestedAt: "10:18",
    risk: "warning" as const,
    sla: "38m",
    tenant: "Aster Foods",
  },
  {
    amount: "122,900.00",
    approvalId: "AP-10471",
    assignee: "Priya N.",
    evidence: "Policy lock",
    requestedAt: "09:51",
    risk: "critical" as const,
    sla: "Past due",
    tenant: "Mercury Parts",
  },
];

const evidence = [
  {
    actor: "Policy engine",
    detail: "Threshold requires second approver before posting.",
    id: "evidence-policy",
    time: "10:18",
    tone: "warning" as const,
  },
  {
    actor: "Mina Shah",
    detail: "Vendor invoice and receiving note attached.",
    id: "evidence-attachment",
    time: "10:42",
    tone: "success" as const,
  },
];

const metrics = [
  {
    id: "risk",
    label: "Risk score",
    value: "72",
    description: "Weighted by SLA, amount, and policy lock.",
    tone: "warning" as const,
  },
  {
    id: "events",
    label: "Audit events",
    value: "18",
    description: "Immutable entries linked to this approval.",
    tone: "info" as const,
  },
];

const searchGroups = [
  {
    heading: "Approvals",
    items: [
      {
        description: "Evidence required / SLA 38m",
        id: "cmd-ap-10479",
        keywords: ["approval", "aster", "sla"],
        title: "AP-10479",
        tone: "warning" as const,
      },
      {
        description: "Ready to post",
        id: "cmd-ap-10482",
        keywords: ["approval", "northwind", "ready"],
        title: "AP-10482",
        tone: "success" as const,
      },
    ],
  },
];

export const AdvancedOperations: Story = {
  render: () => (
    <main className="grid w-[min(1040px,calc(100vw-32px))] min-w-0 gap-4">
      <ApprovalQueueBlock
        actions={
          <Button size="sm" variant="primary">
            <ShieldCheckIcon aria-hidden="true" className="size-4" />
            Approve ready
          </Button>
        }
        rows={rows}
      />
      <section className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <RiskEvidencePanel
          evidence={evidence}
          metrics={metrics}
          progress={{
            label: "Evidence completeness",
            value: 68,
            tone: "warning",
          }}
        />
        <CommandSearchBlock groups={searchGroups} />
      </section>
    </main>
  ),
};

export const ShellAndEditor: Story = {
  render: () => (
    <main className="w-[min(1120px,calc(100vw-32px))] min-w-0">
      <OperationalDashboardShell
        actions={
          <Button size="sm" variant="primary">
            <ShieldCheckIcon aria-hidden="true" className="size-4" />
            Commit batch
          </Button>
        }
        description="Tenant-scoped controls for approvals, policy locks, and audit evidence."
        filters={
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <Input
              aria-label="Search current workspace"
              className="max-w-72"
              placeholder="Search tenant, owner, approval..."
            />
            <Button size="sm" variant="secondary">
              June close
            </Button>
            <Button size="sm" variant="quiet">
              UTC+07
            </Button>
          </div>
        }
        meta={[
          { id: "tenant", label: "Northwind Trading" },
          { id: "period", label: "June close" },
        ]}
        nav={[
          {
            active: true,
            icon: <ClipboardCheckIcon aria-hidden="true" className="size-4" />,
            label: "Approvals",
          },
          {
            icon: <FileTextIcon aria-hidden="true" className="size-4" />,
            label: "Evidence",
          },
          {
            icon: <UsersIcon aria-hidden="true" className="size-4" />,
            label: "Owners",
          },
        ]}
        status={{ label: "Controlled", tone: "success" }}
        tabs={[
          {
            content: (
              <RecordEditorBlock
                actions={
                  <>
                    <Button size="sm" variant="secondary">
                      Save draft
                    </Button>
                    <Button size="sm" variant="quiet">
                      Discard
                    </Button>
                  </>
                }
                description="Autosave-ready field groups with conflict and offline state coverage."
                lastSavedAt="10:48"
                saveState="saved"
                status={{ label: "Policy locked", tone: "warning" }}
                title="Approval record"
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <label
                    className="grid gap-1 text-[13px] text-text-secondary"
                    htmlFor="advanced-editor-owner"
                  >
                    Owner
                    <Input
                      defaultValue="Mina Shah"
                      id="advanced-editor-owner"
                    />
                  </label>
                  <label
                    className="grid gap-1 text-[13px] text-text-secondary"
                    htmlFor="advanced-editor-amount"
                  >
                    Posting amount
                    <Input
                      defaultValue="86,420.00"
                      id="advanced-editor-amount"
                      inputMode="decimal"
                    />
                  </label>
                  <label
                    className="grid gap-1 text-[13px] text-text-secondary sm:col-span-2"
                    htmlFor="advanced-editor-evidence"
                  >
                    Evidence note
                    <Input
                      defaultValue="Vendor invoice and receiving note attached."
                      id="advanced-editor-evidence"
                    />
                  </label>
                </div>
              </RecordEditorBlock>
            ),
            count: 3,
            label: "Record",
            value: "record",
          },
          {
            content: <ApprovalQueueBlock rows={rows} />,
            count: rows.length,
            label: "Queue",
            value: "queue",
          },
        ]}
        title="Approval control center"
      />
    </main>
  ),
};
