import { Badge } from "@repo/design-system/components/afenda-ui/badge";
import { Button } from "@repo/design-system/components/afenda-ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@repo/design-system/components/afenda-ui/hover-card";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Afenda UI/HoverCard",
  component: HoverCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Afenda hover card primitive for low-commitment entity previews in dense operator tables.",
      },
    },
  },
} satisfies Meta<typeof HoverCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-[680px] overflow-hidden rounded-[var(--card-radius)] border border-border-default bg-surface">
      <div className="border-border-default border-b px-5 py-4">
        <p className="font-medium text-sm text-text-primary">Tenant health</p>
        <p className="text-[12px] text-text-secondary">
          Hover targets appear inside realistic table rows.
        </p>
      </div>
      <div className="grid grid-cols-[1fr_130px_120px] items-center gap-3 px-5 py-4 text-[13px]">
        <HoverCard open>
          <HoverCardTrigger asChild>
            <Button className="w-fit px-0" variant="quiet">
              Northwind Trading
            </Button>
          </HoverCardTrigger>
          <HoverCardContent align="start" className="w-80">
            <div className="grid gap-3">
              <div>
                <div className="font-medium text-text-primary">
                  Northwind Trading
                </div>
                <div className="text-[12px] text-text-secondary">
                  Active tenant with 24 pending finance records.
                </div>
              </div>
              <div className="grid gap-2 rounded-md border border-border-default bg-surface-muted p-3 text-[12px]">
                <div className="flex justify-between gap-3">
                  <span className="text-text-secondary">Owner</span>
                  <span>Mina Patel</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-text-secondary">ERP sync</span>
                  <span>8 minutes ago</span>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
        <Badge tone="warning" variant="outline">
          Medium risk
        </Badge>
        <span className="text-text-secondary">482 users</span>
      </div>
    </div>
  ),
};
