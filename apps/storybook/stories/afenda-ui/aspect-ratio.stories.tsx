import { AspectRatio, Badge } from "@repo/design-system/design-system";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Afenda UI/AspectRatio",
  component: AspectRatio,
  tags: ["autodocs", "afenda-ui", "primitive"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Aspect ratio previewed as a document/evidence preview frame.",
      },
    },
  },
} satisfies Meta<typeof AspectRatio>;

export default meta;

type Story = StoryObj<typeof meta>;

export const EvidencePreview: Story = {
  render: () => (
    <section className="w-[520px] rounded-[var(--card-radius)] border border-border-default bg-surface-raised p-4 shadow-panel">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="grid gap-1">
          <h2 className="font-semibold text-[14px] text-text-primary">
            Attachment preview
          </h2>
          <p className="text-[12px] text-text-secondary">
            Fixed-ratio evidence surfaces keep row detail pages stable.
          </p>
        </div>
        <Badge tone="neutral" variant="outline">
          PDF
        </Badge>
      </div>
      <AspectRatio
        className="rounded-[var(--xforge-radius-md)] border border-border-default bg-surface"
        ratio={16 / 9}
      >
        <div className="grid size-full place-items-center text-[13px] text-text-secondary">
          Invoice evidence preview
        </div>
      </AspectRatio>
    </section>
  ),
};
