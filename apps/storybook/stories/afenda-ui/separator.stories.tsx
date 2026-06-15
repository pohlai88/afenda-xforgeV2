import type { Meta, StoryObj } from "@storybook/react"

import { Separator } from "@repo/design-system/components/afenda-ui/separator"

const meta = {
  title: "Afenda UI/Separator",
  component: Separator,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Separator>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-surface-muted p-6">
      <div className="mx-auto max-w-3xl rounded-lg border border-border-default bg-surface-raised p-4 text-[13px] text-text-primary">
        <div className="grid gap-1">
          <span className="text-[12px] font-medium uppercase tracking-wide text-text-secondary">
            Payroll summary
          </span>
          <span className="font-medium">Northwind Trading · June close</span>
        </div>
        <Separator className="my-3" />
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-text-secondary">Gross payroll</p>
            <p className="font-medium tabular-nums">$482,180</p>
          </div>
          <div>
            <p className="text-text-secondary">Exceptions</p>
            <p className="font-medium tabular-nums">7</p>
          </div>
          <div>
            <p className="text-text-secondary">Last calculated</p>
            <p className="font-medium tabular-nums">09:42</p>
          </div>
        </div>
        <Separator className="my-3" />
        <div className="flex items-center justify-between text-text-secondary">
          <span>Audit packet AP-2048</span>
          <span>Retain 7 years</span>
        </div>
    </div>
    </div>
  ),
}
