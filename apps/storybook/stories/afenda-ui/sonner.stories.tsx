import { toast } from "sonner"
import type { Meta, StoryObj } from "@storybook/react"

import { Button } from "@repo/design-system/components/afenda-ui/button"

const meta = {
  title: "Afenda UI/Sonner",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Toast previewed as operational notification only. Toasts report results; they do not carry workflow authority.",
      },
    },
  },
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const OperationalNotification: Story = {
  render: () => (
    <section className="grid w-[460px] gap-3 rounded-[var(--card-radius)] border border-border-default bg-surface-raised p-4 shadow-panel">
      <div className="grid gap-1">
        <h2 className="text-[14px] font-semibold text-text-primary">
          Approval result
        </h2>
        <p className="text-[12px] text-text-secondary">
          Use toast for recoverable status, not audit-critical decisions.
        </p>
      </div>
      <Button
        className="w-fit"
        onClick={() => {
          toast.success("Record approved", {
            description: "Approval status has been saved to the audit trail.",
          })
        }}
      >
        Show notification
      </Button>
    </section>
  ),
}
