import { Button } from "@repo/design-system/components/ui/button";
import { Input } from "@repo/design-system/components/ui/input";
import type { Meta, StoryObj } from "@storybook/react";

import { booleanControl } from "../.storybook/args";
import { matrixStoryParameters } from "../.storybook/essentials";

/**
 * Displays a form input field or a component that looks like an input field.
 */
const meta = {
  title: "ui/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    disabled: booleanControl,
  },
  args: {
    className: "w-96",
    type: "email",
    placeholder: "Email",
    disabled: false,
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the input field.
 */
export const Default: Story = {};

/**
 * Use the `disabled` prop to make the input non-interactive and appears faded,
 * indicating that input is not currently accepted.
 */
export const Disabled: Story = {
  args: { disabled: true },
};

/**
 * Use the `Label` component to includes a clear, descriptive label above or
 * alongside the input area to guide users.
 */
export const WithLabel: Story = {
  render: (args) => (
    <div className="grid items-center gap-1.5">
      <label htmlFor="email">{args.placeholder}</label>
      <Input {...args} id="email" />
    </div>
  ),
};

/**
 * Use a text element below the input field to provide additional instructions
 * or information to users.
 */
export const WithHelperText: Story = {
  render: (args) => (
    <div className="grid items-center gap-1.5">
      <label htmlFor="email-2">{args.placeholder}</label>
      <Input {...args} aria-describedby="email-2-help" id="email-2" />
      <p className="text-muted-foreground text-sm" id="email-2-help">
        Enter your email address.
      </p>
    </div>
  ),
};

/**
 * Use the `Button` component to indicate that the input field can be submitted
 * or used to trigger an action.
 */
export const WithButton: Story = {
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Input {...args} />
      <Button type="submit">Subscribe</Button>
    </div>
  ),
};

export const StateMatrix: Story = {
  parameters: matrixStoryParameters,
  render: () => (
    <div className="grid w-[420px] gap-4">
      <label className="grid gap-1.5" htmlFor="matrix-default-email">
        <span className="font-medium text-sm">Default</span>
        <Input id="matrix-default-email" placeholder="ops@afenda.local" />
      </label>
      <label className="grid gap-1.5" htmlFor="matrix-focused-email">
        <span className="font-medium text-sm">Focused</span>
        <Input
          className="border-ring ring-[3px] ring-ring/50"
          defaultValue="ops@afenda.local"
          id="matrix-focused-email"
        />
      </label>
      <label className="grid gap-1.5" htmlFor="matrix-invalid-email">
        <span className="font-medium text-sm">Invalid</span>
        <Input
          aria-describedby="email-error"
          aria-invalid="true"
          defaultValue="ops"
          id="matrix-invalid-email"
        />
        <span className="text-destructive text-sm" id="email-error">
          Enter a valid email address.
        </span>
      </label>
      <label className="grid gap-1.5" htmlFor="matrix-disabled-email">
        <span className="font-medium text-sm">Disabled</span>
        <Input
          disabled
          id="matrix-disabled-email"
          placeholder="Locked by policy"
        />
      </label>
    </div>
  ),
};
