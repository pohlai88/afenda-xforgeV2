import type { ProgressTone } from "@repo/design-system";

import { Progress } from "@repo/design-system";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Afenda UI/Progress",
  tags: ["autodocs", "afenda-ui", "primitive"],
  component: Progress,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Progress>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-surface-muted p-6">
      <div className="mx-auto max-w-4xl rounded-lg border border-border-default bg-surface-raised p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="font-medium text-[12px] text-text-secondary uppercase tracking-wide">
              SLA watch
            </p>
            <h3 className="font-semibold text-[15px] text-text-primary">
              Payroll close pipeline
            </h3>
          </div>
          <span className="text-[12px] text-text-secondary">Refresh 09:50</span>
        </div>
        <div className="grid gap-4">
          {(
            [
              ["Payroll import", 64, "info"],
              ["Compliance checks", 100, "success"],
              ["SLA consumed", 82, "warning"],
              ["Failed records", 38, "critical"],
            ] satisfies [string, number, ProgressTone][]
          ).map(([label, value, tone]) => (
            <div
              className="space-y-2 rounded-md bg-surface-muted p-3"
              key={label}
            >
              <div className="flex justify-between text-[12px] text-text-secondary">
                <span>{label}</span>
                <span className="tabular-nums">{value}%</span>
              </div>
              <Progress aria-label={label} tone={tone} value={value} />
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};
