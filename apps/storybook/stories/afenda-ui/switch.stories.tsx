import { Label } from "@repo/design-system/components/afenda-ui/label";
import { Switch } from "@repo/design-system/components/afenda-ui/switch";
import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";
import { useState } from "react";
import { expect } from "storybook/test";

import { booleanControl } from "../../.storybook/args";
import { interactionStoryParameters } from "../../.storybook/essentials";

type SwitchStoryArgs = ComponentProps<typeof Switch> & {
  label: string;
  hint: string;
};

const approvalNotificationsName = /approval notifications/i;

function PlaygroundSwitch() {
  const [checked, setChecked] = useState(false);

  return (
    <Label className="flex w-[420px] items-center justify-between rounded-lg border border-border-subtle p-3">
      <span className="grid gap-1 pr-4">
        <span>Approval notifications</span>
        <span className="font-normal text-text-secondary text-xs">
          Send a message when payroll batches need review.
        </span>
      </span>
      <Switch
        checked={checked}
        id="interactive-afenda-switch"
        onCheckedChange={setChecked}
      />
    </Label>
  );
}

const meta = {
  title: "Afenda UI/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Afenda switch for immediate settings. Use args + Controls to preview checked and disabled states.",
      },
    },
  },
  args: {
    id: "afenda-switch",
    checked: false,
    disabled: false,
  },
  argTypes: {
    checked: booleanControl,
    disabled: booleanControl,
    label: { control: "text" },
    hint: { control: "text" },
  },
} satisfies Meta<SwitchStoryArgs>;

export default meta;

type Story = StoryObj<SwitchStoryArgs>;

export const Default: Story = {
  render: () => (
    <div className="min-h-[520px] bg-surface-canvas p-6 text-[13px] text-text-primary">
      <section className="mx-auto grid max-w-5xl gap-5 rounded-xl border border-border-default bg-surface-raised p-5 shadow-panel">
        <div className="flex items-center justify-between border-border-subtle border-b pb-3">
          <div>
            <h3 className="font-semibold text-[15px]">
              Immediate notification controls
            </h3>
            <p className="text-text-secondary text-xs">
              Switches represent immediate settings, not submit-time choices.
            </p>
          </div>
          <span className="text-status-success text-xs">Live settings</span>
        </div>
        <div className="grid gap-3">
          <Label className="flex items-center justify-between rounded-lg border border-border-subtle p-3">
            <span className="grid gap-1">
              <span>Approval notifications</span>
              <span className="font-normal text-text-secondary text-xs">
                Send a message when payroll batches need review.
              </span>
            </span>
            <Switch defaultChecked />
          </Label>
          <Label className="flex items-center justify-between rounded-lg border border-border-subtle p-3">
            <span className="grid gap-1">
              <span>Audit evidence reminders</span>
              <span className="font-normal text-text-secondary text-xs">
                Remind owners 24 hours before evidence is due.
              </span>
            </span>
            <Switch />
          </Label>
          <Label className="flex items-center justify-between rounded-lg border border-border-subtle p-3">
            <span className="grid gap-1">
              <span>High-risk tenant lock</span>
              <span className="font-normal text-text-secondary text-xs">
                Locked by compliance while AUD-7781 remains open.
              </span>
            </span>
            <Switch checked disabled />
          </Label>
        </div>
      </section>
    </div>
  ),
};

export const Playground: Story = {
  parameters: {
    layout: "centered",
    ...interactionStoryParameters,
  },
  render: PlaygroundSwitch,
  tags: ["interaction"],
  play: async ({ canvas, userEvent }) => {
    const toggle = canvas.getByRole("switch", {
      name: approvalNotificationsName,
    });

    await expect(toggle).not.toBeChecked();
    await userEvent.click(toggle);
    await expect(toggle).toBeChecked();
  },
};

export const Disabled: Story = {
  parameters: {
    layout: "centered",
  },
  render: () => (
    <Label className="flex w-[420px] items-center justify-between rounded-lg border border-border-subtle p-3">
      <span className="grid gap-1 pr-4">
        <span>Approval notifications</span>
        <span className="font-normal text-text-secondary text-xs">
          Send a message when payroll batches need review.
        </span>
      </span>
      <Switch checked disabled id="disabled-switch" />
    </Label>
  ),
};
