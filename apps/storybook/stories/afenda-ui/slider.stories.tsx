import type { Meta, StoryObj } from "@storybook/react"

import { Badge } from "@repo/design-system/components/afenda-ui/badge"
import { Slider } from "@repo/design-system/components/afenda-ui/slider"

const meta = {
  title: "Afenda UI/Slider",
  component: Slider,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Slider previewed as a governed threshold control with visible context.",
      },
    },
  },
} satisfies Meta<typeof Slider>

export default meta

type Story = StoryObj<typeof meta>

export const RiskThreshold: Story = {
  render: () => (
    <section className="grid w-[460px] gap-4 rounded-[var(--card-radius)] border border-border-default bg-surface-raised p-4 shadow-panel">
      <div className="flex items-start justify-between gap-3">
        <div className="grid gap-1">
          <h2 className="text-[14px] font-semibold text-text-primary">
            Risk threshold
          </h2>
          <p className="text-[12px] text-text-secondary">
            Flag requests above this score for secondary review.
          </p>
        </div>
        <Badge tone="warning" variant="outline">
          64%
        </Badge>
      </div>
      <Slider
        aria-label="Risk threshold"
        defaultValue={[64]}
        max={100}
        step={1}
      />
      <div className="flex justify-between text-[12px] text-text-secondary">
        <span>Low</span>
        <span>Manual review</span>
        <span>Critical</span>
      </div>
    </section>
  ),
}
