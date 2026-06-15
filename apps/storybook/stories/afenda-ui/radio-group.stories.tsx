import {
  RadioGroup,
  RadioGroupDescription,
  RadioGroupItem,
  RadioGroupLabel,
  RadioGroupOption,
} from "@repo/design-system/design-system";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Afenda UI/RadioGroup",
  tags: ["autodocs", "afenda-ui", "primitive"],
  component: RadioGroup,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof RadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="min-h-[540px] bg-surface-canvas p-6 text-[13px] text-text-primary">
      <section className="mx-auto grid max-w-5xl gap-5 rounded-xl border border-border-default bg-surface-raised p-5 shadow-panel">
        <div className="flex items-center justify-between border-border-subtle border-b pb-3">
          <div>
            <h3 className="font-semibold text-[15px]">
              Payroll release policy
            </h3>
            <p className="text-text-secondary text-xs">
              Radio options show mutually exclusive approval paths.
            </p>
          </div>
          <span className="font-mono text-text-secondary text-xs">
            PAY-2026-06
          </span>
        </div>
        <RadioGroup className="grid gap-3" defaultValue="manual">
          <RadioGroupOption className="rounded-lg border border-border-subtle p-3">
            <RadioGroupItem value="manual" />
            <span>
              <RadioGroupLabel>Manual approval</RadioGroupLabel>
              <RadioGroupDescription>
                Require an authorized reviewer before the batch can execute.
              </RadioGroupDescription>
            </span>
          </RadioGroupOption>
          <RadioGroupOption className="rounded-lg border border-border-subtle p-3">
            <RadioGroupItem value="automatic" />
            <span>
              <RadioGroupLabel>Automatic approval after checks</RadioGroupLabel>
              <RadioGroupDescription>
                Release only when policy, amount, and tenant boundary checks
                pass.
              </RadioGroupDescription>
            </span>
          </RadioGroupOption>
          <RadioGroupOption className="rounded-lg border border-border-subtle p-3">
            <RadioGroupItem value="hold" />
            <span>
              <RadioGroupLabel>Hold for audit packet</RadioGroupLabel>
              <RadioGroupDescription>
                Keep all adjustments queued until evidence packet AUD-7781 is
                sealed.
              </RadioGroupDescription>
            </span>
          </RadioGroupOption>
        </RadioGroup>
      </section>
    </div>
  ),
};
