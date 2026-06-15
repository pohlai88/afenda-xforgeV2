import { Badge } from "@repo/design-system/components/afenda-ui/badge";
import { Button } from "@repo/design-system/components/afenda-ui/button";
import { Checkbox } from "@repo/design-system/components/afenda-ui/checkbox";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@repo/design-system/components/afenda-ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/design-system/components/afenda-ui/table";
import {
  AuditTrailPanel,
  BulkActionBar,
  DataTableShell,
  EntitySummaryPanel,
  StatusTimeline,
} from "@repo/design-system/components/blocks";
import type { Meta, StoryObj } from "@storybook/react";
import {
  ArchiveIcon,
  CheckIcon,
  DownloadIcon,
  FileClockIcon,
  HistoryIcon,
  LockIcon,
  MoreHorizontalIcon,
  ShieldCheckIcon,
} from "lucide-react";

import { layoutStoryParameters } from "../../.storybook/essentials";

const meta = {
  title: "Blocks/Operator",
  tags: ["autodocs", "block"],
  parameters: {
    ...layoutStoryParameters,
    layout: "centered",
    docs: {
      description: {
        component:
          "Core operator blocks for dense ERP workspaces. These blocks compose afenda-ui primitives and keep domain state outside the design-system layer.",
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const approvalRows = [
  {
    id: "AP-10482",
    tenant: "Northwind Trading",
    owner: "Mina Shah",
    amount: "86,420.00",
    status: "Ready",
    tone: "positive" as const,
    sla: "1h 12m",
  },
  {
    id: "AP-10479",
    tenant: "Aster Foods",
    owner: "Jon Bell",
    amount: "14,310.50",
    status: "SLA watch",
    tone: "warning" as const,
    sla: "38m",
  },
  {
    id: "AP-10471",
    tenant: "Mercury Parts",
    owner: "Priya N.",
    amount: "122,900.00",
    status: "Locked",
    tone: "critical" as const,
    sla: "Past due",
  },
  {
    id: "AP-10468",
    tenant: "Union Medical",
    owner: "Sam Keane",
    amount: "9,814.75",
    status: "Review",
    tone: "info" as const,
    sla: "3h 04m",
  },
];

const entityFields = [
  {
    id: "entity-id",
    label: "Approval ID",
    value: "AP-10479",
    meta: "June close / AP batch 18",
    mono: true,
  },
  {
    id: "tenant",
    label: "Tenant",
    value: "Aster Foods",
    meta: "Thailand operating unit",
  },
  {
    id: "exposure",
    label: "Exposure",
    value: "14,310.50",
    meta: "THB, vendor invoice",
    mono: true,
    tone: "warning" as const,
  },
  {
    id: "control",
    label: "Control state",
    value: "Evidence required",
    meta: "Policy AP-7.4",
    tone: "info" as const,
  },
];

const auditEvents = [
  {
    id: "audit-3842",
    time: "10:42:31",
    actor: "Mina Shah",
    action: "attached evidence to",
    target: "AP-10479",
    outcome: "Captured",
    tone: "positive" as const,
  },
  {
    id: "audit-3838",
    time: "10:18:04",
    actor: "Policy engine",
    action: "flagged SLA risk for",
    target: "Aster Foods",
    outcome: "Watch",
    tone: "warning" as const,
  },
  {
    id: "audit-3819",
    time: "09:51:20",
    actor: "Jon Bell",
    action: "requested approver change on",
    target: "AP batch 18",
    outcome: "Queued",
    tone: "info" as const,
  },
];

const timelineItems = [
  {
    id: "submitted",
    label: "Submitted by AP operator",
    description:
      "Invoice metadata, tenant scope, and vendor reference passed schema checks.",
    time: "09:45",
    tone: "positive" as const,
    meta: "Record lock started",
  },
  {
    id: "policy",
    label: "Policy engine review",
    description:
      "Threshold and vendor-risk rules require evidence before approval.",
    time: "10:18",
    tone: "warning" as const,
    meta: "AP-7.4 / Evidence required",
  },
  {
    id: "approval",
    label: "Approval pending",
    description: "Primary approver can post after evidence review is complete.",
    time: "Now",
    tone: "info" as const,
    meta: "SLA 38m remaining",
  },
];

export const DataTableQueue: Story = {
  render: () => (
    <main className="grid w-[min(1040px,calc(100vw-32px))] min-w-0 gap-4">
      <DataTableShell
        actions={[
          {
            key: "export",
            label: "Export",
            icon: <DownloadIcon aria-hidden="true" />,
            variant: "quiet",
          },
          {
            key: "post-ready",
            label: "Post ready",
            icon: <CheckIcon aria-hidden="true" />,
            variant: "primary",
            permission: "approval.post",
          },
        ]}
        bulkActions={
          <BulkActionBar
            actions={[
              {
                key: "approve",
                label: "Approve",
                icon: <ShieldCheckIcon aria-hidden="true" />,
                variant: "secondary",
                capability: "approval.approve",
              },
              {
                key: "archive",
                label: "Archive",
                icon: <ArchiveIcon aria-hidden="true" />,
                variant: "quiet",
              },
            ]}
            label="2 approvals selected"
            selectedCount={2}
          />
        }
        description="Review tenant-scoped approval records before posting batch changes."
        footer="Showing 4 of 128 approvals"
        pagination={<OperatorPagination />}
        selectedCount={2}
        status={{ label: "SLA watch", tone: "warning" }}
        title="Approval queue"
        toolbar={
          <>
            <Badge tone="warning" variant="outline">
              SLA &lt; 4h
            </Badge>
            <Badge tone="neutral" variant="outline">
              Tenant scoped
            </Badge>
            <Button size="sm" variant="quiet">
              <MoreHorizontalIcon aria-hidden="true" className="size-4" />
              Columns
            </Button>
          </>
        }
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox aria-label="Select all approvals" defaultChecked />
              </TableHead>
              <TableHead>Approval</TableHead>
              <TableHead>Tenant</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">SLA</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {approvalRows.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Checkbox
                    aria-label={`Select ${row.id}`}
                    defaultChecked={index < 2}
                  />
                </TableCell>
                <TableCell className="font-mono tabular-nums">
                  {row.id}
                </TableCell>
                <TableCell>{row.tenant}</TableCell>
                <TableCell>{row.owner}</TableCell>
                <TableCell className="text-right font-mono tabular-nums">
                  {row.amount}
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1.5 text-[12px] leading-5">
                    <span
                      aria-hidden="true"
                      className={`size-1.5 rounded-full ${statusDotClassName[row.tone]}`}
                    />
                    {row.status}
                  </span>
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums">
                  {row.sla}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DataTableShell>
    </main>
  ),
};

export const EntityOperations: Story = {
  render: () => (
    <main className="grid w-[min(1040px,calc(100vw-32px))] min-w-0 gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <div className="grid min-w-0 gap-4">
        <EntitySummaryPanel
          actions={[
            {
              key: "lock",
              label: "Lock",
              icon: <LockIcon aria-hidden="true" />,
              variant: "quiet",
              permission: "approval.lock",
            },
          ]}
          description="Operational metadata for the selected approval record."
          fields={entityFields}
          status={{ label: "Evidence required", tone: "warning" }}
          title="Approval summary"
        />
        <StatusTimeline
          actions={[
            {
              key: "history",
              label: "History",
              icon: <HistoryIcon aria-hidden="true" />,
              variant: "quiet",
            },
          ]}
          description="Current workflow position and control gates."
          items={timelineItems}
          title="Status timeline"
        />
      </div>
      <AuditTrailPanel
        actions={[
          {
            key: "audit-log",
            label: "Audit log",
            icon: <FileClockIcon aria-hidden="true" />,
            variant: "quiet",
          },
        ]}
        description="Immutable record of operator and policy-engine activity."
        events={auditEvents}
        title="Audit trail"
      />
    </main>
  ),
};

function OperatorPagination() {
  return (
    <Pagination className="mx-0 w-auto justify-start sm:justify-end">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

const statusDotClassName = {
  critical: "bg-danger",
  info: "bg-info",
  positive: "bg-success",
  warning: "bg-warning",
} as const;
