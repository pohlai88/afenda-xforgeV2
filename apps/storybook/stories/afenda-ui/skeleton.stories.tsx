import { Skeleton } from "@repo/design-system/design-system";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Afenda UI/Skeleton",
  tags: ["autodocs", "afenda-ui", "primitive"],
  component: Skeleton,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-surface-muted p-6">
      <div className="mx-auto max-w-5xl rounded-lg border border-border-default bg-surface-raised p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-5 w-56" />
          </div>
          <Skeleton className="h-7 w-24 rounded-full" />
        </div>
        <div className="grid gap-2">
          {[0, 1, 2, 3].map((row) => (
            <div
              className="grid grid-cols-[120px_1fr_90px_80px] items-center gap-3 rounded-md bg-surface-muted px-3 py-2"
              key={row}
            >
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-4 w-14 justify-self-end" />
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};
