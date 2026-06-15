import type { Meta, StoryObj } from "@storybook/react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/design-system/components/afenda-ui/accordion"
import { Badge } from "@repo/design-system/components/afenda-ui/badge"

const meta = {
  title: "Afenda UI/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Accordion previewed as a governed policy disclosure inside an operator panel.",
      },
    },
  },
} satisfies Meta<typeof Accordion>

export default meta

type Story = StoryObj<typeof meta>

export const PolicyPanel: Story = {
  args: {
    type: "single",
    collapsible: true,
    defaultValue: "policy",
  },
  render: (args) => (
    <section className="w-[560px] rounded-[var(--card-radius)] border border-border-default bg-surface-raised p-4 shadow-panel">
      <header className="mb-3 flex items-start justify-between gap-3">
        <div className="grid gap-1">
          <h2 className="text-[14px] font-semibold text-text-primary">
            Approval governance
          </h2>
          <p className="text-[12px] text-text-secondary">
            Policy details remain available without taking over the workflow.
          </p>
        </div>
        <Badge tone="info" variant="outline">
          Tenant scope
        </Badge>
      </header>
      <Accordion {...args}>
        <AccordionItem value="policy">
          <AccordionTrigger>Payment release policy</AccordionTrigger>
          <AccordionContent>
            Require finance manager approval before releasing payments above
            the tenant threshold.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="audit">
          <AccordionTrigger>Audit visibility</AccordionTrigger>
          <AccordionContent>
            Changes are logged with operator, timestamp, workspace, and source
            module.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="exception">
          <AccordionTrigger>Exception handling</AccordionTrigger>
          <AccordionContent>
            Exceptions require an explicit reason and remain visible in the
            approval trail.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  ),
}
