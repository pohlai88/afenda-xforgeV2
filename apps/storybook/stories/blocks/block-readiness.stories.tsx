import {
  Badge,
  Button,
  blockRecipe,
  blockRegistryEntries,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/design-system";
import { cn } from "@repo/design-system/lib/utils";
import type { Meta, StoryObj } from "@storybook/react";
import { FilterIcon, PlusIcon } from "lucide-react";

import { layoutStoryParameters } from "../../.storybook/essentials";

const meta = {
  title: "Blocks/Block Readiness",
  tags: ["autodocs", "block"],
  parameters: {
    ...layoutStoryParameters,
    layout: "centered",
    docs: {
      description: {
        component:
          "Governance preview for Afenda blocks. This story demonstrates block recipes and layout contracts before production block components are introduced.",
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const contractRows = [
  ["Northwind Trading", "Jordan Lee", "Pending", "4h"],
  ["Contoso Retail", "Maya Chen", "Approved", "1d"],
  ["Fabrikam Health", "Omar Ali", "Review", "2h"],
] as const satisfies readonly (readonly [
  tenant: string,
  owner: string,
  status: "Approved" | "Pending" | "Review",
  sla: string,
])[];

const statsMetrics = [
  ["Open approvals", "18"],
  ["SLA risk", "4"],
  ["Audit events", "236"],
] as const satisfies readonly (readonly [label: string, value: string])[];

export const DataTableShellContract: Story = {
  render: () => (
    <section
      className={cn(
        "w-[min(880px,calc(100vw-2rem))]",
        blockRecipe("blockShell", "blockStack")
      )}
    >
      <header className={blockRecipe("blockHeader")}>
        <div className={blockRecipe("blockHeaderContent")}>
          <h2 className={blockRecipe("blockTitle")}>Tenant approvals</h2>
          <p className={blockRecipe("blockDescription")}>
            Governed shell pattern for evidence tables, filters, and reversible
            actions.
          </p>
        </div>
        <div className={blockRecipe("blockToolbar")}>
          <Badge tone="warning">3 pending</Badge>
          <Button size="sm" variant="secondary">
            <PlusIcon aria-hidden="true" className="size-4" />
            New request
          </Button>
        </div>
      </header>

      <div
        className={cn(
          blockRecipe("blockPanel", "blockPanelPadding", "blockSection")
        )}
      >
        <div className={blockRecipe("blockToolbar")}>
          <Input
            aria-label="Search tenant approval contracts"
            className="max-w-64"
            placeholder="Search tenants..."
          />
          <Button size="sm" variant="quiet">
            <FilterIcon aria-hidden="true" className="size-4" />
            Filters
          </Button>
        </div>

        <Table variant="plain">
          <TableHeader>
            <TableRow>
              <TableHead>Tenant</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">SLA</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contractRows.map(([tenant, owner, status, sla]) => (
              <TableRow key={tenant}>
                <TableCell className="font-medium">{tenant}</TableCell>
                <TableCell>{owner}</TableCell>
                <TableCell>
                  <Badge
                    tone={status === "Approved" ? "success" : "warning"}
                    variant="outline"
                  >
                    {status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-text-secondary">
                  {sla}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  ),
};

export const StatsAndEmptyContracts: Story = {
  render: () => (
    <section
      className={cn(
        "w-[min(760px,calc(100vw-2rem))]",
        blockRecipe("blockShell", "blockStack")
      )}
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {statsMetrics.map(([label, value]) => (
          <div
            className={cn(
              blockRecipe("blockPanel", "blockPanelPadding", "blockSection")
            )}
            key={label}
          >
            <span className={blockRecipe("blockMetricLabel")}>{label}</span>
            <strong className={blockRecipe("blockMetric")}>{value}</strong>
          </div>
        ))}
      </div>

      <div className={cn(blockRecipe("blockEmpty"), "p-4")}>
        <div className="grid gap-2">
          <h2 className={blockRecipe("blockTitle")}>No exceptions found</h2>
          <p className={blockRecipe("blockDescription")}>
            This empty state is governed by block recipes, not one-off card
            styling.
          </p>
        </div>
      </div>
    </section>
  ),
};

export const SupportedBlockRegistry: Story = {
  render: () => (
    <section
      className={cn(
        "w-[min(920px,calc(100vw-2rem))]",
        blockRecipe("blockShell", "blockStack")
      )}
    >
      <header className={blockRecipe("blockHeader")}>
        <div className={blockRecipe("blockHeaderContent")}>
          <h2 className={blockRecipe("blockTitle")}>
            Supported block registry
          </h2>
          <p className={blockRecipe("blockDescription")}>
            Canonical map of block types available to app builders and registry
            consumers.
          </p>
        </div>
        <Badge tone="success" variant="outline">
          {blockRegistryEntries.length} blocks
        </Badge>
      </header>

      <div className={cn(blockRecipe("blockPanel"), "overflow-x-auto")}>
        <Table variant="plain">
          <TableHeader>
            <TableRow>
              <TableHead>Block type</TableHead>
              <TableHead>Component</TableHead>
              <TableHead>Family</TableHead>
              <TableHead>Data slot</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blockRegistryEntries.map((entry) => (
              <TableRow key={entry.type}>
                <TableCell className="font-mono tabular-nums">
                  {entry.type}
                </TableCell>
                <TableCell className="font-mono tabular-nums">
                  {entry.importName}
                </TableCell>
                <TableCell>
                  <Badge tone="neutral" variant="outline">
                    {entry.family}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono tabular-nums">
                  {entry.dataSlot}
                </TableCell>
                <TableCell className="max-w-80 text-text-secondary">
                  {entry.description}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  ),
};
