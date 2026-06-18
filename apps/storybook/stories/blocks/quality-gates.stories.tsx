import type {
  QualityGateItem,
  QualityGateViewport,
} from "@repo/design-system";
import { Button, QualityGatesBlock } from "@repo/design-system";
import type { Meta, StoryObj } from "@storybook/react";
import { PlayIcon, RefreshCwIcon } from "lucide-react";

import { layoutStoryParameters } from "../../.storybook/essentials";

const meta = {
  title: "Blocks/Quality Gates",
  component: QualityGatesBlock,
  tags: ["autodocs", "block", "snapshot"],
  parameters: {
    ...layoutStoryParameters,
    layout: "centered",
    docs: {
      description: {
        component:
          "Quality gate block for governing ERP block releases across type safety, Storybook behavior, accessibility, visual snapshots, and responsive overflow.",
      },
    },
  },
} satisfies Meta<typeof QualityGatesBlock>;

export default meta;

type Story = StoryObj<typeof meta>;

const gates: QualityGateItem[] = [
  {
    command: "pnpm --filter @repo/design-system typecheck",
    description:
      "Validates exported block props, TanStack table generics, and shared design-system declarations.",
    id: "typecheck",
    label: "Typecheck",
    owner: "Design system",
    state: "passed",
  },
  {
    command: "pnpm --filter storybook test-storybook:interaction",
    description:
      "Runs Storybook play functions for keyboard, command, selection, and control behavior.",
    id: "interaction",
    label: "Storybook interaction tests",
    owner: "Storybook",
    state: "passed",
  },
  {
    command: "pnpm --filter storybook a11y:report",
    description:
      "Runs axe against eligible stories and writes actionable reports under .storybook/a11y-reports.",
    id: "accessibility",
    label: "Accessibility checks",
    owner: "A11y",
    state: "queued",
  },
  {
    command: "pnpm --filter storybook test-storybook:visual",
    description:
      "Captures Chromatic snapshots for visual regression review before block promotion.",
    id: "snapshots",
    label: "Visual regression snapshots",
    owner: "Chromatic",
    state: "queued",
  },
  {
    command: "pnpm --filter storybook blocks:overflow",
    description:
      "Checks horizontal overflow at 740px, 1024px, and wide desktop widths.",
    id: "overflow",
    label: "Overflow checks",
    owner: "Responsive",
    state: "passed",
  },
];

const viewports: QualityGateViewport[] = [
  {
    id: "tablet-narrow",
    label: "Narrow operations",
    state: "passed",
    width: 740,
  },
  {
    id: "desktop-compact",
    label: "Compact desktop",
    state: "passed",
    width: 1024,
  },
  {
    id: "desktop-wide",
    label: "Wide desktop",
    state: "passed",
    width: "wide",
  },
];

export const ReleaseChecklist: Story = {
  args: {
    actions: [
      {
        icon: <RefreshCwIcon aria-hidden="true" className="size-4" />,
        key: "refresh",
        label: "Refresh",
        variant: "secondary",
      },
      {
        icon: <PlayIcon aria-hidden="true" className="size-4" />,
        key: "run",
        label: "Run gates",
      },
    ],
    gates,
    progress: 60,
    status: {
      label: "3 of 5 passed",
      tone: "info",
    },
    updatedAt: "Last checked 10:48 UTC+07",
    viewports,
  },
  render: (args) => (
    <div className="w-[min(1120px,calc(100vw-2rem))]">
      <QualityGatesBlock {...args} />
    </div>
  ),
};

export const BlockedByA11y: Story = {
  args: {
    gates: gates.map((gate) =>
      gate.id === "accessibility"
        ? {
            ...gate,
            state: "blocked",
          }
        : gate
    ),
    status: {
      label: "Blocked",
      tone: "warning",
    },
    updatedAt: "Last checked 10:52 UTC+07",
    viewports,
  },
  render: (args) => (
    <div className="w-[min(920px,calc(100vw-2rem))]">
      <QualityGatesBlock {...args} />
    </div>
  ),
};

export const OperatorActions: Story = {
  args: {
    gates,
  },
  render: () => (
    <div className="w-[min(740px,calc(100vw-2rem))]">
      <QualityGatesBlock
        actions={
          <Button size="sm" variant="secondary">
            Open report
          </Button>
        }
        gates={gates}
        status={{
          label: "Responsive ready",
          tone: "success",
        }}
        updatedAt="740px overflow lane"
        viewports={viewports}
      />
    </div>
  ),
};
