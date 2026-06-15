import { Badge } from "@repo/design-system/components/afenda-ui/badge"
import type { Meta, StoryObj } from "@storybook/react"
import {
  CheckIcon,
  InfoIcon,
  ShieldAlertIcon,
  ShieldCheckIcon,
  XCircleIcon,
} from "lucide-react"

import { afendaBadgeArgTypes } from "../../.storybook/args"
import { matrixStoryParameters } from "../../.storybook/essentials"

const meta = {
  title: "Afenda UI/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: afendaBadgeArgTypes,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Afenda badge primitive. Neutral by default, semantic when it needs to communicate operational state.",
      },
    },
  },
  args: {
    children: "Ready",
  },
} satisfies Meta<typeof Badge>

export default meta

type Story = StoryObj<typeof meta>

export const Neutral: Story = {}

export const Info: Story = {
  args: {
    tone: "info",
    children: (
      <>
        <InfoIcon className="size-3" />
        Needs review
      </>
    ),
  },
}

export const Success: Story = {
  args: {
    tone: "positive",
    children: (
      <>
        <ShieldCheckIcon className="size-3" />
        Approved
      </>
    ),
  },
}

export const Warning: Story = {
  args: {
    tone: "warning",
    variant: "solid",
    children: (
      <>
        <ShieldAlertIcon className="size-3" />
        Pending approval
      </>
    ),
  },
}

export const Danger: Story = {
  args: {
    tone: "critical",
    variant: "solid",
    children: (
      <>
        <XCircleIcon className="size-3" />
        Blocked
      </>
    ),
  },
}

export const Outline: Story = {
  args: {
    variant: "outline",
    tone: "neutral",
    children: "Read only",
  },
}

export const Solid: Story = {
  args: {
    tone: "critical",
    variant: "solid",
    children: "Escalated",
  },
}

export const StateMatrix: Story = {
  parameters: matrixStoryParameters,
  render: () => (
    <div className="min-h-screen bg-surface p-6">
      <div className="mx-auto max-w-4xl rounded-lg border border-border-default bg-surface-raised p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-wide text-text-primary">
              Queue states
            </p>
            <h3 className="text-[15px] font-semibold text-text-primary">
              Tenant workflow badges
            </h3>
          </div>
          <Badge variant="outline">12 active rules</Badge>
        </div>
        <div className="grid gap-2 text-[13px]">
          {[
            ["NWT-1042", "Payroll close", "Ready", "neutral"],
            ["CTR-8831", "Policy exception", "Needs review", "info"],
            ["BLA-7620", "Invoice export", "Approved", "positive"],
            ["SNT-5521", "SLA remediation", "Pending approval", "warning"],
            ["FBH-2219", "Privileged access", "Blocked", "critical"],
          ].map(([tenant, workflow, state, tone]) => (
            <div
              key={tenant}
              className="grid grid-cols-[100px_1fr_auto] items-center gap-3 rounded-md bg-surface px-3 py-2"
            >
              <span className="tabular-nums text-text-primary">{tenant}</span>
              <span className="text-text-primary">{workflow}</span>
              <Badge
                tone={
                  tone as
                    | "neutral"
                    | "info"
                    | "positive"
                    | "warning"
                    | "critical"
                }
                variant={tone === "neutral" ? "soft" : "solid"}
              >
                {state}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
}
