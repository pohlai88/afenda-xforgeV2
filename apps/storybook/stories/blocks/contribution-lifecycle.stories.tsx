import {
  contributionLayerEntries,
  contributionLifecycleEntries,
} from "@repo/design-system/contracts/contribution-lifecycle";
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
  title: "Blocks/Quality Gates/Contribution Lifecycle",
  tags: ["autodocs", "block"],
  parameters: {
    ...layoutStoryParameters,
    layout: "centered",
    docs: {
      description: {
        component:
          "Contribution lifecycle governance for classifying Afenda work into core, extended, app-local, or out-of-scope layers before implementation.",
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const LayerClassification: Story = {
  render: () => (
    <section
      className={cn(
        "w-[min(1180px,calc(100vw-32px))]",
        blockRecipe("blockShell", "blockStack")
      )}
    >
      <header className={blockRecipe("blockHeader")}>
        <div className={blockRecipe("blockHeaderContent")}>
          <h2 className={blockRecipe("blockTitle")}>Contribution lifecycle</h2>
          <p className={blockRecipe("blockDescription")}>
            Layer rules for deciding whether work belongs in core, extended,
            app-local, or outside the design system.
          </p>
        </div>
        <Badge tone="info" variant="outline">
          {contributionLayerEntries.length} layers
        </Badge>
      </header>

      <div className={cn(blockRecipe("blockPanel"), "overflow-x-auto")}>
        <Table className="min-w-[1100px]" variant="plain">
          <TableHeader>
            <TableRow>
              <TableHead>Layer</TableHead>
              <TableHead>Scope rule</TableHead>
              <TableHead>Evidence</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Exit rule</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contributionLayerEntries.map((layer) => (
              <TableRow key={layer.id}>
                <TableCell className="min-w-48 align-top">
                  <div className="grid gap-1">
                    <span className="font-medium text-text-primary">
                      {layer.name}
                    </span>
                    <span className="font-mono text-[11px] text-text-secondary leading-4">
                      {layer.id}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="min-w-80 align-top text-text-secondary">
                  {layer.scopeRule}
                </TableCell>
                <TableCell className="min-w-72 align-top">
                  <div className="flex flex-wrap gap-1.5">
                    {layer.requiredEvidence.map((evidence) => (
                      <Badge
                        key={`${layer.id}-${evidence}`}
                        tone="neutral"
                        variant="outline"
                      >
                        {evidence}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="min-w-40 align-top text-text-secondary">
                  {layer.defaultOwner}
                </TableCell>
                <TableCell className="min-w-80 align-top text-text-secondary">
                  {layer.exitRule}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  ),
};

export const LifecycleStages: Story = {
  render: () => (
    <section
      className={cn(
        "w-[min(980px,calc(100vw-32px))]",
        blockRecipe("blockShell", "blockStack")
      )}
    >
      <header className={blockRecipe("blockHeader")}>
        <div className={blockRecipe("blockHeaderContent")}>
          <h2 className={blockRecipe("blockTitle")}>Lifecycle stages</h2>
          <p className={blockRecipe("blockDescription")}>
            The minimum decision path from proposal to adoption, promotion, or
            retirement.
          </p>
        </div>
      </header>

      <div className={cn(blockRecipe("blockPanel"), "grid gap-3 p-4")}>
        {contributionLifecycleEntries.map((stage, index) => (
          <div
            className="grid gap-2 border-border-subtle border-b pb-3 last:border-b-0 last:pb-0"
            key={stage.id}
          >
            <div className="flex min-w-0 items-center gap-2">
              <Badge tone="info" variant="outline">
                {index + 1}
              </Badge>
              <span className="font-medium text-text-primary">
                {stage.name}
              </span>
            </div>
            <p className="m-0 text-text-secondary text-xs leading-5">
              {stage.decision}
            </p>
            <p className="m-0 text-text-tertiary text-xs leading-5">
              Output: {stage.output}
            </p>
          </div>
        ))}
      </div>
    </section>
  ),
};
