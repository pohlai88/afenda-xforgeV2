import { Badge, Button } from "@repo/design-system/design-system";
import type { Meta, StoryObj } from "@storybook/react";
import {
  DownloadIcon,
  Loader2Icon,
  PlusIcon,
  ShieldAlertIcon,
} from "lucide-react";

import { afendaButtonArgTypes } from "../../.storybook/args";
import { matrixStoryParameters } from "../../.storybook/essentials";

const meta = {
  title: "Afenda UI/Button",
  component: Button,
  tags: ["autodocs", "afenda-ui", "primitive"],
  argTypes: afendaButtonArgTypes,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Afenda operator button. Secondary is default; primary is an intentional decision; quiet is for repeated work; destructive is semantic danger.",
      },
    },
  },
  args: {
    variant: "secondary",
    size: "default",
    children: "Edit record",
  },
  render: (args) => <Button {...args}>{args.children}</Button>,
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DoctrineMatrix: Story = {
  parameters: matrixStoryParameters,
  render: () => (
    <section className="grid w-[760px] gap-4 rounded-[var(--card-radius)] border border-border-default bg-surface-raised p-4 shadow-panel">
      <div className="flex items-start justify-between gap-3">
        <div className="grid gap-1">
          <div className="flex items-center gap-2">
            <ShieldAlertIcon
              aria-hidden="true"
              className="size-4 text-text-secondary"
            />
            <h2 className="font-semibold text-[14px] text-text-primary">
              Afenda button doctrine
            </h2>
          </div>
          <p className="max-w-[560px] text-[12px] text-text-secondary">
            Neutral actions carry the interface. Brand color appears only when
            an operator is making the primary decision.
          </p>
        </div>
        <Badge tone="neutral" variant="outline">
          ERP v1
        </Badge>
      </div>

      <div className="grid gap-2">
        {(
          [
            ["primary", "Approve request", "True decision anchor"],
            ["secondary", "Edit record", "Default operator action"],
            ["quiet", "Refresh queue", "Repeated low-risk action"],
            ["destructive", "Delete record", "Danger only"],
            ["link", "View audit log", "Navigation"],
          ] as const
        ).map(([variant, label, description]) => (
          <div
            className="grid grid-cols-[120px_180px_1fr] items-center gap-3 rounded-[var(--xforge-radius-sm)] border border-border-default bg-surface px-3 py-2"
            key={variant}
          >
            <span className="text-[12px] text-text-secondary">{variant}</span>
            <Button variant={variant}>{label}</Button>
            <span className="text-[12px] text-text-secondary">
              {description}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 border-border-default border-t pt-3">
        <Button disabled variant="secondary">
          <Loader2Icon className="size-4 animate-spin" />
          Processing
        </Button>
        <Button variant="secondary">
          <DownloadIcon className="size-4" />
          Export
        </Button>
        <Button aria-label="Create record" size="icon-sm" variant="quiet">
          <PlusIcon className="size-4" />
        </Button>
      </div>
    </section>
  ),
};

export const Playground: Story = {};
