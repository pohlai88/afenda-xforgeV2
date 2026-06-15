import { Kbd, KbdSequence } from "@repo/design-system/design-system";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Afenda UI/Kbd",
  tags: ["autodocs", "afenda-ui", "primitive"],
  component: Kbd,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Kbd>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-surface p-6">
      <div className="mx-auto max-w-3xl rounded-lg border border-border-default bg-surface-raised p-4">
        <div className="mb-3">
          <p className="font-medium text-[12px] text-text-primary uppercase tracking-wide">
            Operator shortcuts
          </p>
          <h3 className="font-semibold text-[15px] text-text-primary">
            Review console keyboard map
          </h3>
        </div>
        <div className="grid gap-2 text-[13px]">
          {[
            ["Open command search", ["Ctrl", "K"]],
            ["Assign selected packet", ["A"]],
            ["Escalate SLA breach", ["Shift", "E"]],
            ["Move to next tenant", ["J"]],
          ].map(([action, keys]) => (
            <div
              className="flex items-center justify-between rounded-md bg-surface px-3 py-2"
              key={action as string}
            >
              <span className="text-text-primary">{action as string}</span>
              <KbdSequence>
                {(keys as string[]).map((key) => (
                  <Kbd className="text-text-primary" key={key} size="sm">
                    {key}
                  </Kbd>
                ))}
              </KbdSequence>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};
