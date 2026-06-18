import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../afenda-ui/alert";
import { Badge } from "../afenda-ui/badge";
import { Button } from "../afenda-ui/button";
import { Progress } from "../afenda-ui/progress";
import { Separator } from "../afenda-ui/separator";
import { Skeleton } from "../afenda-ui/skeleton";
import { cn } from "../../lib/utils";
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  ClockIcon,
  CloudOffIcon,
  RotateCcwIcon,
  SaveIcon,
  ShieldAlertIcon,
  ShieldOffIcon,
} from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { blockRecipe } from "./block-recipes";
import type {
  BlockAction,
  BlockBaseProps,
  BlockDensity,
  BlockRuntimeState,
  BlockTone,
} from "./foundation";
import { BlockActions } from "./foundation";

type ErpSaveState =
  | "idle"
  | "saving"
  | "saved"
  | "offline"
  | "conflict"
  | "error";

type ErpRiskLevel = "none" | "watch" | "breach" | "critical";

type ReversibleBulkMode = "idle" | "confirming" | "applied" | "reverted";

interface RuntimeStateBlockProps
  extends Omit<ComponentProps<"section">, "title">,
    BlockBaseProps {
  readonly actions?: readonly BlockAction[] | ReactNode;
  readonly description?: ReactNode;
  readonly details?: ReactNode;
  readonly state: BlockRuntimeState;
  readonly title?: ReactNode;
}

function RuntimeStateBlock({
  actions,
  blockId,
  className,
  density = "default",
  description,
  details,
  intent = "operation",
  state,
  title,
  tone,
  ...props
}: RuntimeStateBlockProps) {
  const meta = runtimeStateMeta[state];
  const resolvedTone = tone ?? meta.tone;
  const Icon = meta.icon;

  return (
    <section
      className={cn(
        blockRecipe("blockPanel", "blockPanelPadding"),
        "grid",
        blockDensityClassName[density],
        className
      )}
      data-block-id={blockId}
      data-density={density}
      data-intent={intent}
      data-slot="runtime-state-block"
      data-state={state}
      data-tone={resolvedTone}
      {...props}
    >
      <Alert tone={blockToneToAlertTone[resolvedTone]}>
        <Icon aria-hidden="true" />
        <AlertTitle>{title ?? meta.title}</AlertTitle>
        <AlertDescription>
          {description ?? meta.description}
          {details ? (
            <div className="mt-2 text-text-secondary">{details}</div>
          ) : null}
        </AlertDescription>
      </Alert>

      {state === "loading" ? (
        <div aria-hidden="true" className="grid gap-2">
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-8 w-full" />
        </div>
      ) : null}

      <BlockActions actions={actions} />
    </section>
  );
}

interface SaveStateStripProps
  extends Omit<ComponentProps<"section">, "title">,
    BlockBaseProps {
  readonly actions?: readonly BlockAction[] | ReactNode;
  readonly detail?: ReactNode;
  readonly lastSavedAt?: ReactNode;
  readonly saveState: ErpSaveState;
  readonly title?: ReactNode;
}

function SaveStateStrip({
  actions,
  blockId,
  className,
  density = "compact",
  detail,
  intent = "operation",
  lastSavedAt,
  saveState,
  state = saveStateToRuntimeState[saveState],
  title,
  tone = saveStateMeta[saveState].tone,
  ...props
}: SaveStateStripProps) {
  const meta = saveStateMeta[saveState];
  const Icon = meta.icon;

  return (
    <section
      className={cn(
        blockRecipe("blockPanel"),
        "flex min-w-0 flex-col gap-2 px-3 py-2 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
      data-block-id={blockId}
      data-density={density}
      data-intent={intent}
      data-save-state={saveState}
      data-slot="save-state-strip-block"
      data-state={state}
      data-tone={tone}
      {...props}
    >
      <div className="flex min-w-0 items-start gap-2">
        <Icon
          aria-hidden="true"
          className={cn("mt-0.5 size-4 shrink-0", toneTextClassName[tone])}
        />
        <div className="grid min-w-0 gap-0.5">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <span className="font-medium text-[13px] text-text-primary leading-5">
              {title ?? meta.title}
            </span>
            <Badge tone={blockToneToBadgeTone[tone]} variant="outline">
              {meta.badge}
            </Badge>
          </div>
          <p className={blockRecipe("blockDescription")}>
            {detail ?? meta.description}
            {lastSavedAt ? (
              <span className="ml-1 font-mono tabular-nums">{lastSavedAt}</span>
            ) : null}
          </p>
          {saveState === "saving" ? (
            <Progress
              aria-label="Save progress"
              className="mt-1 h-1"
              tone="info"
              value={64}
            />
          ) : null}
        </div>
      </div>
      <BlockActions actions={actions} />
    </section>
  );
}

interface SlaRiskEscalationPanelProps
  extends Omit<ComponentProps<"section">, "title">,
    BlockBaseProps {
  readonly actions?: readonly BlockAction[] | ReactNode;
  readonly description?: ReactNode;
  readonly dueAt?: ReactNode;
  readonly evidence?: readonly {
    readonly id: string;
    readonly label: ReactNode;
    readonly value: ReactNode;
  }[];
  readonly progress?: number;
  readonly riskLevel: ErpRiskLevel;
  readonly slaLabel: ReactNode;
  readonly title: ReactNode;
}

function SlaRiskEscalationPanel({
  actions,
  blockId,
  className,
  density = "default",
  description,
  dueAt,
  evidence,
  intent = "risk",
  progress,
  riskLevel,
  slaLabel,
  state = "ready",
  title,
  tone = riskLevelMeta[riskLevel].tone,
  ...props
}: SlaRiskEscalationPanelProps) {
  const meta = riskLevelMeta[riskLevel];

  return (
    <section
      className={cn(
        blockRecipe("blockPanel", "blockPanelPadding", "blockSection"),
        blockDensityClassName[density],
        className
      )}
      data-block-id={blockId}
      data-density={density}
      data-intent={intent}
      data-risk-level={riskLevel}
      data-slot="sla-risk-escalation-panel-block"
      data-state={state}
      data-tone={tone}
      {...props}
    >
      <header className={blockRecipe("blockHeader")}>
        <div className={blockRecipe("blockHeaderContent")}>
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <h2 className={blockRecipe("blockTitle")}>{title}</h2>
            <Badge tone={blockToneToBadgeTone[tone]} variant="outline">
              {meta.label}
            </Badge>
          </div>
          {description ? (
            <p className={blockRecipe("blockDescription")}>{description}</p>
          ) : null}
        </div>
        <BlockActions actions={actions} />
      </header>

      <div className="grid gap-3 rounded-[var(--xforge-radius-md)] border border-border-default bg-surface p-3">
        <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="font-semibold text-[20px] text-text-primary leading-none">
              {slaLabel}
            </div>
            <div className={blockRecipe("blockDescription")}>
              {dueAt ? <>Due {dueAt}</> : meta.description}
            </div>
          </div>
          {typeof progress === "number" ? (
            <span className="font-mono text-[12px] text-text-secondary tabular-nums leading-5">
              {progress}% elapsed
            </span>
          ) : null}
        </div>
        {typeof progress === "number" ? (
          <Progress
            aria-label="SLA elapsed"
            tone={blockToneToProgressTone[tone]}
            value={progress}
          />
        ) : null}
      </div>

      {evidence?.length ? (
        <>
          <Separator />
          <dl className="grid gap-2 sm:grid-cols-3">
            {evidence.map((item) => (
              <div className="grid gap-0.5" key={item.id}>
                <dt className={blockRecipe("blockMetricLabel")}>
                  {item.label}
                </dt>
                <dd className="truncate font-medium text-[13px] text-text-primary leading-5">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </>
      ) : null}
    </section>
  );
}

interface ReversibleBulkActionBarProps
  extends Omit<ComponentProps<"section">, "title">,
    BlockBaseProps {
  readonly actionLabel: string;
  readonly cancelLabel?: string;
  readonly confirmLabel?: string;
  readonly mode: ReversibleBulkMode;
  readonly onCancel?: ComponentProps<typeof Button>["onClick"];
  readonly onConfirm?: ComponentProps<typeof Button>["onClick"];
  readonly onUndo?: ComponentProps<typeof Button>["onClick"];
  readonly selectedCount: number;
  readonly summary?: ReactNode;
  readonly undoLabel?: string;
}

function ReversibleBulkActionBar({
  actionLabel,
  blockId,
  cancelLabel = "Cancel",
  className,
  confirmLabel,
  density = "compact",
  intent = "operation",
  mode,
  onCancel,
  onConfirm,
  onUndo,
  selectedCount,
  state = "ready",
  summary,
  tone = reversibleModeTone[mode],
  undoLabel = "Undo",
  ...props
}: ReversibleBulkActionBarProps) {
  const meta = reversibleModeMeta[mode];
  const isConfirming = mode === "confirming";
  const isApplied = mode === "applied";

  return (
    <section
      className={cn(
        blockRecipe("blockPanel"),
        "flex min-w-0 flex-col gap-2 px-3 py-2 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
      data-block-id={blockId}
      data-bulk-mode={mode}
      data-density={density}
      data-intent={intent}
      data-slot="reversible-bulk-action-bar-block"
      data-state={state}
      data-tone={tone}
      {...props}
    >
      <div className="flex min-w-0 items-start gap-2">
        <RotateCcwIcon
          aria-hidden="true"
          className={cn("mt-0.5 size-4 shrink-0", toneTextClassName[tone])}
        />
        <div className="grid min-w-0 gap-0.5">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <span className="font-medium text-[13px] text-text-primary leading-5">
              {selectedCount} selected
            </span>
            <Badge tone={blockToneToBadgeTone[tone]} variant="outline">
              {meta.label}
            </Badge>
          </div>
          <p className={blockRecipe("blockDescription")}>
            {summary ?? meta.description(actionLabel)}
          </p>
        </div>
      </div>

      <div className={blockRecipe("blockToolbar")}>
        {isConfirming ? (
          <>
            <Button onClick={onCancel} size="sm" variant="quiet">
              {cancelLabel}
            </Button>
            <Button onClick={onConfirm} size="sm" variant="primary">
              {confirmLabel ?? actionLabel}
            </Button>
          </>
        ) : null}
        {isApplied ? (
          <Button onClick={onUndo} size="sm" variant="secondary">
            {undoLabel}
          </Button>
        ) : null}
      </div>
    </section>
  );
}

const runtimeStateMeta: Record<
  BlockRuntimeState,
  {
    readonly description: ReactNode;
    readonly icon: typeof ClockIcon;
    readonly title: ReactNode;
    readonly tone: BlockTone;
  }
> = {
  empty: {
    description: "No operational records match this context.",
    icon: CheckCircle2Icon,
    title: "No records",
    tone: "neutral",
  },
  error: {
    description: "The block could not load its operational data.",
    icon: AlertTriangleIcon,
    title: "Data unavailable",
    tone: "critical",
  },
  forbidden: {
    description: "Current permissions do not allow this block to be viewed.",
    icon: ShieldOffIcon,
    title: "Access restricted",
    tone: "critical",
  },
  loading: {
    description: "Loading governed ERP data.",
    icon: ClockIcon,
    title: "Loading",
    tone: "info",
  },
  readonly: {
    description: "This block is available for inspection but cannot be edited.",
    icon: ShieldAlertIcon,
    title: "Read-only",
    tone: "warning",
  },
  ready: {
    description: "The block is ready for operator work.",
    icon: CheckCircle2Icon,
    title: "Ready",
    tone: "success",
  },
};

const saveStateMeta: Record<
  ErpSaveState,
  {
    readonly badge: string;
    readonly description: ReactNode;
    readonly icon: typeof ClockIcon;
    readonly title: ReactNode;
    readonly tone: BlockTone;
  }
> = {
  conflict: {
    badge: "Conflict",
    description: "A newer version exists. Review differences before saving.",
    icon: ShieldAlertIcon,
    title: "Save conflict",
    tone: "critical",
  },
  error: {
    badge: "Failed",
    description: "The last save attempt failed.",
    icon: AlertTriangleIcon,
    title: "Save failed",
    tone: "critical",
  },
  idle: {
    badge: "Idle",
    description: "Changes are staged locally until saved.",
    icon: ClockIcon,
    title: "Autosave idle",
    tone: "neutral",
  },
  offline: {
    badge: "Offline",
    description:
      "Changes are queued locally and will sync when connection returns.",
    icon: CloudOffIcon,
    title: "Offline queue",
    tone: "warning",
  },
  saved: {
    badge: "Saved",
    description: "All changes are synchronized.",
    icon: CheckCircle2Icon,
    title: "Saved",
    tone: "success",
  },
  saving: {
    badge: "Saving",
    description: "Persisting changes and validating downstream policy.",
    icon: SaveIcon,
    title: "Saving",
    tone: "info",
  },
};

const saveStateToRuntimeState: Record<ErpSaveState, BlockRuntimeState> = {
  conflict: "error",
  error: "error",
  idle: "ready",
  offline: "readonly",
  saved: "ready",
  saving: "loading",
};

const riskLevelMeta: Record<
  ErpRiskLevel,
  {
    readonly description: ReactNode;
    readonly label: string;
    readonly tone: BlockTone;
  }
> = {
  breach: {
    description: "SLA is breached and requires escalation.",
    label: "SLA breach",
    tone: "critical",
  },
  critical: {
    description: "Critical risk requires immediate operator action.",
    label: "Critical risk",
    tone: "critical",
  },
  none: {
    description: "No risk escalation is active.",
    label: "On track",
    tone: "success",
  },
  watch: {
    description: "SLA or policy risk is approaching its threshold.",
    label: "Risk watch",
    tone: "warning",
  },
};

const reversibleModeMeta: Record<
  ReversibleBulkMode,
  {
    readonly description: (actionLabel: string) => ReactNode;
    readonly label: string;
  }
> = {
  applied: {
    description: (actionLabel) =>
      `${actionLabel} has been applied and can be reversed.`,
    label: "Applied",
  },
  confirming: {
    description: (actionLabel) =>
      `Confirm ${actionLabel} before changing selected records.`,
    label: "Confirm required",
  },
  idle: {
    description: (actionLabel) =>
      `${actionLabel} is available for selected records.`,
    label: "Ready",
  },
  reverted: {
    description: () => "The last bulk change was reversed.",
    label: "Reverted",
  },
};

const reversibleModeTone: Record<ReversibleBulkMode, BlockTone> = {
  applied: "success",
  confirming: "warning",
  idle: "neutral",
  reverted: "info",
};

const blockDensityClassName: Record<BlockDensity, string> = {
  compact: blockRecipe("blockCompact"),
  comfortable: blockRecipe("blockComfortable"),
  default: blockRecipe("blockComfortable"),
};

const blockToneToAlertTone: Record<
  BlockTone,
  ComponentProps<typeof Alert>["tone"]
> = {
  critical: "critical",
  info: "info",
  neutral: "neutral",
  success: "success",
  warning: "warning",
};

const blockToneToBadgeTone: Record<
  BlockTone,
  ComponentProps<typeof Badge>["tone"]
> = {
  critical: "critical",
  info: "info",
  neutral: "neutral",
  success: "success",
  warning: "warning",
};

const blockToneToProgressTone: Record<
  BlockTone,
  ComponentProps<typeof Progress>["tone"]
> = {
  critical: "critical",
  info: "info",
  neutral: "neutral",
  success: "success",
  warning: "warning",
};

const toneTextClassName: Record<BlockTone, string> = {
  critical: "text-critical",
  info: "text-info",
  neutral: "text-text-secondary",
  success: "text-success",
  warning: "text-warning",
};

export {
  ReversibleBulkActionBar,
  RuntimeStateBlock,
  SaveStateStrip,
  SlaRiskEscalationPanel,
};
export type {
  ErpRiskLevel,
  ErpSaveState,
  ReversibleBulkActionBarProps,
  ReversibleBulkMode,
  RuntimeStateBlockProps,
  SaveStateStripProps,
  SlaRiskEscalationPanelProps,
};
