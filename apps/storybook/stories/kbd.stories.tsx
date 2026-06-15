import { Kbd, KbdGroup } from "@repo/design-system/components/ui/kbd";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "ui/Kbd",
  component: Kbd,
  tags: ["autodocs"],
  render: (args) => (
    <KbdGroup>
      <Kbd {...args}>Ctrl</Kbd>
      <Kbd>K</Kbd>
    </KbdGroup>
  ),
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Kbd>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
