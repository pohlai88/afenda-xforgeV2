import { Calendar } from "@repo/design-system/design-system";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Afenda UI/Calendar",
  tags: ["autodocs", "afenda-ui", "primitive"],
  component: Calendar,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Calendar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="min-h-[560px] bg-surface-canvas p-6 text-[13px] text-text-primary">
      <section className="mx-auto grid max-w-5xl gap-5 rounded-xl border border-border-default bg-surface-raised p-5 shadow-panel">
        <div className="flex items-center justify-between border-border-subtle border-b pb-3">
          <div>
            <h3 className="font-semibold text-[15px]">Audit close calendar</h3>
            <p className="text-text-secondary text-xs">
              Date picking appears beside operational deadlines and queue
              metadata.
            </p>
          </div>
          <span className="font-mono text-text-secondary text-xs">
            Q2 close
          </span>
        </div>
        <div className="grid gap-5 lg:grid-cols-[auto_1fr]">
          <div className="rounded-lg border border-border-subtle bg-surface-muted p-2">
            <Calendar mode="single" selected={new Date(2026, 5, 15)} />
          </div>
          <div className="grid content-start gap-3">
            {[
              ["15 Jun 2026", "Payroll evidence due", "18 records pending"],
              ["18 Jun 2026", "Tenant access review", "Northwind APAC"],
              ["24 Jun 2026", "Quarterly audit packet", "Owner: Compliance"],
            ].map(([date, title, detail]) => (
              <div
                className="grid gap-1 rounded-lg border border-border-subtle p-3"
                key={date}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{title}</span>
                  <span className="font-mono text-text-secondary text-xs">
                    {date}
                  </span>
                </div>
                <p className="text-text-secondary text-xs">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  ),
};
