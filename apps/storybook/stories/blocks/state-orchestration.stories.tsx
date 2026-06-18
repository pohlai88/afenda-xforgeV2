import type { BlockStateInput } from "@repo/design-system";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  orchestrateBlockState,
  resolveStateSignal,
} from "@repo/design-system";
import type { Meta, StoryObj } from "@storybook/react";

import { layoutStoryParameters } from "../../.storybook/essentials";

const meta = {
  title: "Blocks/Quality Gates/State Orchestration",
  tags: ["autodocs", "block"],
  parameters: {
    ...layoutStoryParameters,
    layout: "centered",
    docs: {
      description: {
        component:
          "Standard block state orchestration for loading, empty, error, forbidden, readonly, offline, autosave, conflict, and SLA breach metadata.",
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const stateCases = [
  {
    detail: "Data source is resolving and operator actions are paused.",
    id: "loading",
    input: { isLoading: true },
    label: "Loading",
  },
  {
    detail: "No records exist for the current tenant, period, or filter.",
    id: "empty",
    input: { isEmpty: true },
    label: "Empty",
  },
  {
    detail: "The data source failed and the block stays in error tone.",
    id: "error",
    input: { error: true },
    label: "Error",
  },
  {
    detail: "Permissions block the operator from mutating this surface.",
    id: "forbidden",
    input: { isForbidden: true },
    label: "Forbidden",
  },
  {
    detail: "The block is visible but read-only until context changes.",
    id: "readonly",
    input: { isReadonly: true },
    label: "Readonly",
  },
  {
    detail: "Offline save state disables server-side actions.",
    id: "offline",
    input: { isOffline: true },
    label: "Offline",
  },
  {
    detail: "Autosave is idle and the block remains interactive.",
    id: "autosave",
    input: { saveState: "idle" },
    label: "Autosave idle",
  },
  {
    detail: "Conflict blocks editing until merge resolution completes.",
    id: "conflict",
    input: { hasConflict: true },
    label: "Conflict",
  },
  {
    detail: "SLA watch keeps the block visible with warning tone.",
    id: "sla-watch",
    input: { riskLevel: "watch" },
    label: "SLA watch",
  },
  {
    detail: "SLA breach escalates the block to critical tone.",
    id: "sla-breach",
    input: { riskLevel: "breach" },
    label: "SLA breach",
  },
] satisfies readonly {
  readonly detail: string;
  readonly id: string;
  readonly input: BlockStateInput;
  readonly label: string;
}[];

const priorityCases = [
  {
    detail: "Forbidden wins over loading because access is denied.",
    id: "forbidden-over-loading",
    input: { isForbidden: true, isLoading: true },
    label: "Forbidden over loading",
  },
  {
    detail: "Error wins over conflict because the data source is unavailable.",
    id: "error-over-conflict",
    input: { error: true, hasConflict: true },
    label: "Error over conflict",
  },
  {
    detail: "Conflict wins over offline so merge resolution remains explicit.",
    id: "conflict-over-offline",
    input: { hasConflict: true, isOffline: true },
    label: "Conflict over offline",
  },
] satisfies readonly {
  readonly detail: string;
  readonly id: string;
  readonly input: BlockStateInput;
  readonly label: string;
}[];

function StatePreview({
  detail,
  id,
  input,
  label,
}: {
  readonly detail: string;
  readonly id: string;
  readonly input: BlockStateInput;
  readonly label: string;
}) {
  const resolved = orchestrateBlockState(input);
  const signal = resolveStateSignal(input);

  return (
    <Card data-slot={`orchestration-${id}`}>
      <CardHeader>
        <CardTitle>{label}</CardTitle>
        <CardDescription>{detail}</CardDescription>
      </CardHeader>
      <CardContent className="font-mono text-[12px] text-text-secondary">
        signal={signal}; state={resolved.state}; tone={resolved.tone};
        disabled={String(resolved.isInteractionDisabled)}; reason=
        {resolved.disabledReason ?? "none"}
      </CardContent>
    </Card>
  );
}

export const StateMatrix: Story = {
  render: () => (
    <main className="grid w-[min(960px,calc(100vw-32px))] min-w-0 gap-3">
      {stateCases.map((item) => (
        <StatePreview key={item.id} {...item} />
      ))}
    </main>
  ),
};

export const PriorityOrder: Story = {
  render: () => (
    <main className="grid w-[min(960px,calc(100vw-32px))] min-w-0 gap-3">
      {priorityCases.map((item) => (
        <StatePreview key={item.id} {...item} />
      ))}
    </main>
  ),
};
