import { EyeIcon } from "lucide-react"
import type { Meta, StoryObj } from "@storybook/react"

import { Toggle } from "@repo/design-system/components/afenda-ui/toggle"

const meta = {
  title: "Afenda UI/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Toggle previewed as a toolbar control, not a standalone decoration.",
      },
    },
  },
} satisfies Meta<typeof Toggle>

export default meta

type Story = StoryObj<typeof meta>

export const ToolbarControl: Story = {
  render: () => (
    <div className="flex w-[420px] items-center justify-between rounded-[var(--card-radius)] border border-border-default bg-surface-raised p-3 shadow-panel">
      <div className="grid gap-1">
        <span className="text-[13px] font-medium text-text-primary">
          Audit columns
        </span>
        <span className="text-[12px] text-text-secondary">
          Show or hide supporting evidence fields.
        </span>
      </div>
      <Toggle aria-label="Toggle audit visibility" defaultPressed>
        <EyeIcon />
        Details
      </Toggle>
    </div>
  ),
}
