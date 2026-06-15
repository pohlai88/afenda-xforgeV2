import { FileTextIcon, ShieldCheckIcon, TimerIcon } from "lucide-react"
import type { Meta, StoryObj } from "@storybook/react"

import { Badge } from "@repo/design-system/components/afenda-ui/badge"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@repo/design-system/components/afenda-ui/item"

const meta = {
  title: "Afenda UI/Item",
  component: Item,
  subcomponents: {
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemGroup,
    ItemMedia,
    ItemSeparator,
    ItemTitle,
  },
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Item>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-surface-muted p-6">
      <div className="mx-auto max-w-4xl rounded-lg border border-border-default bg-surface-raised p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-wide text-text-secondary">
              Review packet
            </p>
            <h3 className="text-[15px] font-semibold text-text-primary">
              Required evidence
            </h3>
          </div>
          <Badge variant="outline">AP-2048</Badge>
        </div>
        <ItemGroup className="overflow-hidden rounded-md border border-border-default bg-surface">
          {[
            [FileTextIcon, "Payroll evidence", "Generated report with operator, approval chain, and lock status.", "Ready", "positive"],
            [ShieldCheckIcon, "Access attestation", "Seven privileged users verified against tenant policy.", "Reviewed", "neutral"],
            [TimerIcon, "SLA exception", "Warehouse shift B overtime variance expires in 12 minutes.", "Pending", "warning"],
          ].map(([Icon, title, description, state, tone], index) => (
            <div key={title as string}>
              <Item>
                <ItemMedia variant="icon">
                  <Icon />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{title as string}</ItemTitle>
                  <ItemDescription>{description as string}</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Badge
                    tone={tone as "positive" | "neutral" | "warning"}
                    variant="outline"
                  >
                    {state as string}
                  </Badge>
                </ItemActions>
              </Item>
              {index < 2 ? <ItemSeparator /> : null}
            </div>
          ))}
        </ItemGroup>
      </div>
    </div>
  ),
}
