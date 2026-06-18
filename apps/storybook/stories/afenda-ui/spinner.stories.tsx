import { Spinner } from "@repo/design-system";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Afenda UI/Spinner",
  tags: ["autodocs", "afenda-ui", "primitive"],
  component: Spinner,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Spinner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-surface-muted p-6">
      <div className="mx-auto max-w-3xl rounded-lg border border-border-default bg-surface-raised p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="font-medium text-[12px] text-text-secondary uppercase tracking-wide">
              Background work
            </p>
            <h3 className="font-semibold text-[15px] text-text-primary">
              Tenant sync jobs
            </h3>
          </div>
          <Spinner size="sm" />
        </div>
        <div className="grid gap-2 text-[13px]">
          {[
            ["NWT-1042", "Rebuilding payroll variance index", "md"],
            ["CTR-8831", "Hydrating audit timeline", "sm"],
            ["FBH-2219", "Waiting on security policy check", "lg"],
          ].map(([tenant, job, size]) => (
            <div
              className="grid grid-cols-[90px_1fr_auto] items-center gap-3 rounded-md bg-surface-muted px-3 py-2"
              key={tenant}
            >
              <span className="text-text-secondary tabular-nums">{tenant}</span>
              <span className="text-text-primary">{job}</span>
              <Spinner size={size as "sm" | "md" | "lg"} />
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};
