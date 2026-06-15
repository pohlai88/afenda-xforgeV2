import {
  ReversibleBulkActionBar,
  RuntimeStateBlock,
  SaveStateStrip,
  SlaRiskEscalationPanel,
} from "@repo/design-system/design-system";
import type { Meta, StoryObj } from "@storybook/react";
import {
  AlertTriangleIcon,
  RefreshCcwIcon,
  ShieldCheckIcon,
} from "lucide-react";

import { layoutStoryParameters } from "../../.storybook/essentials";

const meta = {
  title: "Blocks/Advanced/ERP State Patterns",
  tags: ["autodocs", "block"],
  parameters: {
    ...layoutStoryParameters,
    layout: "centered",
    docs: {
      description: {
        component:
          "Phase 2 ERP state patterns for runtime state, autosave/conflict handling, SLA escalation, and reversible bulk actions.",
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const runtimeStates = [
  {
    blockId: "state-loading",
    state: "loading" as const,
    title: "Loading payroll rules",
    description:
      "Fetching tenant policy, approval thresholds, and current lock state.",
  },
  {
    blockId: "state-empty",
    state: "empty" as const,
    title: "No exceptions",
    description:
      "All records in this period have posted or moved to audit archive.",
  },
  {
    blockId: "state-error",
    state: "error" as const,
    title: "Sync failed",
    description: "Vendor evidence could not be loaded from the policy service.",
    actions: [
      {
        key: "retry-sync",
        label: "Retry",
        icon: <RefreshCcwIcon aria-hidden="true" />,
        variant: "secondary" as const,
      },
    ],
  },
  {
    blockId: "state-readonly",
    state: "readonly" as const,
    title: "Read-only close period",
    description:
      "June close is locked. Changes require an approved adjustment.",
  },
  {
    blockId: "state-forbidden",
    state: "forbidden" as const,
    title: "Permission required",
    description: "Approval policy is restricted to finance administrators.",
    actions: [
      {
        key: "request-access",
        label: "Request access",
        icon: <ShieldCheckIcon aria-hidden="true" />,
        permission: "approval.policy.requestAccess",
        variant: "secondary" as const,
      },
    ],
  },
];

export const RuntimeStates: Story = {
  render: () => (
    <main className="grid w-[min(920px,calc(100vw-32px))] min-w-0 gap-3">
      {runtimeStates.map((item) => (
        <RuntimeStateBlock
          actions={item.actions}
          blockId={item.blockId}
          description={item.description}
          key={item.blockId}
          state={item.state}
          title={item.title}
        />
      ))}
    </main>
  ),
};

export const AutosaveConflictFlow: Story = {
  render: () => (
    <main className="grid w-[min(920px,calc(100vw-32px))] min-w-0 gap-3">
      <SaveStateStrip
        blockId="save-saving"
        lastSavedAt="10:42:18"
        saveState="saving"
      />
      <SaveStateStrip
        blockId="save-offline"
        detail="Three edits are queued locally. Posting actions are paused."
        lastSavedAt="10:39:04"
        saveState="offline"
      />
      <SaveStateStrip
        actions={[
          {
            key: "review-conflict",
            label: "Review conflict",
            icon: <AlertTriangleIcon aria-hidden="true" />,
            variant: "secondary",
          },
        ]}
        blockId="save-conflict"
        lastSavedAt="10:41:52"
        saveState="conflict"
      />
    </main>
  ),
};

export const SlaEscalation: Story = {
  render: () => (
    <main className="grid w-[min(920px,calc(100vw-32px))] min-w-0 gap-4">
      <SlaRiskEscalationPanel
        actions={[
          {
            key: "escalate-owner",
            label: "Escalate",
            icon: <AlertTriangleIcon aria-hidden="true" />,
            permission: "approval.escalate",
            reason: "SLA breach requires supervisor notification.",
            variant: "primary",
          },
        ]}
        blockId="sla-ap-10471"
        description="Approval batch AP-10471 is past SLA and blocked by missing vendor evidence."
        dueAt="10:30 UTC+07"
        evidence={[
          { id: "owner", label: "Owner", value: "Priya N." },
          { id: "tenant", label: "Tenant", value: "Mercury Parts" },
          { id: "policy", label: "Policy", value: "AP-7.4" },
        ]}
        progress={100}
        riskLevel="breach"
        slaLabel="Past due"
        title="SLA escalation"
      />
    </main>
  ),
};

export const ReversibleBulkConfirmation: Story = {
  render: () => (
    <main className="grid w-[min(920px,calc(100vw-32px))] min-w-0 gap-3">
      <ReversibleBulkActionBar
        actionLabel="Archive selected approvals"
        blockId="bulk-confirm"
        mode="confirming"
        selectedCount={18}
        summary="Archive is reversible for 15 minutes and writes an audit event for each approval."
      />
      <ReversibleBulkActionBar
        actionLabel="Archive selected approvals"
        blockId="bulk-applied"
        mode="applied"
        selectedCount={18}
      />
    </main>
  ),
};
