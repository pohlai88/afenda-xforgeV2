import { Checkbox } from "@repo/design-system/components/afenda-ui/checkbox";
import {
  Field,
  FieldError,
  FieldHint,
  FieldLabel,
} from "@repo/design-system/components/afenda-ui/field";
import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";
import { useState } from "react";
import { expect } from "storybook/test";

import {
  afendaCheckboxToneArgType,
  booleanControl,
  checkboxCheckedArgType,
} from "../../.storybook/args";
import {
  interactionStoryParameters,
  matrixStoryParameters,
} from "../../.storybook/essentials";

const shell =
  "min-h-[560px] bg-surface-canvas p-6 text-[13px] text-text-primary";
const panel =
  "mx-auto grid max-w-5xl gap-5 rounded-xl border border-border-default bg-surface-raised p-5 shadow-panel";
const requireApprovalName = /require approval/i;

type CheckboxStoryArgs = ComponentProps<typeof Checkbox> & {
  label: string;
  hint: string;
};

const meta = {
  title: "Afenda UI/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Afenda checkbox primitive. Compact, semantic, and paired with field grammar for permission and policy toggles.",
      },
    },
  },
  args: {
    id: "afenda-checkbox",
    tone: "neutral",
    disabled: false,
    checked: false,
  },
  argTypes: {
    checked: checkboxCheckedArgType,
    disabled: booleanControl,
    tone: afendaCheckboxToneArgType,
    label: { control: "text" },
    hint: { control: "text" },
  },
} satisfies Meta<CheckboxStoryArgs>;

export default meta;

type Story = StoryObj<CheckboxStoryArgs>;

function CheckboxRow({
  children,
  hint,
  id,
  error,
  ...props
}: ComponentProps<typeof Checkbox> & {
  children: string;
  hint: string;
  error?: string;
}) {
  return (
    <Field>
      <label
        className="flex items-start gap-2 rounded-lg border border-border-subtle p-3"
        htmlFor={id}
      >
        <Checkbox id={id} {...props} />
        <span className="flex flex-col gap-1">
          <FieldLabel htmlFor={id}>{children}</FieldLabel>
          <FieldHint>{hint}</FieldHint>
          {error ? <FieldError>{error}</FieldError> : null}
        </span>
      </label>
    </Field>
  );
}

function InteractiveAfendaCheckboxPlayground() {
  const [checked, setChecked] = useState(false);

  return (
    <div className={shell}>
      <section className={panel}>
        <CheckboxRow
          checked={checked}
          hint="Operators must confirm before saving this record."
          id="interactive-afenda-checkbox"
          onCheckedChange={(value) => setChecked(value === true)}
          tone="neutral"
        >
          Require approval
        </CheckboxRow>
      </section>
    </div>
  );
}

export const Default: Story = {
  render: (args) => (
    <div className={shell}>
      <section className={panel}>
        <div className="border-border-subtle border-b pb-3">
          <h3 className="font-semibold text-[15px]">Approval safeguards</h3>
          <p className="text-text-secondary text-xs">
            Checkbox options apply when the payroll correction is submitted.
          </p>
        </div>
        <CheckboxRow
          {...args}
          hint="Operators must confirm before saving this record."
          id={args.id}
        >
          Require approval
        </CheckboxRow>
      </section>
    </div>
  ),
};

export const Checked: Story = {
  args: {
    ...Default.args,
    checked: true,
    id: "checked-checkbox",
  },
  render: (args) => (
    <div className={shell}>
      <section className={panel}>
        <CheckboxRow
          {...args}
          hint="The June payroll packet will require a secondary reviewer."
          id="checked-checkbox"
        >
          Secondary payroll approval enabled
        </CheckboxRow>
      </section>
    </div>
  ),
};

export const Indeterminate: Story = {
  args: {
    ...Default.args,
    checked: "indeterminate",
    id: "indeterminate-checkbox",
  },
  render: (args) => (
    <div className={shell}>
      <section className={panel}>
        <CheckboxRow
          {...args}
          hint="Some selected tenant records already require approval."
          id="indeterminate-checkbox"
        >
          Mixed approval policy
        </CheckboxRow>
      </section>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
    id: "disabled-checkbox",
  },
  render: (args) => (
    <div className={shell}>
      <section className={panel}>
        <CheckboxRow
          {...args}
          hint="Locked while compliance review AUD-7781 is open."
          id="disabled-checkbox"
        >
          Require evidence attachment
        </CheckboxRow>
      </section>
    </div>
  ),
};

export const Invalid: Story = {
  args: {
    ...Default.args,
    id: "invalid-checkbox",
  },
  render: (args) => (
    <div className={shell}>
      <section className={panel}>
        <CheckboxRow
          {...args}
          aria-invalid="true"
          error="This policy must be acknowledged before release."
          hint="Affects 18 payroll adjustments in the current batch."
          id="invalid-checkbox"
        >
          I reviewed the payroll variance report
        </CheckboxRow>
      </section>
    </div>
  ),
};

export const Interactive: Story = {
  parameters: interactionStoryParameters,
  render: InteractiveAfendaCheckboxPlayground,
  tags: ["interaction"],
  play: async ({ canvas, userEvent }) => {
    const checkbox = canvas.getByRole("checkbox", {
      name: requireApprovalName,
    });

    await expect(checkbox).not.toBeChecked();
    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();
    await userEvent.click(checkbox);
    await expect(checkbox).not.toBeChecked();
  },
};

export const StateMatrix: Story = {
  parameters: matrixStoryParameters,
  render: () => (
    <div className={shell}>
      <section className={panel}>
        <div className="flex items-center justify-between border-border-subtle border-b pb-3">
          <div>
            <h3 className="font-semibold text-[15px]">Checkbox state matrix</h3>
            <p className="text-text-secondary text-xs">
              Permission and policy states in an operator form.
            </p>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <CheckboxRow hint="Unchecked by default." id="default-checkbox">
            Default
          </CheckboxRow>
          <CheckboxRow
            checked
            hint="Committed operator choice."
            id="checked-checkbox"
          >
            Checked
          </CheckboxRow>
          <CheckboxRow
            checked="indeterminate"
            hint="Partial state across selected tenants."
            id="indeterminate-checkbox"
          >
            Indeterminate
          </CheckboxRow>
          <CheckboxRow
            className="ring-[3px] ring-ring/50"
            hint="Focus remains visible and quiet."
            id="focused-checkbox"
          >
            Focused
          </CheckboxRow>
          <CheckboxRow
            aria-invalid="true"
            error="Needs acknowledgment before continuing."
            hint="Required for release."
            id="invalid-checkbox"
          >
            Invalid
          </CheckboxRow>
          <CheckboxRow disabled hint="Locked by policy." id="disabled-checkbox">
            Disabled
          </CheckboxRow>
        </div>
      </section>
    </div>
  ),
};

export const ToneMatrix: Story = {
  parameters: matrixStoryParameters,
  render: () => (
    <div className={shell}>
      <section className={panel}>
        <div className="border-border-subtle border-b pb-3">
          <h3 className="font-semibold text-[15px]">Checkbox tone matrix</h3>
          <p className="text-text-secondary text-xs">
            Color remains semantic and tied to operator meaning.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <CheckboxRow
            checked
            hint="Standard confirmation."
            id="tone-neutral"
            tone="neutral"
          >
            Neutral
          </CheckboxRow>
          <CheckboxRow
            checked
            hint="Informational acknowledgment."
            id="tone-info"
            tone="info"
          >
            Info
          </CheckboxRow>
          <CheckboxRow
            checked
            hint="Approval or beneficial outcome."
            id="tone-positive"
            tone="positive"
          >
            Positive
          </CheckboxRow>
          <CheckboxRow
            checked
            hint="Attention required, not blocked."
            id="tone-warning"
            tone="warning"
          >
            Warning
          </CheckboxRow>
          <CheckboxRow
            checked
            hint="High-risk confirmation."
            id="tone-critical"
            tone="critical"
          >
            Critical
          </CheckboxRow>
        </div>
      </section>
    </div>
  ),
};
