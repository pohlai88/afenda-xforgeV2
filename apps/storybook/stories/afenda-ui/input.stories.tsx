import { Input } from "@repo/design-system";
import type { Meta, StoryObj } from "@storybook/react";

import { booleanControl } from "../../.storybook/args";
import { matrixStoryParameters } from "../../.storybook/essentials";

const storyShell =
  "min-h-[520px] bg-surface-canvas p-6 text-[13px] text-text-primary";
const panel =
  "mx-auto grid max-w-5xl gap-5 rounded-xl border border-border-default bg-surface-raised p-5 shadow-panel";
const sectionHeader =
  "flex items-center justify-between border-border-subtle border-b pb-3";
const labelText = "font-medium text-text-primary text-[13px]";
const hintText = "text-text-secondary text-xs";

const meta = {
  title: "Afenda UI/Input",
  component: Input,
  tags: ["autodocs", "afenda-ui", "primitive"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Afenda input field. It uses semantic surfaces and borders, keeps mobile text legible, and exposes native invalid and disabled states.",
      },
    },
  },
  args: {
    placeholder: "ops@afenda.local",
    type: "email",
  },
  argTypes: {
    disabled: booleanControl,
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className={storyShell}>
      <section className={panel}>
        <div className={sectionHeader}>
          <div>
            <h3 className="font-semibold text-[15px]">
              Tenant operator intake
            </h3>
            <p className={hintText}>Workspace: Northwind APAC · audit owner</p>
          </div>
          <span className="rounded-md border border-border-default bg-surface-muted px-2 py-1 font-mono text-text-secondary text-xs">
            FORM-OPS-104
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_1fr_160px]">
          <label className="grid gap-1.5" htmlFor="afenda-email">
            <span className={labelText}>Operator email</span>
            <Input {...args} id="afenda-email" />
            <span className={hintText}>
              Used for audit routing and sign-in.
            </span>
          </label>
          <label className="grid gap-1.5" htmlFor="afenda-payroll-id">
            <span className={labelText}>Payroll employee ID</span>
            <Input
              id="afenda-payroll-id"
              placeholder="TH-PAY-01842"
              type="text"
            />
            <span className={hintText}>Matches the payroll ledger record.</span>
          </label>
          <label className="grid gap-1.5" htmlFor="afenda-cost-center">
            <span className={labelText}>Cost center</span>
            <Input id="afenda-cost-center" placeholder="OPS-7B" type="text" />
            <span className={hintText}>Required for chargeback.</span>
          </label>
        </div>
      </section>
    </div>
  ),
};

export const WithLabel: Story = {
  render: (args) => (
    <div className={storyShell}>
      <section className={panel}>
        <div className={sectionHeader}>
          <div>
            <h3 className="font-semibold text-[15px]">Notification routing</h3>
            <p className={hintText}>
              Escalation fields shown in operator context.
            </p>
          </div>
          <span className="text-status-success text-xs">Policy synced</span>
        </div>
        <label className="grid max-w-lg gap-1.5" htmlFor="afenda-email-label">
          <span className={labelText}>Primary approver email</span>
          <Input {...args} id="afenda-email-label" />
          <span className={hintText}>
            Sends approval requests for payroll corrections above THB 50,000.
          </span>
        </label>
      </section>
    </div>
  ),
};

export const Invalid: Story = {
  args: {
    "aria-describedby": "afenda-email-error",
    "aria-invalid": "true",
    defaultValue: "ops",
  },
  render: (args) => (
    <div className={storyShell}>
      <section className={panel}>
        <div className={sectionHeader}>
          <div>
            <h3 className="font-semibold text-[15px]">
              Audit evidence contact
            </h3>
            <p className={hintText}>
              Inline errors stay next to the affected field.
            </p>
          </div>
          <span className="text-status-critical text-xs">1 field blocked</span>
        </div>
        <label className="grid max-w-lg gap-1.5" htmlFor="afenda-email-invalid">
          <span className={labelText}>Evidence owner email</span>
          <Input {...args} id="afenda-email-invalid" />
          <span className="text-critical text-xs" id="afenda-email-error">
            Enter a valid email address before assigning this audit packet.
          </span>
        </label>
      </section>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "Locked by policy",
  },
  render: (args) => (
    <div className={storyShell}>
      <section className={panel}>
        <div className={sectionHeader}>
          <div>
            <h3 className="font-semibold text-[15px]">
              Policy controlled field
            </h3>
            <p className={hintText}>
              Disabled controls include visible rationale.
            </p>
          </div>
          <span className="text-text-secondary text-xs">Owner: Compliance</span>
        </div>
        <label className="grid max-w-lg gap-1.5" htmlFor="afenda-locked-input">
          <span className={labelText}>Tenant legal entity</span>
          <Input {...args} id="afenda-locked-input" />
          <span className={hintText}>
            Locked while the June payroll audit is under review.
          </span>
        </label>
      </section>
    </div>
  ),
};

export const StateMatrix: Story = {
  parameters: matrixStoryParameters,
  render: () => (
    <div className={storyShell}>
      <section className={panel}>
        <div className={sectionHeader}>
          <div>
            <h3 className="font-semibold text-[15px]">Input state matrix</h3>
            <p className={hintText}>
              States shown inside an operator record editor.
            </p>
          </div>
          <span className="font-mono text-text-secondary text-xs">
            Tenant NX-44
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-1.5" htmlFor="matrix-default-email">
            <span className={labelText}>Default · operator email</span>
            <Input id="matrix-default-email" placeholder="ops@afenda.local" />
          </label>
          <label className="grid gap-1.5" htmlFor="matrix-focused-email">
            <span className={labelText}>Focused · approver email</span>
            <Input
              className="border-border-active ring-[3px] ring-ring/50"
              defaultValue="payroll.approver@northwind.local"
              id="matrix-focused-email"
            />
          </label>
          <label className="grid gap-1.5" htmlFor="matrix-invalid-email">
            <span className={labelText}>Invalid · evidence contact</span>
            <Input
              aria-describedby="matrix-email-error"
              aria-invalid="true"
              defaultValue="ops"
              id="matrix-invalid-email"
            />
            <span className="text-critical text-xs" id="matrix-email-error">
              Use a routable tenant email address.
            </span>
          </label>
          <label className="grid gap-1.5" htmlFor="matrix-disabled-email">
            <span className={labelText}>Disabled · legal entity</span>
            <Input
              disabled
              id="matrix-disabled-email"
              placeholder="Locked by policy"
            />
            <span className={hintText}>Controlled by tenant registry.</span>
          </label>
        </div>
      </section>
    </div>
  ),
};
