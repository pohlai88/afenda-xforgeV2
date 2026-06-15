import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@repo/design-system/components/ui/input-group";
import { Kbd } from "@repo/design-system/components/ui/kbd";
import type { Meta, StoryObj } from "@storybook/react";
import { SearchIcon, SlidersHorizontalIcon } from "lucide-react";

const meta = {
  title: "ui/InputGroup",
  component: InputGroup,
  tags: ["autodocs"],
  render: (args) => (
    <InputGroup {...args}>
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupInput placeholder="Search records, actions, evidence" />
      <InputGroupAddon align="inline-end">
        <InputGroupText>
          <Kbd>Ctrl</Kbd>
          <Kbd>K</Kbd>
        </InputGroupText>
        <InputGroupButton aria-label="Open search filters" size="icon-xs">
          <SlidersHorizontalIcon />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
  args: {
    className: "w-96",
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof InputGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
