import {
  AuditSafeDestructiveAction,
  PermissionActionToolbar,
} from "@repo/design-system/design-system";
import type { Meta, StoryObj } from "@storybook/react";
import {
  ArchiveIcon,
  DownloadIcon,
  LockIcon,
  ShieldCheckIcon,
  Trash2Icon,
} from "lucide-react";

import { layoutStoryParameters } from "../../.storybook/essentials";

const meta = {
  title: "Blocks/Operator/Permission",
  tags: ["autodocs", "block"],
  parameters: {
    ...layoutStoryParameters,
    layout: "centered",
    docs: {
      description: {
        component:
          "Permission-aware action blocks for governed ERP workspaces. Actions expose role, permission, capability, disabled reason, and audit metadata.",
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const permissionActions = [
  {
    key: "export-ledger",
    label: "Export ledger",
    icon: <DownloadIcon aria-hidden="true" />,
    variant: "quiet" as const,
    capability: "ledger.export",
    permission: "finance.ledger.read",
    roles: ["operator", "manager", "auditor"],
  },
  {
    key: "approve-batch",
    label: "Approve batch",
    icon: <ShieldCheckIcon aria-hidden="true" />,
    variant: "primary" as const,
    capability: "posting.approve",
    permission: "finance.posting.approve",
    reason: "Requires manager approval for batches above threshold.",
    roles: ["manager"],
  },
  {
    key: "lock-policy",
    label: "Lock policy",
    icon: <LockIcon aria-hidden="true" />,
    capability: "policy.lock",
    permission: "policy.lock.write",
    roles: ["manager", "auditor"],
  },
  {
    key: "archive-tenant",
    label: "Archive tenant",
    icon: <ArchiveIcon aria-hidden="true" />,
    capability: "tenant.archive",
    permission: "tenant.archive.write",
    reason: "Tenant has open posting batches.",
    roles: ["admin"],
    disabled: true,
  },
];

export const RoleScopedToolbar: Story = {
  render: () => (
    <main className="grid w-[min(880px,calc(100vw-32px))] min-w-0 gap-4">
      <PermissionActionToolbar
        actions={permissionActions}
        blockId="approval-actions"
        currentRole="operator"
        description="Toolbar actions are evaluated against role scope while preserving capability and permission metadata for audit tracing."
        summary="4 actions / 1 available"
        title="Approval action policy"
      />
    </main>
  ),
};

export const AuditSafeDestructive: Story = {
  render: () => (
    <main className="grid w-[min(760px,calc(100vw-32px))] min-w-0 gap-4">
      <AuditSafeDestructiveAction
        action={{
          key: "void-posting-batch",
          label: "Void batch",
          icon: <Trash2Icon aria-hidden="true" />,
          capability: "posting.void",
          permission: "finance.posting.void",
          auditEvent: "posting.batch.void_requested",
          auditScope: "BATCH-2026-06-18",
          confirmationLabel: "Type VOID-BATCH to continue",
          roles: ["manager"],
        }}
        blockId="void-batch-guard"
        currentRole="operator"
        description="Destructive posting changes must declare an audit event and remain disabled for roles outside the required approval scope."
        evidence={[
          {
            id: "batch",
            label: "Batch",
            value: "BATCH-2026-06-18",
            mono: true,
          },
          {
            id: "records",
            label: "Records affected",
            value: "284",
            mono: true,
          },
          {
            id: "permission",
            label: "Permission",
            value: "finance.posting.void",
            mono: true,
          },
          {
            id: "audit-event",
            label: "Audit event",
            value: "posting.batch.void_requested",
            mono: true,
          },
        ]}
        title="Void posting batch"
      />
    </main>
  ),
};
