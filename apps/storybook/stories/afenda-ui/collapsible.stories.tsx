import {
  Badge,
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/design-system/design-system";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Afenda UI/Collapsible",
  component: Collapsible,
  tags: ["autodocs", "afenda-ui", "primitive"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Collapsible previewed as a compact audit disclosure inside a record panel.",
      },
    },
  },
} satisfies Meta<typeof Collapsible>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AuditSummary: Story = {
  render: () => (
    <section className="w-[520px] rounded-[var(--card-radius)] border border-border-default bg-surface-raised p-4 shadow-panel">
      <div className="flex items-start justify-between gap-3">
        <div className="grid gap-1">
          <h2 className="font-semibold text-[14px] text-text-primary">
            Payroll lock
          </h2>
          <p className="text-[12px] text-text-secondary">
            System-controlled state with operator-visible context.
          </p>
        </div>
        <Badge tone="warning" variant="outline">
          Locked
        </Badge>
      </div>
      <Collapsible className="mt-4 grid gap-2" defaultOpen>
        <CollapsibleTrigger asChild>
          <Button className="w-fit" size="sm" variant="secondary">
            Show audit summary
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="rounded-[var(--xforge-radius-md)] border border-border-default bg-surface px-3 py-2 text-[13px] text-text-secondary">
          Last changed by Ops Admin at 09:42. Payroll lock is active until the
          approval queue is cleared.
        </CollapsibleContent>
      </Collapsible>
    </section>
  ),
};
