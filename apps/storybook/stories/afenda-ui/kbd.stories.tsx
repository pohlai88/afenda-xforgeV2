import type { Meta, StoryObj } from "@storybook/react"

import { Kbd, KbdSequence } from "@repo/design-system/components/afenda-ui/kbd"

const meta = {
  title: "Afenda UI/Kbd",
  component: Kbd,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Kbd>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-surface p-6">
      <div className="mx-auto max-w-3xl rounded-lg border border-border-default bg-surface-raised p-4">
        <div className="mb-3">
          <p className="text-[12px] font-medium uppercase tracking-wide text-text-primary">
            Operator shortcuts
          </p>
          <h3 className="text-[15px] font-semibold text-text-primary">
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
              key={action as string}
              className="flex items-center justify-between rounded-md bg-surface px-3 py-2"
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
}
