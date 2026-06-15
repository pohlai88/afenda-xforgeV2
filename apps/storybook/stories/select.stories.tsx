import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@repo/design-system/components/ui/select";
import type { Meta, StoryObj } from "@storybook/react";

import { matrixStoryParameters } from "../.storybook/essentials";

/**
 * Displays a list of options for the user to pick from—triggered by a button.
 */
const meta: Meta<typeof Select> = {
  title: "ui/Select",
  component: Select,
  tags: ["autodocs"],
  argTypes: {},
  render: (args) => (
    <Select {...args}>
      <SelectTrigger className="w-96">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="grapes">Grapes</SelectItem>
          <SelectItem value="pineapple">Pineapple</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Vegetables</SelectLabel>
          <SelectItem value="aubergine">Aubergine</SelectItem>
          <SelectItem value="broccoli">Broccoli</SelectItem>
          <SelectItem disabled value="carrot">
            Carrot
          </SelectItem>
          <SelectItem value="courgette">Courgette</SelectItem>
          <SelectItem value="leek">Leek</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Meat</SelectLabel>
          <SelectItem value="beef">Beef</SelectItem>
          <SelectItem value="chicken">Chicken</SelectItem>
          <SelectItem value="lamb">Lamb</SelectItem>
          <SelectItem value="pork">Pork</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the select.
 */
export const Default: Story = {};

export const StateMatrix: Story = {
  parameters: matrixStoryParameters,
  render: () => (
    <div className="grid w-[420px] gap-4">
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Default tenant" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="northwind">Northwind</SelectItem>
          <SelectItem value="contoso">Contoso</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultOpen>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Open state" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="risk">Risk queue</SelectItem>
          <SelectItem value="audit">Audit queue</SelectItem>
          <SelectItem disabled value="locked">
            Locked queue
          </SelectItem>
        </SelectContent>
      </Select>
      <Select disabled>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Disabled by policy" />
        </SelectTrigger>
      </Select>
      <Select>
        <SelectTrigger aria-invalid="true" className="w-full">
          <SelectValue placeholder="Invalid selection" />
        </SelectTrigger>
      </Select>
    </div>
  ),
};
