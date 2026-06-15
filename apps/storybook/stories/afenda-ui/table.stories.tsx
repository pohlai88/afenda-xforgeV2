import type { Meta, StoryObj } from "@storybook/react"

import { Badge } from "@repo/design-system/components/afenda-ui/badge"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/design-system/components/afenda-ui/table"

import { layoutStoryParameters } from "../../.storybook/essentials"

const meta = {
  title: "Afenda UI/Table",
  component: Table,
  tags: ["autodocs"],
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
} satisfies Meta<typeof Table>

export default meta

type Story = StoryObj<typeof meta>

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
]

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-surface p-6">
      <div className="mx-auto grid max-w-5xl gap-3 rounded-lg border border-border-default bg-surface-raised p-4 shadow-xs">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-wide text-text-primary">
              Tenant control
            </p>
            <h3 className="text-[15px] font-semibold text-text-primary">
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
              <TableHead className="w-[120px] text-text-primary">Tenant ID</TableHead>
              <TableHead className="text-text-primary">Workspace</TableHead>
              <TableHead className="text-text-primary">Owner</TableHead>
              <TableHead className="text-text-primary">Status</TableHead>
              <TableHead className="text-text-primary">Risk</TableHead>
              <TableHead className="text-right text-text-primary">SLA left</TableHead>
              <TableHead className="text-right text-text-primary">Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow
                key={row.tenant}
                data-state={index === 1 ? "selected" : undefined}
              >
                <TableCell className="font-medium tabular-nums">
                  {row.tenant}
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.owner}</TableCell>
                <TableCell>
                  <Badge
                    tone={
                      row.status === "Active"
                        ? "positive"
                        : row.status === "Pending"
                          ? "warning"
                          : "critical"
                    }
                    variant="solid"
                  >
                    {row.status}
                  </Badge>
                </TableCell>
                <TableCell>{row.risk}</TableCell>
                <TableCell className="text-right tabular-nums text-text-primary">
                  {row.sla}
                </TableCell>
                <TableCell className="text-right tabular-nums text-text-primary">
                  {row.updated}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  ),
}

export const DenseAudit: Story = {
  render: () => (
    <div className="min-h-screen bg-surface p-6">
      <div className="mx-auto max-w-5xl rounded-lg border border-border-default bg-surface p-3">
        <Table variant="plain">
          <TableCaption className="text-text-primary">
            Immutable audit trail for payroll close operations.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px] text-text-primary">Event</TableHead>
              <TableHead className="text-text-primary">Actor</TableHead>
              <TableHead className="text-text-primary">Tenant</TableHead>
              <TableHead className="text-text-primary">Resource</TableHead>
              <TableHead className="text-text-primary">Outcome</TableHead>
              <TableHead className="text-right text-text-primary">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              ["Approval granted", "Jordan Lee", "NWT-1042", "Expense policy", "Success", "09:41"],
              ["Role changed", "Maya Chen", "CTR-8831", "Payroll export", "Warning", "09:38"],
              ["Access revoked", "Omar Ali", "FBH-2219", "Tenant admin", "Critical", "09:12"],
            ].map(([event, user, tenant, resource, outcome, time], index) => (
              <TableRow
                key={`${event}-${time}`}
                data-state={index === 0 ? "selected" : undefined}
              >
                <TableCell className="font-medium">{event}</TableCell>
                <TableCell>{user}</TableCell>
                <TableCell className="tabular-nums text-text-primary">
                  {tenant}
                </TableCell>
                <TableCell>{resource}</TableCell>
                <TableCell>
                  <Badge
                    tone={
                      outcome === "Success"
                        ? "positive"
                        : outcome === "Warning"
                          ? "warning"
                          : "critical"
                    }
                    variant="solid"
                  >
                    {outcome}
                  </Badge>
                </TableCell>
                <TableCell className="text-right tabular-nums text-text-primary">
                  {time}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  ),
}
