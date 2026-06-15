import { Checkbox } from "@repo/design-system/components/ui/checkbox";
import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";
import { useState } from "react";
import { expect } from "storybook/test";

import { booleanControl, checkboxCheckedArgType } from "../.storybook/args";
import {
  interactionStoryParameters,
  matrixStoryParameters,
} from "../.storybook/essentials";

const acceptTermsName = /accept terms and conditions/i;

type CheckboxStoryProps = ComponentProps<typeof Checkbox> & {
  label: string;
};

function CheckboxWithLabel({ label, ...args }: CheckboxStoryProps) {
  return (
    <div className="flex space-x-2">
      <Checkbox {...args} />
      <label
        className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
        htmlFor={args.id}
      >
        {label}
      </label>
    </div>
  );
}

function InteractiveCheckbox() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex space-x-2">
      <Checkbox
        checked={checked}
        id="interactive-terms"
        onCheckedChange={(value) => setChecked(value === true)}
      />
      <label
        className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
        htmlFor="interactive-terms"
      >
        Accept terms and conditions
      </label>
    </div>
  );
}

/**
 * A control that allows the user to toggle between checked and not checked.
 */
const meta = {
  title: "ui/Checkbox",
  component: CheckboxWithLabel,
  tags: ["autodocs"],
  argTypes: {
    checked: checkboxCheckedArgType,
    disabled: booleanControl,
    label: { control: "text" as const },
  },
  args: {
    id: "terms",
    disabled: false,
    checked: false,
    label: "Accept terms and conditions",
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof CheckboxWithLabel>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the checkbox.
 */
export const Default: Story = {};

/**
 * Use the `disabled` prop to disable the checkbox.
 */
export const Disabled: Story = {
  args: {
    ...Default.args,
    id: "disabled-terms",
    disabled: true,
  },
};

export const Interactive: Story = {
  parameters: interactionStoryParameters,
  render: InteractiveCheckbox,
  tags: ["interaction"],
  play: async ({ canvas, userEvent }) => {
    const checkbox = canvas.getByRole("checkbox", {
      name: acceptTermsName,
    });

    await expect(checkbox).not.toBeChecked();
    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();
  },
};

export const StateMatrix: Story = {
  parameters: matrixStoryParameters,
  render: () => (
    <div className="grid gap-4">
      <label className="flex items-center gap-2" htmlFor="default">
        <Checkbox id="default" />
        <span className="text-sm">Default</span>
      </label>
      <label className="flex items-center gap-2" htmlFor="checked">
        <Checkbox checked id="checked" />
        <span className="text-sm">Checked</span>
      </label>
      <label className="flex items-center gap-2" htmlFor="invalid">
        <Checkbox aria-invalid="true" id="invalid" />
        <span className="font-medium text-destructive text-sm">Invalid</span>
      </label>
      <label className="flex items-center gap-2" htmlFor="disabled">
        <Checkbox disabled id="disabled" />
        <span className="text-muted-foreground text-sm">Disabled</span>
      </label>
    </div>
  ),
};
