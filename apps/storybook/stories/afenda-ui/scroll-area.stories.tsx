import type { Meta, StoryObj } from "@storybook/react"

import { Badge } from "@repo/design-system/components/afenda-ui/badge"
import { ScrollArea } from "@repo/design-system/components/afenda-ui/scroll-area"

const meta = {
  title: "Afenda UI/ScrollArea",
  component: ScrollArea,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Scroll area previewed as a bounded audit stream with visible overflow.",
      },
    },
  },
} satisfies Meta<typeof ScrollArea>

export default meta

type Story = StoryObj<typeof meta>

const records = Array.from({ length: 18 }, (_, index) => ({
  event: `Audit event ${String(index + 1).padStart(2, "0")}`,
  actor: index % 3 === 0 ? "Jordan Lee" : "Ops Admin",
}))

export const AuditStream: Story = {
  render: () => (
    <section className="w-[460px] rounded-[var(--card-radius)] border border-border-default bg-surface-raised p-4 shadow-panel">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="grid gap-1">
          <h2 className="text-[14px] font-semibold text-text-primary">
            Audit stream
          </h2>
          <p className="text-[12px] text-text-secondary">
            Scroll containers preserve local context.
          </p>
        </div>
        <Badge tone="neutral" variant="outline">
          18 events
        </Badge>
      </div>
      <ScrollArea className="h-56 rounded-[var(--xforge-radius-md)] border border-border-default bg-surface">
        <div className="grid gap-1 p-2">
          {records.map((record) => (
            <div
              className="rounded-[var(--xforge-radius-sm)] px-2 py-1.5 text-[13px]"
              key={record.event}
            >
              <div className="font-medium text-text-primary">{record.event}</div>
              <div className="text-[12px] text-text-secondary">
                Updated by {record.actor}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </section>
  ),
}
