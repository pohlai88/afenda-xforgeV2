"use client";

import { Progress } from "@repo/design-system/components/afenda-ui/progress";
import { Separator } from "@repo/design-system/components/afenda-ui/separator";
import { cn } from "@repo/design-system/lib/utils";
import {
  AccessibilityIcon,
  CheckCircle2Icon,
  CircleDashedIcon,
  FileStackIcon,
  MonitorCheckIcon,
  MousePointerClickIcon,
  ScanLineIcon,
  ShieldAlertIcon,
  TerminalSquareIcon,
} from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { blockRecipe } from "./block-recipes";
import type { BlockAction, BlockTone } from "./foundation";
import { PageHeader } from "./foundation";

type QualityGateState = "passed" | "running" | "queued" | "failed" | "blocked";

interface QualityGateItem {
  readonly command?: string;
  readonly description: ReactNode;
  readonly id: string;
  readonly label: ReactNode;
  readonly owner?: ReactNode;
  readonly state: QualityGateState;
}

interface QualityGateViewport {
  readonly id: string;
  readonly label: ReactNode;
  readonly state: QualityGateState;
  readonly width: number | "wide";
}

type QualityGatesBlockProps = ComponentProps<"section"> & {
  readonly actions?: readonly BlockAction[] | ReactNode;
  readonly gates: readonly QualityGateItem[];
  readonly progress?: number;
  readonly status?: {
    readonly label: string;
    readonly tone?: BlockTone;
  };
  readonly title?: ReactNode;
  readonly updatedAt?: ReactNode;
  readonly viewports?: readonly QualityGateViewport[];
};

const qualityGateStateMeta: Record<
  QualityGateState,
  {
    readonly icon: ReactNode;
    readonly label: string;
    readonly tone: "neutral" | "info" | "success" | "warning" | "critical";
  }
> = {
  blocked: {
    icon: <ShieldAlertIcon aria-hidden="true" className="size-4" />,
    label: "Blocked",
    tone: "warning",
  },
  failed: {
    icon: <ShieldAlertIcon aria-hidden="true" className="size-4" />,
    label: "Failed",
    tone: "critical",
  },
  passed: {
    icon: <CheckCircle2Icon aria-hidden="true" className="size-4" />,
    label: "Passed",
    tone: "success",
  },
  queued: {
    icon: <CircleDashedIcon aria-hidden="true" className="size-4" />,
    label: "Queued",
    tone: "neutral",
  },
  running: {
    icon: <ScanLineIcon aria-hidden="true" className="size-4" />,
    label: "Running",
    tone: "info",
  },
};

const gateIconById: Record<string, ReactNode> = {
  accessibility: <AccessibilityIcon aria-hidden="true" className="size-4" />,
  interaction: <MousePointerClickIcon aria-hidden="true" className="size-4" />,
  overflow: <MonitorCheckIcon aria-hidden="true" className="size-4" />,
  snapshots: <FileStackIcon aria-hidden="true" className="size-4" />,
  typecheck: <TerminalSquareIcon aria-hidden="true" className="size-4" />,
};

function QualityGatesBlock({
  actions,
  className,
  gates,
  progress,
  status = { label: "Quality gated", tone: "info" },
  title = "Block quality gates",
  updatedAt,
  viewports,
  ...props
}: QualityGatesBlockProps) {
  const completedCount = gates.filter((gate) => gate.state === "passed").length;
  const resolvedProgress =
    progress ??
    (gates.length ? Math.round((completedCount / gates.length) * 100) : 0);

  return (
    <section
      className={cn(blockRecipe("blockShell", "blockStack"), className)}
      data-slot="quality-gates-block"
      {...props}
    >
      <PageHeader
        actions={actions}
        description="Release checklist for ERP blocks: compile safety, Storybook behavior, a11y, visual snapshots, and responsive overflow."
        meta={
          updatedAt
            ? [
                {
                  id: "updated",
                  label: updatedAt,
                },
              ]
            : undefined
        }
        status={status}
        title={title}
      />
      <div
        className={cn(
          blockRecipe("blockPanel", "blockPanelPadding"),
          "grid min-w-0 gap-4"
        )}
      >
        <div className="grid gap-2">
          <div className="flex min-w-0 items-center justify-between gap-3">
            <span className={blockRecipe("blockMetricLabel")}>
              Gate completion
            </span>
            <span className="font-mono text-text-primary text-xs tabular-nums">
              {completedCount}/{gates.length}
            </span>
          </div>
          <Progress
            aria-label="Quality gate completion"
            tone={progressTone(gates)}
            value={resolvedProgress}
          />
        </div>

        {gates.length ? (
          <ol className="grid min-w-0 divide-y divide-border-default overflow-hidden rounded-[var(--xforge-radius-md)] border border-border-default">
            {gates.map((gate) => (
              <li
                className="grid min-w-0 gap-2 bg-surface px-3 py-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                key={gate.id}
              >
                <div className="grid min-w-0 grid-cols-[auto_1fr] gap-2">
                  <span
                    className={cn(
                      "mt-0.5 text-text-tertiary",
                      stateToneClassName[qualityGateStateMeta[gate.state].tone]
                    )}
                  >
                    {gateIconById[gate.id] ??
                      qualityGateStateMeta[gate.state].icon}
                  </span>
                  <div className="grid min-w-0 gap-1">
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      <span className="font-medium text-sm text-text-primary">
                        {gate.label}
                      </span>
                      <QualityGateStateLabel state={gate.state} />
                    </div>
                    <p className={blockRecipe("blockDescription")}>
                      {gate.description}
                    </p>
                    {gate.command ? (
                      <code className="min-w-0 truncate font-mono text-[11px] text-text-secondary">
                        {gate.command}
                      </code>
                    ) : null}
                  </div>
                </div>
                {gate.owner ? (
                  <span className="justify-self-start whitespace-nowrap text-text-secondary text-xs sm:justify-self-end">
                    {gate.owner}
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
        ) : (
          <div className={cn(blockRecipe("blockEmpty"), "min-h-24 p-4")}>
            No quality gates are configured for this block.
          </div>
        )}

        {viewports?.length ? (
          <>
            <Separator />
            <div className="grid min-w-0 gap-3">
              <div className="flex min-w-0 items-center justify-between gap-3">
                <h3 className={blockRecipe("blockTitle")}>Overflow contract</h3>
                <span className={blockRecipe("blockMetricLabel")}>
                  740px / 1024px / wide
                </span>
              </div>
              <dl className="grid min-w-0 divide-y divide-border-default overflow-hidden rounded-[var(--xforge-radius-md)] border border-border-default">
                {viewports.map((viewport) => (
                  <div
                    className="grid min-w-0 gap-2 bg-surface px-3 py-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                    key={viewport.id}
                  >
                    <dt className="flex min-w-0 items-center gap-2">
                      <span className="min-w-0 truncate font-medium text-text-primary text-xs">
                        {viewport.label}
                      </span>
                      <QualityGateStateLabel state={viewport.state} />
                    </dt>
                    <dd className="font-mono text-text-secondary text-xs tabular-nums sm:text-right">
                      {formatViewportWidth(viewport.width)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}

function QualityGateStateLabel({
  state,
}: {
  readonly state: QualityGateState;
}) {
  const meta = qualityGateStateMeta[state];

  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-text-secondary text-xs">
      <span
        aria-hidden="true"
        className={cn("size-1.5 rounded-full", stateDotClassName[meta.tone])}
      />
      {meta.label}
    </span>
  );
}

function formatViewportWidth(width: QualityGateViewport["width"]) {
  return width === "wide" ? "wide desktop" : `${width}px`;
}

function progressTone(
  gates: readonly QualityGateItem[]
): ComponentProps<typeof Progress>["tone"] {
  if (gates.some((gate) => gate.state === "failed")) {
    return "danger";
  }

  if (gates.some((gate) => gate.state === "blocked")) {
    return "warning";
  }

  if (gates.every((gate) => gate.state === "passed")) {
    return "success";
  }

  return "brand";
}

const stateToneClassName = {
  critical: "text-danger",
  info: "text-info",
  neutral: "text-text-tertiary",
  success: "text-success",
  warning: "text-warning",
} as const;

const stateDotClassName = {
  critical: "bg-danger",
  info: "bg-info",
  neutral: "bg-text-tertiary",
  success: "bg-success",
  warning: "bg-warning",
} as const;

export { QualityGatesBlock };
export type {
  QualityGateItem,
  QualityGateState,
  QualityGateViewport,
  QualityGatesBlockProps,
};
