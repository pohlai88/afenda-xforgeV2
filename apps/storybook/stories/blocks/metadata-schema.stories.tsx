import {
  Badge,
  metadataBlockSchema,
  metadataPageSchema,
} from "@repo/design-system";
import type { Meta, StoryObj } from "@storybook/react";

import { layoutStoryParameters } from "../../.storybook/essentials";

const meta = {
  title: "Blocks/Metadata Schema",
  tags: ["autodocs", "block"],
  parameters: {
    ...layoutStoryParameters,
    layout: "centered",
    docs: {
      description: {
        component:
          "Zod-backed metadata contracts for Afenda ERP blocks. The schema is serializable, strict, and rejects anonymous or duplicate block IDs before runtime rendering.",
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const validApprovalPage = {
  pageId: "approval-control-center",
  version: 1,
  blocks: [
    {
      type: "pageHeader",
      blockId: "approval-header",
      density: "compact",
      intent: "approval",
      state: "ready",
      tone: "warning",
      eyebrow: "ERP / Tenant operations",
      title: "Approval control center",
      description:
        "Review tenant-scoped approvals, evidence status, and policy locks before posting operational changes.",
      status: { label: "SLA watch", tone: "warning" },
      meta: [
        { id: "tenant", label: "Northwind Trading" },
        { id: "period", label: "June close" },
      ],
      actions: [
        {
          key: "post-ready",
          actionId: "approval.postReady",
          label: "Post ready",
          iconKey: "shield-check",
          permission: "approval.post",
          capability: "approval:post",
          auditEvent: "approval.post_ready.requested",
          variant: "primary",
        },
      ],
    },
    {
      type: "statsStrip",
      blockId: "approval-stats",
      density: "compact",
      intent: "overview",
      metrics: [
        {
          id: "ready",
          label: "Ready",
          value: {
            source: "approvals",
            path: "summary.ready",
            required: true,
          },
          tone: "success",
        },
        {
          id: "sla-risk",
          label: "SLA risk",
          value: {
            source: "approvals",
            path: "summary.slaRisk",
            fallback: 0,
          },
          tone: "warning",
        },
      ],
    },
    {
      type: "dataTable",
      blockId: "approval-table",
      density: "compact",
      intent: "approval",
      title: "Approval queue",
      data: {
        source: "approvals",
        path: "rows",
        required: true,
      },
      columns: [
        { id: "approval", header: "Approval", accessorKey: "id", kind: "id" },
        { id: "tenant", header: "Tenant", accessorKey: "tenant" },
        {
          id: "amount",
          header: "Amount",
          accessorKey: "amount",
          align: "right",
          kind: "money",
        },
        {
          id: "sla",
          header: "SLA",
          accessorKey: "sla",
          align: "right",
          kind: "status",
          tonePath: "tone",
        },
      ],
      footer: {
        source: "approvals",
        path: "summary.footer",
        fallback: "No rows loaded",
      },
    },
  ],
} as const;

const duplicateBlockPage = {
  ...validApprovalPage,
  blocks: [
    validApprovalPage.blocks[0],
    {
      ...validApprovalPage.blocks[1],
      blockId: validApprovalPage.blocks[0].blockId,
    },
  ],
};

const malformedActionBlock = {
  type: "pageHeader",
  blockId: "malformed-action-header",
  title: "Malformed action",
  actions: [
    {
      label: "Missing key",
      permission: "approval.post",
    },
  ],
};

const duplicateColumnBlock = {
  type: "dataTable",
  blockId: "duplicate-column-table",
  title: "Duplicate column",
  data: {
    source: "approvals",
    path: "rows",
  },
  columns: [
    { id: "approval", header: "Approval", accessorKey: "id" },
    { id: "approval", header: "Approval again", accessorKey: "approvalId" },
  ],
};

export const ValidPageContract: Story = {
  render: () => {
    const result = metadataPageSchema.safeParse(validApprovalPage);

    return (
      <SchemaResultPanel
        details={
          result.success ? validApprovalPage.blocks : result.error.issues
        }
        status={result.success ? "Valid" : "Invalid"}
        title="Approval page metadata"
        tone={result.success ? "success" : "critical"}
      />
    );
  },
};

export const DuplicateBlockIdRejected: Story = {
  render: () => {
    const result = metadataPageSchema.safeParse(duplicateBlockPage);

    return (
      <SchemaResultPanel
        details={result.success ? duplicateBlockPage : result.error.issues}
        status={result.success ? "Valid" : "Rejected"}
        title="Duplicate blockId guard"
        tone={result.success ? "success" : "critical"}
      />
    );
  },
};

export const MalformedActionRejected: Story = {
  render: () => {
    const result = metadataBlockSchema.safeParse(malformedActionBlock);

    return (
      <SchemaResultPanel
        details={result.success ? malformedActionBlock : result.error.issues}
        status={result.success ? "Valid" : "Rejected"}
        title="Governed action guard"
        tone={result.success ? "success" : "critical"}
      />
    );
  },
};

export const DuplicateNestedKeyRejected: Story = {
  render: () => {
    const result = metadataBlockSchema.safeParse(duplicateColumnBlock);

    return (
      <SchemaResultPanel
        details={result.success ? duplicateColumnBlock : result.error.issues}
        status={result.success ? "Valid" : "Rejected"}
        title="Duplicate nested key guard"
        tone={result.success ? "success" : "critical"}
      />
    );
  },
};

function SchemaResultPanel({
  details,
  status,
  title,
  tone,
}: {
  readonly details: unknown;
  readonly status: string;
  readonly title: string;
  readonly tone: "critical" | "success";
}) {
  return (
    <section className="grid w-[min(920px,calc(100vw-32px))] min-w-0 gap-3 rounded-[var(--card-radius)] border border-border-default bg-surface-raised p-4">
      <header className="flex min-w-0 items-start justify-between gap-3">
        <div className="grid min-w-0 gap-1">
          <p className="text-[12px] text-text-secondary leading-4">
            Metadata schema
          </p>
          <h2 className="font-semibold text-[15px] text-text-primary leading-5">
            {title}
          </h2>
        </div>
        <Badge tone={tone} variant="outline">
          {status}
        </Badge>
      </header>
      <pre className="max-h-[420px] overflow-auto rounded-[var(--card-radius)] border border-border-default bg-surface p-3 font-mono text-[12px] text-text-primary leading-5">
        {JSON.stringify(details, null, 2)}
      </pre>
    </section>
  );
}
