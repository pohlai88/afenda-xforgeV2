import {
  Field,
  FieldError,
  FieldHint,
  FieldLabel,
  FieldRequired,
} from "@repo/design-system/components/afenda-ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@repo/design-system/components/afenda-ui/select"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, screen, waitFor } from "storybook/test"

import {
  interactionStoryParameters,
  matrixStoryParameters,
} from "../../.storybook/essentials"

const shell = "min-h-[560px] bg-surface-canvas p-6 text-[13px] text-text-primary"
const panel =
  "mx-auto grid max-w-5xl gap-5 rounded-xl border border-border-default bg-surface-raised p-5 shadow-panel"

const meta = {
  title: "Afenda UI/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Afenda select primitive. Same field grammar as Input and Textarea, tuned for short option sets and dense operator forms.",
      },
    },
  },
} satisfies Meta<typeof Select>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className={shell}>
      <section className={panel}>
        <div className="border-border-subtle border-b pb-3">
          <h3 className="font-semibold text-[15px]">Tenant-scoped action</h3>
          <p className="text-text-secondary text-xs">
            Selects sit inside full form context with helper copy.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="afenda-select-tenant">
              Tenant <FieldRequired />
            </FieldLabel>
            <Select defaultValue="northwind">
              <SelectTrigger id="afenda-select-tenant">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="northwind">Northwind APAC</SelectItem>
                <SelectItem value="contoso">Contoso Services</SelectItem>
                <SelectItem value="globex">Globex Payroll</SelectItem>
              </SelectContent>
            </Select>
            <FieldHint>Choose the workspace scope for this action.</FieldHint>
          </Field>
          <Field>
            <FieldLabel htmlFor="afenda-select-run">Payroll run</FieldLabel>
            <Select defaultValue="jun-offcycle">
              <SelectTrigger id="afenda-select-run">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jun-offcycle">June off-cycle batch</SelectItem>
                <SelectItem value="jun-regular">June regular payroll</SelectItem>
                <SelectItem value="may-close">May close corrections</SelectItem>
              </SelectContent>
            </Select>
            <FieldHint>Only open runs are shown.</FieldHint>
          </Field>
        </div>
      </section>
    </div>
  ),
}

export const Grouped: Story = {
  render: () => (
    <div className={shell}>
      <section className={panel}>
        <div className="border-border-subtle border-b pb-3">
          <h3 className="font-semibold text-[15px]">Queue assignment</h3>
          <p className="text-text-secondary text-xs">
            Grouped by operational domain for scanner-friendly selection.
          </p>
        </div>
        <Field className="max-w-lg">
          <FieldLabel htmlFor="afenda-select-queue">Queue</FieldLabel>
          <Select defaultValue="audit">
            <SelectTrigger id="afenda-select-queue">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Operations</SelectLabel>
                <SelectItem value="audit">Audit queue</SelectItem>
                <SelectItem value="review">Role review queue</SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Finance</SelectLabel>
                <SelectItem value="payroll">Payroll queue</SelectItem>
                <SelectItem value="invoice">Invoice exception queue</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <FieldHint>Grouped by operational domain.</FieldHint>
        </Field>
      </section>
    </div>
  ),
}

export const Invalid: Story = {
  render: () => (
    <div className={shell}>
      <section className={panel}>
        <div className="flex items-center justify-between border-border-subtle border-b pb-3">
          <div>
            <h3 className="font-semibold text-[15px]">Required status</h3>
            <p className="text-text-secondary text-xs">
              Invalid state is attached to the select trigger.
            </p>
          </div>
          <span className="text-status-danger text-xs">1 missing value</span>
        </div>
        <Field className="max-w-lg">
          <FieldLabel htmlFor="afenda-select-status">
            Release status <FieldRequired />
          </FieldLabel>
          <Select defaultValue="pending">
            <SelectTrigger
              aria-describedby="afenda-select-status-error"
              aria-invalid="true"
              id="afenda-select-status"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ready">Ready for release</SelectItem>
              <SelectItem value="pending">Pending review</SelectItem>
              <SelectItem value="blocked">Blocked by audit</SelectItem>
            </SelectContent>
          </Select>
          <FieldError id="afenda-select-status-error">
            Choose a status before continuing.
          </FieldError>
        </Field>
      </section>
    </div>
  ),
}

export const StateMatrix: Story = {
  parameters: matrixStoryParameters,
  render: () => (
    <div className={shell}>
      <section className={panel}>
        <div className="border-border-subtle border-b pb-3">
          <h3 className="font-semibold text-[15px]">Select state matrix</h3>
          <p className="text-text-secondary text-xs">
            Common states shown in a tenant record editor.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="matrix-select-default">Default</FieldLabel>
            <Select defaultValue="northwind">
              <SelectTrigger id="matrix-select-default">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="northwind">Northwind APAC</SelectItem>
                <SelectItem value="contoso">Contoso Services</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="matrix-select-disabled">Disabled</FieldLabel>
            <Select defaultValue="locked" disabled>
              <SelectTrigger id="matrix-select-disabled">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="locked">Locked by policy</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="matrix-select-invalid">Invalid</FieldLabel>
            <Select defaultValue="blocked">
              <SelectTrigger aria-invalid="true" id="matrix-select-invalid">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blocked">Blocked by audit</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
      </section>
    </div>
  ),
}

export const Interactive: Story = {
  tags: ["interaction"],
  parameters: interactionStoryParameters,
  render: () => (
    <div className={shell}>
      <section className={panel}>
        <Field>
          <FieldLabel htmlFor="play-select-tenant">Tenant</FieldLabel>
          <Select defaultValue="northwind">
            <SelectTrigger id="play-select-tenant">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="northwind">Northwind APAC</SelectItem>
              <SelectItem value="contoso">Contoso Services</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </section>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("combobox", { name: /tenant/i });
    await expect(trigger).toHaveTextContent(/northwind/i);

    await userEvent.click(trigger);
    await userEvent.click(screen.getByRole("option", { name: /contoso/i }));
    await waitFor(() => expect(trigger).toHaveAttribute("aria-expanded", "false"));
    await expect(trigger).toHaveTextContent(/contoso/i);
  },
}
