import { afendaPatternLibraryEntries } from "@repo/design-system/contracts/pattern-library";
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
  title: "Blocks/Quality Gates/Afenda Pattern Library",
  tags: ["autodocs", "block"],
  parameters: {
    ...layoutStoryParameters,
    layout: "centered",
    docs: {
      description: {
        component:
          "Governed ERP pattern library for composing Afenda blocks into app-team workflows without adding new block families.",
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const PatternCatalog: Story = {
  render: () => (
    <section
      className={cn(
        "w-[min(1180px,calc(100vw-32px))]",
        blockRecipe("blockShell", "blockStack")
      )}
    >
      <header className={blockRecipe("blockHeader")}>
        <div className={blockRecipe("blockHeaderContent")}>
          <h2 className={blockRecipe("blockTitle")}>Afenda pattern library</h2>
          <p className={blockRecipe("blockDescription")}>
            App-team rules for approval, posting, audit, reconciliation, lock,
            and long-running workflow compositions.
          </p>
        </div>
        <Badge tone="success" variant="outline">
          {afendaPatternLibraryEntries.length} patterns
        </Badge>
      </header>

      <div className={cn(blockRecipe("blockPanel"), "overflow-x-auto")}>
        <Table variant="plain">
          <TableHeader>
            <TableRow>
              <TableHead>Pattern</TableHead>
              <TableHead>Use when</TableHead>
              <TableHead>Required blocks</TableHead>
              <TableHead>States</TableHead>
              <TableHead>Risk rule</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {afendaPatternLibraryEntries.map((pattern) => (
              <TableRow key={pattern.id}>
                <TableCell className="min-w-48 align-top">
                  <div className="grid gap-1">
                    <span className="font-medium text-text-primary">
                      {pattern.name}
                    </span>
                    <span className="font-mono text-[11px] text-text-secondary leading-4">
                      {pattern.id}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="min-w-64 align-top text-text-secondary">
                  {pattern.whenToUse}
                </TableCell>
                <TableCell className="min-w-64 align-top">
                  <div className="flex flex-wrap gap-1.5">
                    {pattern.requiredBlocks.map((block) => (
                      <Badge
                        key={`${pattern.id}-${block.name}`}
                        tone="neutral"
                        variant="outline"
                      >
                        {block.name}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="min-w-52 align-top">
                  <div className="flex flex-wrap gap-1.5">
                    {pattern.requiredStates.map((state) => (
                      <Badge
                        key={`${pattern.id}-${state}`}
                        tone="info"
                        variant="outline"
                      >
                        {state}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="min-w-80 align-top text-text-secondary">
                  {pattern.riskRule}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  ),
};
