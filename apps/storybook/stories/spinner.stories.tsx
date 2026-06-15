import { Spinner } from "@repo/design-system/components/ui/spinner";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "ui/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  args: {
    className: "size-6",
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Spinner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
