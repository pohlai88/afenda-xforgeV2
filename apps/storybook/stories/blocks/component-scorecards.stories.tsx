import {
  type ComponentScorecard,
  type ComponentScorecardStatus,
  componentScorecards,
} from "@repo/design-system/contracts/component-scorecards";
import {
  Badge,
  blockRecipe,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/design-system/design-system";
import { cn } from "@repo/design-system/lib/utils";
import type { Meta, StoryObj } from "@storybook/react";

import { layoutStoryParameters } from "../../.storybook/essentials";

const meta = {
  title: "Blocks/Quality Gates/Component Scorecards",
  tags: ["autodocs", "block"],
  parameters: {
    ...layoutStoryParameters,
    layout: "centered",
    docs: {
      description: {
        component:
          "Release readiness scorecards for Afenda primitives and blocks, covering states, keyboard support, labels, reduced motion, density, overflow, visual baselines, owner, and status.",
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const statusTone: Record<
  ComponentScorecardStatus,
  "info" | "neutral" | "success" | "warning"
> = {
  "needs-work": "warning",
  ready: "success",
  watch: "info",
};

const readinessSummary: Record<ComponentScorecardStatus, number> = {
  "needs-work": 0,
  ready: 0,
  watch: 0,
};

for (const scorecard of componentScorecards) {
  readinessSummary[scorecard.status] += 1;
}

export const ReleaseReadiness: Story = {
  render: () => (
    <section
      className={cn(
        "w-[min(1180px,calc(100vw-32px))]",
        blockRecipe("blockShell", "blockStack")
      )}
    >
      <header className={blockRecipe("blockHeader")}>
        <div className={blockRecipe("blockHeaderContent")}>
          <h2 className={blockRecipe("blockTitle")}>Component scorecards</h2>
          <p className={blockRecipe("blockDescription")}>
            Release readiness records for primitives and blocks that app teams
            consume through the design-system public surface.
          </p>
        </div>
        <div className="flex flex-wrap justify-end gap-1.5">
          <Badge tone="success" variant="outline">
            Ready {readinessSummary.ready}
          </Badge>
          <Badge tone="info" variant="outline">
            Watch {readinessSummary.watch}
          </Badge>
          <Badge tone="warning" variant="outline">
            Needs work {readinessSummary["needs-work"]}
          </Badge>
        </div>
      </header>

      <div className={cn(blockRecipe("blockPanel"), "overflow-x-auto")}>
        <Table className="min-w-[1120px]" variant="plain">
          <TableHeader>
            <TableRow>
              <TableHead>Component</TableHead>
              <TableHead>States</TableHead>
              <TableHead>Keyboard</TableHead>
              <TableHead>A11y</TableHead>
              <TableHead>Motion</TableHead>
              <TableHead>Density</TableHead>
              <TableHead>Overflow</TableHead>
              <TableHead>Baseline</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {componentScorecards.map((scorecard) => (
              <ScorecardRow key={scorecard.id} scorecard={scorecard} />
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  ),
};

function ScorecardRow({
  scorecard,
}: {
  readonly scorecard: ComponentScorecard;
}) {
  return (
    <TableRow>
      <TableCell className="min-w-52 align-top">
        <div className="grid gap-1">
          <span className="font-medium text-text-primary">{scorecard.id}</span>
          <span className="font-mono text-[11px] text-text-secondary leading-4">
            {scorecard.kind} / {scorecard.owner}
          </span>
        </div>
      </TableCell>
      <TableCell className="min-w-72 align-top">
        <div className="flex flex-wrap gap-1.5">
          {scorecard.statesCovered.map((state) => (
            <Badge
              key={`${scorecard.id}-${state}`}
              tone="neutral"
              variant="outline"
            >
              {state}
            </Badge>
          ))}
        </div>
      </TableCell>
      <TableCell className="align-top text-text-secondary">
        {scorecard.keyboardSupport}
      </TableCell>
      <TableCell className="align-top text-text-secondary">
        {scorecard.a11yLabels}
      </TableCell>
      <TableCell className="align-top text-text-secondary">
        {scorecard.reducedMotion}
      </TableCell>
      <TableCell className="align-top text-text-secondary">
        {scorecard.densityFit}
      </TableCell>
      <TableCell className="align-top text-text-secondary">
        {scorecard.overflowBehavior}
      </TableCell>
      <TableCell className="min-w-56 align-top text-text-secondary">
        {scorecard.visualBaselineStory}
      </TableCell>
      <TableCell className="align-top">
        <Badge tone={statusTone[scorecard.status]} variant="outline">
          {scorecard.status}
        </Badge>
      </TableCell>
    </TableRow>
  );
}
