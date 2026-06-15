import type { Meta, StoryObj } from "@storybook/react"
import { ChevronRightIcon, ShieldCheckIcon } from "lucide-react"

import { Badge } from "@repo/design-system/components/afenda-ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/afenda-ui/card"
import { Button } from "@repo/design-system/components/afenda-ui/button"

const meta = {
  title: "Afenda UI/Card",
  component: Card,
  subcomponents: {
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
    CardAction,
  },
  tags: ["autodocs"],
  globals: {
    backgrounds: { value: "surface" },
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Afenda card primitive. Raised, token-driven, and compact enough for operator dashboards, metadata panels, and approval surfaces.",
      },
    },
  },
} satisfies Meta<typeof Card>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-surface-muted p-6">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-3 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <div className="grid gap-1.5">
              <CardTitle>Northwind Trading</CardTitle>
              <CardDescription>
                Tenant NWT-1042 · Payroll close command center
              </CardDescription>
            </div>
            <CardAction>
              <Badge tone="info">Live sync</Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-3 gap-3">
              {[
                ["Open tasks", "12"],
                ["Audit holds", "3"],
                ["SLA left", "43m"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-md border border-border-default bg-surface px-3 py-2"
                >
                  <span className="text-[12px] text-text-secondary">
                    {label}
                  </span>
                  <strong className="block text-[20px] leading-tight tabular-nums text-text-primary">
                    {value}
                  </strong>
                </div>
              ))}
            </div>
            <div className="rounded-md border border-border-default bg-surface-muted px-3 py-2 text-[13px] text-text-primary">
              Next required action: approve overtime variance for warehouse
              shift B before payroll lock at 11:00.
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            <span className="text-[12px] text-text-secondary">
              Updated 09:48 by Jordan Lee
            </span>
            <Button size="sm" variant="secondary">
              Review queue
              <ChevronRightIcon className="size-4" />
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Control posture</CardTitle>
            <CardDescription>Current policy and tenant safeguards</CardDescription>
            <CardAction>
              <ShieldCheckIcon className="size-4 text-text-secondary" />
            </CardAction>
          </CardHeader>
          <CardContent className="grid gap-2 text-[13px]">
            {[
              ["MFA coverage", "98.4%", "positive"],
              ["Privileged users", "7", "neutral"],
              ["Policy exceptions", "2", "warning"],
            ].map(([label, value, tone]) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-md bg-surface-muted px-3 py-2"
              >
                <span className="text-text-secondary">{label}</span>
                <Badge
                  tone={tone as "positive" | "neutral" | "warning"}
                  variant="outline"
                >
                  {value}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  ),
}

export const WithAction: Story = {
  render: () => (
    <div className="min-h-screen bg-surface-muted p-6">
      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <div className="grid gap-1.5">
            <CardTitle>Approval queue</CardTitle>
            <CardDescription>
              Governance requests grouped by remaining SLA.
            </CardDescription>
          </div>
          <CardAction>
            <ShieldCheckIcon className="size-4 text-text-secondary" />
          </CardAction>
        </CardHeader>
        <CardContent className="grid gap-2">
          {[
            ["Expense policy exception", "NWT-1042", "12m", "warning"],
            ["Export permission renewal", "CTR-8831", "28m", "neutral"],
            ["Emergency admin elevation", "FBH-2219", "Breached", "critical"],
          ].map(([request, tenant, sla, tone]) => (
            <div
              key={request}
              className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-md border border-border-default bg-surface px-3 py-2 text-[13px]"
            >
              <span className="font-medium text-text-primary">{request}</span>
              <span className="tabular-nums text-text-secondary">{tenant}</span>
              <Badge
                tone={tone as "warning" | "neutral" | "critical"}
                variant={tone === "critical" ? "solid" : "outline"}
              >
                {sla}
              </Badge>
            </div>
          ))}
        </CardContent>
        <CardFooter className="justify-end">
          <Button size="sm" variant="quiet">
            View all
          </Button>
        </CardFooter>
      </Card>
    </div>
  ),
}
