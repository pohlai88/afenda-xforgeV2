import { enterpriseScreenPatternEntries } from "@repo/design-system/contracts/enterprise-screen-patterns";
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
  title: "Blocks/Quality Gates/Enterprise Screen Patterns",
  tags: ["autodocs", "block"],
  parameters: {
    ...layoutStoryParameters,
    layout: "centered",
    docs: {
      description: {
        component:
          "Enterprise ERP screen patterns that explain how Afenda blocks compose into complete product screens.",
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const ScreenPatternCatalog: Story = {
  render: () => (
    <section
      className={cn(
        "w-[min(1180px,calc(100vw-32px))]",
        blockRecipe("blockShell", "blockStack")
      )}
    >
      <header className={blockRecipe("blockHeader")}>
        <div className={blockRecipe("blockHeaderContent")}>
          <h2 className={blockRecipe("blockTitle")}>
            Enterprise screen patterns
          </h2>
          <p className={blockRecipe("blockDescription")}>
            ERP screen assembly rules for approval, posting, audit, policy,
            reconciliation, exception, tenant, and job-monitoring workflows.
          </p>
        </div>
        <Badge tone="info" variant="outline">
          {enterpriseScreenPatternEntries.length} screens
        </Badge>
      </header>

      <div className={cn(blockRecipe("blockPanel"), "overflow-x-auto")}>
        <Table className="min-w-[1180px]" variant="plain">
          <TableHeader>
            <TableRow>
              <TableHead>Screen</TableHead>
              <TableHead>Use when</TableHead>
              <TableHead>Blocks</TableHead>
              <TableHead>States</TableHead>
              <TableHead>Gates</TableHead>
              <TableHead>Do</TableHead>
              <TableHead>Do not</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enterpriseScreenPatternEntries.map((pattern) => (
              <TableRow key={pattern.id}>
                <TableCell className="min-w-56 align-top">
                  <div className="grid gap-1">
                    <span className="font-medium text-text-primary">
                      {pattern.name}
                    </span>
                    <span className="font-mono text-[11px] text-text-secondary leading-4">
                      {pattern.id} / {pattern.density}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="min-w-80 align-top text-text-secondary">
                  {pattern.whenToUse}
                </TableCell>
                <TableCell className="min-w-72 align-top">
                  <BadgeList items={pattern.blocks} tone="neutral" />
                </TableCell>
                <TableCell className="min-w-72 align-top">
                  <BadgeList items={pattern.states} tone="info" />
                </TableCell>
                <TableCell className="min-w-72 align-top">
                  <BadgeList items={pattern.gates} tone="positive" />
                </TableCell>
                <TableCell className="min-w-80 align-top text-text-secondary">
                  {pattern.do[0]}
                </TableCell>
                <TableCell className="min-w-80 align-top text-text-secondary">
                  {pattern.dont[0]}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  ),
};

function BadgeList({
  items,
  tone,
}: {
  readonly items: readonly string[];
  readonly tone: "info" | "neutral" | "positive";
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <Badge key={item} tone={tone} variant="outline">
          {item}
        </Badge>
      ))}
    </div>
  );
}
