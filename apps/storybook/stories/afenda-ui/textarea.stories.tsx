import {
  Field,
  FieldError,
  FieldHint,
  FieldLabel,
  FieldRequired,
  Textarea,
} from "@repo/design-system";
import type { Meta, StoryObj } from "@storybook/react";

import { matrixStoryParameters } from "../../.storybook/essentials";

const storyShell =
  "min-h-[560px] bg-surface-canvas p-6 text-[13px] text-text-primary";
const panel =
  "mx-auto grid max-w-5xl gap-5 rounded-xl border border-border-default bg-surface-raised p-5 shadow-panel";
const header =
  "flex items-center justify-between border-border-subtle border-b pb-3";

const meta = {
  title: "Afenda UI/Textarea",
  component: Textarea,
  tags: ["autodocs", "afenda-ui", "primitive"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Afenda textarea primitive. Same field language as Input, but with multi-line spacing and manual resize for longer operator notes.",
      },
    },
  },
  args: {
    placeholder: "Summarize the audit finding...",
    rows: 4,
  },
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className={storyShell}>
      <section className={panel}>
        <div className={header}>
          <div>
            <h3 className="font-semibold text-[15px]">Payroll audit note</h3>
            <p className="text-text-secondary text-xs">
              Tenant: Northwind APAC · period ending 15 Jun 2026
            </p>
          </div>
          <span className="rounded-md bg-surface-muted px-2 py-1 font-mono text-text-secondary text-xs">
            DRAFT
          </span>
        </div>
        <Field>
          <FieldLabel htmlFor="afenda-notes">
            Reviewer note <FieldRequired />
          </FieldLabel>
          <Textarea
            {...args}
            defaultValue="Two off-cycle payroll adjustments require secondary approval before the June close packet can be sealed."
            id="afenda-notes"
          />
          <FieldHint>Visible to operators with record access.</FieldHint>
        </Field>
      </section>
    </div>
  ),
};

export const Invalid: Story = {
  render: (args) => (
    <div className={storyShell}>
      <section className={panel}>
        <div className={header}>
          <div>
            <h3 className="font-semibold text-[15px]">
              Evidence rejection reason
            </h3>
            <p className="text-text-secondary text-xs">
              Error copy appears below the textarea and remains specific.
            </p>
          </div>
          <span className="text-status-critical text-xs">Needs detail</span>
        </div>
        <Field>
          <FieldLabel htmlFor="afenda-notes-invalid">
            Rejection note <FieldRequired />
          </FieldLabel>
          <Textarea
            {...args}
            aria-describedby="afenda-notes-error"
            aria-invalid="true"
            defaultValue="Need to follow up."
            id="afenda-notes-invalid"
          />
          <FieldHint>Explain what evidence the operator must attach.</FieldHint>
          <FieldError id="afenda-notes-error">
            Add at least 20 characters and name the missing artifact.
          </FieldError>
        </Field>
      </section>
    </div>
  ),
};

export const ReadOnly: Story = {
  render: (args) => (
    <div className={storyShell}>
      <section className={panel}>
        <div className={header}>
          <div>
            <h3 className="font-semibold text-[15px]">Imported payroll memo</h3>
            <p className="text-text-secondary text-xs">
              System-controlled text remains readable but not editable.
            </p>
          </div>
          <span className="text-text-secondary text-xs">
            Source: Payroll API
          </span>
        </div>
        <Field>
          <FieldLabel htmlFor="afenda-notes-readonly">System memo</FieldLabel>
          <Textarea
            {...args}
            defaultValue="Imported from payroll review on 15 Jun 2026. Manual edits are disabled while the variance queue is reconciling."
            id="afenda-notes-readonly"
            readOnly
          />
          <FieldHint>This value is system-controlled.</FieldHint>
        </Field>
      </section>
    </div>
  ),
};

export const DensityMatrix: Story = {
  parameters: matrixStoryParameters,
  render: () => (
    <div className={storyShell}>
      <section className={panel}>
        <div className={header}>
          <div>
            <h3 className="font-semibold text-[15px]">
              Textarea density matrix
            </h3>
            <p className="text-text-secondary text-xs">
              Compact defaults support repeated operator workflows.
            </p>
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="textarea-density-compact">Compact</FieldLabel>
            <Textarea
              density="compact"
              id="textarea-density-compact"
              placeholder="Short variance note"
              rows={3}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="textarea-density-comfortable">
              Comfortable
            </FieldLabel>
            <Textarea
              density="comfortable"
              id="textarea-density-comfortable"
              placeholder="Evidence summary"
              rows={4}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="textarea-density-spacious">
              Spacious
            </FieldLabel>
            <Textarea
              density="spacious"
              id="textarea-density-spacious"
              placeholder="Long audit narrative"
              rows={5}
            />
          </Field>
        </div>
      </section>
    </div>
  ),
};
