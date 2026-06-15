import { Button } from "@repo/design-system/components/ui/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@repo/design-system/components/ui/button-group";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "ui/ButtonGroup",
  component: ButtonGroup,
  subcomponents: {
    ButtonGroupSeparator,
    ButtonGroupText,
  },
  tags: ["autodocs"],
  args: {
    orientation: "horizontal",
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="outline">Preview</Button>
      <ButtonGroupSeparator />
      <ButtonGroupText>⌘K</ButtonGroupText>
      <Button variant="outline">Run</Button>
    </ButtonGroup>
  ),
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Vertical: Story = {
  args: {
    orientation: "vertical",
  },
};
