import { Switch } from "@repo/design-system/components/ui/switch";
import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";
import { useState } from "react";
import { expect } from "storybook/test";

import { booleanControl } from "../.storybook/args";
import { interactionStoryParameters } from "../.storybook/essentials";

const airplaneModeName = /airplane mode/i;

type SwitchStoryProps = ComponentProps<typeof Switch> & {
  label: string;
};

function SwitchWithLabel({ label, ...args }: SwitchStoryProps) {
  return (
    <div className="flex items-center space-x-2">
      <Switch {...args} />
      <label className="peer-disabled:text-foreground/50" htmlFor={args.id}>
        {label}
      </label>
    </div>
  );
}

function InteractiveSwitch() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex items-center space-x-2">
      <Switch
        checked={checked}
        id="interactive-switch"
        onCheckedChange={setChecked}
      />
      <label
        className="peer-disabled:text-foreground/50"
        htmlFor="interactive-switch"
      >
        Airplane Mode
      </label>
    </div>
  );
}

/**
 * A control that allows the user to toggle between checked and not checked.
 */
const meta = {
  title: "ui/Switch",
  component: SwitchWithLabel,
  tags: ["autodocs"],
  argTypes: {
    checked: booleanControl,
    disabled: booleanControl,
    label: { control: "text" as const },
  },
  parameters: {
    layout: "centered",
  },
  args: {
    id: "default-switch",
    disabled: false,
    label: "Airplane Mode",
  },
} satisfies Meta<typeof SwitchWithLabel>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the switch.
 */
export const Default: Story = {};

/**
 * Use the `disabled` prop to disable the switch.
 */
export const Disabled: Story = {
  args: {
    ...Default.args,
    id: "disabled-switch",
    disabled: true,
  },
};

export const Interactive: Story = {
  parameters: interactionStoryParameters,
  render: InteractiveSwitch,
  tags: ["interaction"],
  play: async ({ canvas, userEvent }) => {
    const toggle = canvas.getByRole("switch", { name: airplaneModeName });

    await expect(toggle).not.toBeChecked();
    await userEvent.click(toggle);
    await expect(toggle).toBeChecked();
  },
};
