import {
  Badge,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/design-system/design-system";
import type { Meta, StoryObj } from "@storybook/react";

import { layoutStoryParameters } from "../../.storybook/essentials";

const meta = {
  title: "Afenda UI/Table",
  component: Table,
  tags: ["autodocs", "afenda-ui", "primitive"],
  parameters: {
    ...layoutStoryParameters,
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Afenda table primitive. Dense, token-driven data presentation for audit logs, admin lists, and operator workflows.",
      },
    },
  },
} satisfies Meta<typeof Table>;

export default meta;

type Story = StoryObj<typeof meta>;

const rows = [
  {
    tenant: "NWT-1042",
    name: "Northwind Trading",
    owner: "Jordan Lee",
    status: "Active",
    risk: "Medium",
    sla: "43m",
    updated: "09:48",
  },
  {
    tenant: "CTR-8831",
    name: "Contoso Retail",
    owner: "Maya Chen",
    status: "Pending",
    risk: "High",
    sla: "12m",
    updated: "09:41",
  },
  {
    tenant: "FBH-2219",
    name: "Fabrikam Health",
    owner: "Omar Ali",
    status: "Locked",
    risk: "Critical",
    sla: "Breached",
    updated: "08:59",
  },
];

const statusToneClassName: Record<string, string> = {
  Active: "bg-success",
  Critical: "bg-danger",
  High: "bg-warning",
  Locked: "bg-danger",
  Medium: "bg-warning",
  Pending: "bg-warning",
  Success: "bg-success",
  Warning: "bg-warning",
};

function DotStatus({ label }: { readonly label: string }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-1.5 text-[12px] text-text-primary leading-5">
      <span
        aria-hidden="true"
        className={`size-1.5 shrink-0 rounded-full ${
          statusToneClassName[label] ?? "bg-text-tertiary"
        }`}
      />
      <span className="truncate">{label}</span>
    </span>
  );
}

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-surface p-4">
      <div className="mx-auto grid w-[min(100%,64rem)] gap-3 rounded-[var(--card-radius)] border border-border-default bg-surface-raised p-3">
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="font-medium text-[12px] text-text-secondary leading-4">
              Tenant control
            </p>
            <h3 className="font-semibold text-[15px] text-text-primary">
              Live workspace risk register
            </h3>
          </div>
          <Badge variant="outline">Asia/Singapore queue</Badge>
        </div>
        <Table>
          <TableCaption className="text-text-primary">
            Records sync every 90 seconds from tenant audit and SLA services.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px] text-text-primary">
                Tenant ID
              </TableHead>
              <TableHead className="text-text-primary">Workspace</TableHead>
              <TableHead className="text-text-primary">Owner</TableHead>
              <TableHead className="text-text-primary">Status</TableHead>
              <TableHead className="text-text-primary">Risk</TableHead>
              <TableHead className="text-right text-text-primary">
                SLA left
              </TableHead>
              <TableHead className="text-right text-text-primary">
                Updated
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow
                data-state={index === 1 ? "selected" : undefined}
                key={row.tenant}
              >
                <TableCell className="font-medium tabular-nums">
                  {row.tenant}
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.owner}</TableCell>
                <TableCell>
                  <DotStatus label={row.status} />
                </TableCell>
                <TableCell>
                  <DotStatus label={row.risk} />
                </TableCell>
                <TableCell className="text-right text-text-primary tabular-nums">
                  {row.sla}
                </TableCell>
                <TableCell className="text-right text-text-primary tabular-nums">
                  {row.updated}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  ),
};

export const DenseAudit: Story = {
  render: () => (
    <div className="min-h-screen bg-surface p-4">
      <div className="mx-auto w-[min(100%,64rem)] rounded-[var(--card-radius)] border border-border-default bg-surface p-2">
        <Table variant="plain">
          <TableCaption className="text-text-primary">
            Immutable audit trail for payroll close operations.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px] text-text-primary">
                Event
              </TableHead>
              <TableHead className="text-text-primary">Actor</TableHead>
              <TableHead className="text-text-primary">Tenant</TableHead>
              <TableHead className="text-text-primary">Resource</TableHead>
              <TableHead className="text-text-primary">Outcome</TableHead>
              <TableHead className="text-right text-text-primary">
                Time
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              [
                "Approval granted",
                "Jordan Lee",
                "NWT-1042",
                "Expense policy",
                "Success",
                "09:41",
              ],
              [
                "Role changed",
                "Maya Chen",
                "CTR-8831",
                "Payroll export",
                "Warning",
                "09:38",
              ],
              [
                "Access revoked",
                "Omar Ali",
                "FBH-2219",
                "Tenant admin",
                "Critical",
                "09:12",
              ],
            ].map(([event, user, tenant, resource, outcome, time], index) => (
              <TableRow
                data-state={index === 0 ? "selected" : undefined}
                key={`${event}-${time}`}
              >
                <TableCell className="font-medium">{event}</TableCell>
                <TableCell>{user}</TableCell>
                <TableCell className="font-mono text-text-primary tabular-nums">
                  {tenant}
                </TableCell>
                <TableCell>{resource}</TableCell>
                <TableCell>
                  <DotStatus label={outcome} />
                </TableCell>
                <TableCell className="text-right text-text-primary tabular-nums">
                  {time}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  ),
};
