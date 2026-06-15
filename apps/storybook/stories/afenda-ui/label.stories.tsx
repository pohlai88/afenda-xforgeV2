import { Input } from "@repo/design-system/components/afenda-ui/input"
import { Label } from "@repo/design-system/components/afenda-ui/label"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "Afenda UI/Label",
  component: Label,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Afenda field label. Compact, neutral, and designed to sit above a single control without adding noise.",
      },
    },
  },
  args: {
    children: "Operator email",
    htmlFor: "afenda-label-email",
  },
} satisfies Meta<typeof Label>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div className="min-h-[500px] bg-surface-canvas p-6 text-[13px] text-text-primary">
      <section className="mx-auto grid max-w-4xl gap-5 rounded-xl border border-border-default bg-surface-raised p-5 shadow-panel">
        <div className="border-border-subtle border-b pb-3">
          <h3 className="font-semibold text-[15px]">Operator identity fields</h3>
          <p className="text-text-secondary text-xs">
            Labels stay compact while keeping controls explicitly named.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-1.5">
            <Label {...args} />
            <Input id="afenda-label-email" placeholder="ops@afenda.local" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="afenda-label-tenant">Tenant code</Label>
            <Input id="afenda-label-tenant" placeholder="NX-44" />
          </div>
        </div>
      </section>
    </div>
  ),
}

export const WithHint: Story = {
  args: {
    htmlFor: "afenda-label-email-hint",
  },
  render: (args) => (
    <div className="min-h-[500px] bg-surface-canvas p-6 text-[13px] text-text-primary">
      <section className="mx-auto grid max-w-4xl gap-5 rounded-xl border border-border-default bg-surface-raised p-5 shadow-panel">
        <div className="border-border-subtle border-b pb-3">
          <h3 className="font-semibold text-[15px]">Notification routing</h3>
          <p className="text-text-secondary text-xs">
            Helper copy uses muted text and remains separate from the label.
          </p>
        </div>
        <div className="grid max-w-lg gap-1.5">
          <Label {...args} />
          <Input id="afenda-label-email-hint" placeholder="ops@afenda.local" />
          <p className="text-text-secondary text-xs">
            Used for sign-in, payroll escalation, and audit notification routing.
          </p>
        </div>
      </section>
    </div>
  ),
}
