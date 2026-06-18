import {
  ToggleGroup,
  ToggleGroupItem,
} from "@repo/design-system";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Afenda UI/ToggleGroup",
  component: ToggleGroup,
  tags: ["autodocs", "afenda-ui", "primitive"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Toggle group previewed as a compact view-density selector.",
      },
    },
  },
} satisfies Meta<typeof ToggleGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ViewDensity: Story = {
  args: {
    type: "single",
    defaultValue: "weekly",
    variant: "outline",
  },
  render: (args) => (
    <div className="grid w-[460px] gap-3 rounded-[var(--card-radius)] border border-border-default bg-surface-raised p-4 shadow-panel">
      <div className="grid gap-1">
        <span className="font-medium text-[13px] text-text-primary">
          Approval window
        </span>
        <span className="text-[12px] text-text-secondary">
          Operators can switch time scopes without leaving the queue.
        </span>
      </div>
      <ToggleGroup {...args} className="w-fit">
        <ToggleGroupItem value="daily">Daily</ToggleGroupItem>
        <ToggleGroupItem value="weekly">Weekly</ToggleGroupItem>
        <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
      </ToggleGroup>
    </div>
  ),
};
