import { Badge } from "@repo/design-system/components/afenda-ui/badge";
import { Button } from "@repo/design-system/components/afenda-ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/design-system/components/afenda-ui/tooltip";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Afenda UI/Tooltip",
  component: Tooltip,
  parameters: {
    docs: {
      description: {
        component:
          "Afenda tooltip primitive for concise explanations attached to operational controls.",
      },
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <div className="w-[680px] overflow-hidden rounded-[var(--card-radius)] border border-border-default bg-surface">
        <div className="flex items-center justify-between border-border-default border-b px-5 py-4">
        <div>
          <p className="font-medium text-sm text-text-primary">
            Payroll release
          </p>
          <p className="text-[12px] text-text-primary">
            Operator actions explain requirements inline.
          </p>
        </div>
        <Badge tone="warning" variant="solid">
          Reviewer needed
        </Badge>
      </div>
      <div className="grid grid-cols-[1fr_150px] items-center gap-3 px-5 py-4 text-[13px]">
        <div>
          <p className="font-medium text-text-primary">
            Release June payroll export
          </p>
          <p className="text-text-primary">
            Waiting on payroll reviewer access confirmation.
          </p>
        </div>
          <Tooltip open>
            <TooltipTrigger asChild>
              <Button variant="secondary">Review payroll</Button>
            </TooltipTrigger>
            <TooltipContent>
              Requires payroll reviewer access for FIN-EXPORT-02
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  ),
};
