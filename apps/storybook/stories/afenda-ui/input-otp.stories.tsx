import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@repo/design-system/design-system";
import type { Meta, StoryObj } from "@storybook/react";

function InputOTPStory() {
  return (
    <InputOTP
      aria-label="One-time password for privileged payroll action"
      defaultValue="123456"
      maxLength={6}
    >
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  );
}

const meta = {
  title: "Afenda UI/InputOTP",
  tags: ["autodocs", "afenda-ui", "primitive"],
  component: InputOTPStory,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof InputOTPStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="min-h-[520px] bg-surface-canvas p-6 text-[13px] text-text-primary">
      <section className="mx-auto grid max-w-4xl gap-5 rounded-xl border border-border-default bg-surface-raised p-5 shadow-panel">
        <div className="flex items-center justify-between border-border-subtle border-b pb-3">
          <div>
            <h3 className="font-semibold text-[15px]">
              Privileged payroll approval
            </h3>
            <p className="text-text-secondary text-xs">
              Confirm the second factor before releasing the off-cycle batch.
            </p>
          </div>
          <span className="rounded-md bg-warning-muted px-2 py-1 text-status-warning text-xs">
            Step 2 of 2
          </span>
        </div>
        <div className="grid gap-4 rounded-lg border border-border-subtle bg-surface-muted p-4">
          <div>
            <p className="font-medium">TH Payroll batch PAY-2026-06-OFF</p>
            <p className="text-text-secondary text-xs">
              18 adjustments · THB 428,900 · requested by Mina Chai
            </p>
          </div>
          <div className="grid gap-2">
            <span className="font-medium text-[13px]">
              Enter authenticator code
            </span>
            <InputOTPStory />
            <span className="text-text-secondary text-xs">
              Codes expire after 30 seconds. Paste is allowed.
            </span>
          </div>
        </div>
      </section>
    </div>
  ),
};
