import type { BlockStateInput } from "@repo/design-system/components/blocks";
import {
  orchestrateBlockState,
  RuntimeStateBlock,
  resolveStateSignal,
} from "@repo/design-system/components/blocks";
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
    detail: "A failed sync or broken binding blocks governed actions.",
    id: "error",
    input: { error: "Vendor evidence sync failed." },
    label: "Error",
  },
  {
    detail: "Permission policy blocks both visibility-sensitive actions.",
    id: "forbidden",
    input: { isForbidden: true },
    label: "Forbidden",
  },
  {
    detail: "The block can be inspected but not modified.",
    id: "readonly",
    input: { isReadonly: true },
    label: "Read-only",
  },
  {
    detail: "Local edits may queue, but server-side actions are disabled.",
    id: "offline",
    input: { isOffline: true },
    label: "Offline",
  },
  {
    detail: "Autosave is active and represented through the loading state.",
    id: "autosave",
    input: { saveState: "saving" },
    label: "Autosave",
  },
  {
    detail: "A newer version exists and must be resolved before editing.",
    id: "conflict",
    input: { hasConflict: true },
    label: "Conflict",
  },
  {
    detail: "SLA breach raises critical tone without blocking escalation.",
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
    detail: "Forbidden wins over loading so permission tracing is clear.",
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

export const StateMatrix: Story = {
  render: () => (
    <main className="grid w-[min(960px,calc(100vw-32px))] min-w-0 gap-3">
      {stateCases.map((item) => {
        const resolved = orchestrateBlockState(item.input);

        return (
          <RuntimeStateBlock
            blockId={`orchestration-${item.id}`}
            description={item.detail}
            details={
              <span className="font-mono text-[12px]">
                signal={resolved.signal}; disabled=
                {String(resolved.isInteractionDisabled)}
              </span>
            }
            key={item.id}
            state={resolved.state}
            title={item.label}
            tone={resolved.tone}
          />
        );
      })}
    </main>
  ),
};

export const PriorityOrder: Story = {
  render: () => (
    <main className="grid w-[min(960px,calc(100vw-32px))] min-w-0 gap-3">
      {priorityCases.map((item) => {
        const resolved = orchestrateBlockState(item.input);
        const signal = resolveStateSignal(item.input);

        return (
          <RuntimeStateBlock
            blockId={`orchestration-priority-${item.id}`}
            description={item.detail}
            details={
              <span className="font-mono text-[12px]">
                resolved={signal}; reason={resolved.disabledReason ?? "none"}
              </span>
            }
            key={item.id}
            state={resolved.state}
            title={item.label}
            tone={resolved.tone}
          />
        );
      })}
    </main>
  ),
};
