import type { Meta, StoryObj } from "@storybook/react"

import { Button } from "@repo/design-system/components/afenda-ui/button"
import {
  ButtonGroup,
  ButtonGroupText,
} from "@repo/design-system/components/afenda-ui/button-group"

type QueueAction = {
  label: string
  variant?: "primary" | "secondary" | "quiet" | "destructive" | "link"
}

function QueueActionGroup({
  actions,
  queueLabel,
}: {
  actions: QueueAction[]
  queueLabel: string
}) {
  return (
    <div className="grid w-[560px] gap-3 rounded-[var(--card-radius)] border border-border-default bg-surface-raised p-4 shadow-panel">
      <div className="flex items-start justify-between gap-3">
        <div className="grid gap-1">
          <span className="text-[13px] font-medium text-text-primary">
            Bulk approval actions
          </span>
          <span className="text-[12px] text-text-secondary">
            Grouped actions share one operational context.
          </span>
        </div>
        <ButtonGroupText>{queueLabel}</ButtonGroupText>
      </div>
      <ButtonGroup>
        {actions.map((action) => (
          <Button key={action.label} variant={action.variant ?? "secondary"}>
            {action.label}
          </Button>
        ))}
      </ButtonGroup>
    </div>
  )
}

const meta = {
  title: "Afenda UI/ButtonGroup",
  component: ButtonGroup,
  subcomponents: {
    ButtonGroupText,
  },
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Button group previewed as grouped queue actions with shared border rhythm.",
      },
    },
  },
} satisfies Meta<typeof ButtonGroup>

export default meta

type Story = StoryObj<typeof meta>

export const QueueActions: Story = {
  render: () => (
    <QueueActionGroup
      queueLabel="Queue: 12"
      actions={[
        { label: "Approve", variant: "secondary" },
        { label: "Hold", variant: "secondary" },
        { label: "Assign reviewer", variant: "quiet" },
      ]}
    />
  ),
}

export const PrimaryDecision: Story = {
  render: () => (
    <QueueActionGroup
      queueLabel="Queue: 3"
      actions={[
        { label: "Approve request", variant: "primary" },
        { label: "Edit record", variant: "secondary" },
        { label: "Delete record", variant: "destructive" },
      ]}
    />
  ),
}
