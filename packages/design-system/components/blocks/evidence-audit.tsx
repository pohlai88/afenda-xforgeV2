import { cn } from "../../lib/utils";
import {
  CheckCircle2Icon,
  CircleAlertIcon,
  CircleDashedIcon,
  FileCheck2Icon,
  FileTextIcon,
  LockKeyholeIcon,
  ScaleIcon,
  ShieldAlertIcon,
} from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { Badge } from "../afenda-ui/badge";
import { Button } from "../afenda-ui/button";
import { Progress } from "../afenda-ui/progress";
import { blockRecipe } from "./block-recipes";
import type { BlockAction, BlockBaseProps, BlockTone } from "./foundation";
import { BlockActions } from "./foundation";

interface EvidenceMetaItem {
  readonly id: string;
  readonly label: ReactNode;
  readonly mono?: boolean;
  readonly tone?: BlockTone;
  readonly value: ReactNode;
}

interface RowEvidenceArtifact {
  readonly description?: ReactNode;
  readonly href?: string;
  readonly hrefLabel?: string;
  readonly id: string;
  readonly kind: ReactNode;
  readonly label: ReactNode;
  readonly owner?: ReactNode;
  readonly status: ReactNode;
  readonly tone?: BlockTone;
  readonly updatedAt?: ReactNode;
}

type RowEvidencePanelProps = ComponentProps<"aside"> &
  BlockBaseProps & {
    readonly actions?: readonly BlockAction[] | ReactNode;
    readonly artifacts: readonly RowEvidenceArtifact[];
    readonly description?: ReactNode;
    readonly fields: readonly EvidenceMetaItem[];
    readonly rowId: ReactNode;
    readonly rowLabel: ReactNode;
    readonly status?: EvidenceStatus;
    readonly title: ReactNode;
  };

function RowEvidencePanel({
  actions,
  artifacts,
  blockId,
  className,
  density = "default",
  description,
  fields,
  intent = "audit",
  rowId,
  rowLabel,
  state = "ready",
  status,
  title,
  tone = status?.tone ?? "neutral",
  ...props
}: RowEvidencePanelProps) {
  return (
    <aside
      className={cn(
        blockRecipe("blockPanel", "blockPanelPadding", "blockSection"),
        blockDensityClassName[density],
        className
      )}
      data-block-id={blockId}
      data-density={density}
      data-intent={intent}
      data-slot="row-evidence-panel-block"
      data-state={state}
      data-tone={tone}
      {...props}
    >
      <BlockHeader
        actions={actions}
        description={description}
        icon={<FileTextIcon aria-hidden="true" className="size-4" />}
        status={status}
        title={title}
      />

      <div className="grid min-w-0 gap-2 rounded-[var(--xforge-radius-md)] border border-border-default bg-surface px-3 py-2">
        <span className={blockRecipe("blockMetricLabel")}>{rowLabel}</span>
        <span
          className={cn(
            denseMonoClassName,
            "min-w-0 truncate font-semibold text-[13px] text-text-primary leading-5"
          )}
        >
          {rowId}
        </span>
      </div>

      <MetaGrid fields={fields} />

      <section className={blockRecipe("blockSection")}>
        <h3 className="font-medium text-[13px] text-text-primary leading-5">
          Evidence attached
        </h3>
        <ol className="grid min-w-0 divide-y divide-border-default overflow-hidden rounded-[var(--xforge-radius-md)] border border-border-default">
          {artifacts.map((artifact) => (
            <li className="grid min-w-0 gap-2 p-3" key={artifact.id}>
              <div className="flex min-w-0 items-start justify-between gap-3">
                <div className="grid min-w-0 gap-1">
                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <StatusDot tone={artifact.tone ?? "neutral"} />
                    <span className="min-w-0 truncate font-medium text-[13px] text-text-primary leading-5">
                      {artifact.label}
                    </span>
                    <Badge
                      tone={blockToneToBadgeTone[artifact.tone ?? "neutral"]}
                      variant="outline"
                    >
                      {artifact.kind}
                    </Badge>
                  </div>
                  {artifact.description ? (
                    <p className={blockRecipe("blockDescription")}>
                      {artifact.description}
                    </p>
                  ) : null}
                </div>
                <EvidenceLink
                  href={artifact.href}
                  label={artifact.label}
                  linkLabel={artifact.hrefLabel}
                />
              </div>
              <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-text-secondary leading-5">
                <span>{artifact.status}</span>
                {artifact.owner ? <span>{artifact.owner}</span> : null}
                {artifact.updatedAt ? (
                  <time className={denseMonoClassName}>
                    {artifact.updatedAt}
                  </time>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </section>
    </aside>
  );
}

interface ImmutableAuditEvent {
  readonly action: ReactNode;
  readonly actor: ReactNode;
  readonly hash?: ReactNode;
  readonly id: string;
  readonly outcome: ReactNode;
  readonly sequence?: ReactNode;
  readonly source?: ReactNode;
  readonly target?: ReactNode;
  readonly time: ReactNode;
  readonly tone?: BlockTone;
}

type ImmutableAuditTimelineProps = ComponentProps<"section"> &
  BlockBaseProps & {
    readonly actions?: readonly BlockAction[] | ReactNode;
    readonly description?: ReactNode;
    readonly events: readonly ImmutableAuditEvent[];
    readonly title: ReactNode;
  };

function ImmutableAuditTimeline({
  actions,
  blockId,
  className,
  density = "default",
  description,
  events,
  intent = "audit",
  state = "readonly",
  title,
  tone = "neutral",
  ...props
}: ImmutableAuditTimelineProps) {
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
      data-slot="immutable-audit-timeline-block"
      data-state={state}
      data-tone={tone}
      {...props}
    >
      <BlockHeader
        actions={actions}
        description={description}
        icon={<LockKeyholeIcon aria-hidden="true" className="size-4" />}
        status={{ label: "Immutable", tone: "success" }}
        title={title}
      />

      <ol className="grid min-w-0">
        {events.map((event, index) => (
          <li
            className="grid min-w-0 grid-cols-[1rem_minmax(0,1fr)] gap-3"
            key={event.id}
          >
            <div className="relative flex justify-center">
              <span
                aria-hidden="true"
                className={cn(
                  "mt-1.5 size-2.5 rounded-full ring-4 ring-surface-raised",
                  toneDotClassName[event.tone ?? "neutral"]
                )}
              />
              {index < events.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="absolute top-4 bottom-0 w-px bg-border-default"
                />
              ) : null}
            </div>
            <div className="grid min-w-0 gap-2 pb-4 last:pb-0">
              <div className="grid min-w-0 gap-1 sm:grid-cols-[7rem_minmax(0,1fr)_auto] sm:items-start">
                <time
                  className={cn(
                    denseMonoClassName,
                    "text-[12px] text-text-secondary leading-5"
                  )}
                >
                  {event.time}
                </time>
                <div className="grid min-w-0 gap-1">
                  <p className="min-w-0 text-[13px] leading-5">
                    <span className="font-medium text-text-primary">
                      {event.actor}
                    </span>{" "}
                    <span className="text-text-secondary">{event.action}</span>{" "}
                    {event.target ? (
                      <span className="font-medium text-text-primary">
                        {event.target}
                      </span>
                    ) : null}
                  </p>
                  <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-text-secondary leading-5">
                    {event.sequence ? (
                      <span className={denseMonoClassName}>
                        #{event.sequence}
                      </span>
                    ) : null}
                    {event.source ? <span>{event.source}</span> : null}
                    {event.hash ? (
                      <span
                        className={cn(denseMonoClassName, "min-w-0 truncate")}
                      >
                        {event.hash}
                      </span>
                    ) : null}
                  </div>
                </div>
                <InlineStatus
                  label={event.outcome}
                  tone={event.tone ?? "neutral"}
                />
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

interface ApprovalDecision {
  readonly actor: ReactNode;
  readonly decision: ReactNode;
  readonly evidenceCount?: number;
  readonly id: string;
  readonly policy?: ReactNode;
  readonly reason?: ReactNode;
  readonly role: ReactNode;
  readonly time: ReactNode;
  readonly tone?: BlockTone;
}

type ApprovalDecisionTrailProps = ComponentProps<"section"> &
  BlockBaseProps & {
    readonly actions?: readonly BlockAction[] | ReactNode;
    readonly decisions: readonly ApprovalDecision[];
    readonly description?: ReactNode;
    readonly title: ReactNode;
  };

function ApprovalDecisionTrail({
  actions,
  blockId,
  className,
  decisions,
  density = "default",
  description,
  intent = "approval",
  state = "ready",
  title,
  tone = "neutral",
  ...props
}: ApprovalDecisionTrailProps) {
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
      data-slot="approval-decision-trail-block"
      data-state={state}
      data-tone={tone}
      {...props}
    >
      <BlockHeader
        actions={actions}
        description={description}
        icon={<ScaleIcon aria-hidden="true" className="size-4" />}
        title={title}
      />

      <ol className="grid min-w-0 gap-3">
        {decisions.map((decision) => (
          <li
            className="grid min-w-0 gap-2 rounded-[var(--xforge-radius-md)] border border-border-default bg-surface px-3 py-2"
            key={decision.id}
          >
            <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <InlineStatus
                  label={decision.decision}
                  tone={decision.tone ?? "neutral"}
                />
                <span className="min-w-0 truncate font-medium text-[13px] text-text-primary leading-5">
                  {decision.actor}
                </span>
                <span className="text-[12px] text-text-secondary leading-5">
                  {decision.role}
                </span>
              </div>
              <time
                className={cn(
                  denseMonoClassName,
                  "text-[12px] text-text-secondary leading-5"
                )}
              >
                {decision.time}
              </time>
            </div>
            {decision.reason ? (
              <p className={blockRecipe("blockDescription")}>
                {decision.reason}
              </p>
            ) : null}
            <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-text-secondary leading-5">
              {decision.policy ? <span>{decision.policy}</span> : null}
              {typeof decision.evidenceCount === "number" ? (
                <span>{formatEvidenceCount(decision.evidenceCount)}</span>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

interface PolicyException {
  readonly description?: ReactNode;
  readonly dueAt?: ReactNode;
  readonly evidenceCount?: number;
  readonly id: string;
  readonly owner: ReactNode;
  readonly policy: ReactNode;
  readonly scope: ReactNode;
  readonly severity: ReactNode;
  readonly status: ReactNode;
  readonly tone?: BlockTone;
}

type PolicyExceptionSummaryProps = ComponentProps<"section"> &
  BlockBaseProps & {
    readonly actions?: readonly BlockAction[] | ReactNode;
    readonly description?: ReactNode;
    readonly exceptions: readonly PolicyException[];
    readonly summary?: ReactNode;
    readonly title: ReactNode;
  };

function PolicyExceptionSummary({
  actions,
  blockId,
  className,
  density = "default",
  description,
  exceptions,
  intent = "configuration",
  state = "ready",
  summary,
  title,
  tone = "warning",
  ...props
}: PolicyExceptionSummaryProps) {
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
      data-slot="policy-exception-summary-block"
      data-state={state}
      data-tone={tone}
      {...props}
    >
      <BlockHeader
        actions={actions}
        description={description}
        icon={<ShieldAlertIcon aria-hidden="true" className="size-4" />}
        status={{ label: summary ?? `${exceptions.length} exceptions`, tone }}
        title={title}
      />

      <div className="grid min-w-0 divide-y divide-border-default overflow-hidden rounded-[var(--xforge-radius-md)] border border-border-default">
        {exceptions.map((exception) => (
          <article className="grid min-w-0 gap-2 p-3" key={exception.id}>
            <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <StatusDot tone={exception.tone ?? "warning"} />
                <span className="min-w-0 truncate font-medium text-[13px] text-text-primary leading-5">
                  {exception.policy}
                </span>
                <Badge
                  tone={blockToneToBadgeTone[exception.tone ?? "warning"]}
                  variant="outline"
                >
                  {exception.severity}
                </Badge>
              </div>
              <span
                className={cn(
                  denseMonoClassName,
                  "text-[12px] text-text-secondary leading-5"
                )}
              >
                {exception.id}
              </span>
            </div>
            {exception.description ? (
              <p className={blockRecipe("blockDescription")}>
                {exception.description}
              </p>
            ) : null}
            <dl className="grid min-w-0 gap-2 text-[12px] leading-5 sm:grid-cols-4">
              <ExceptionDatum label="Scope" value={exception.scope} />
              <ExceptionDatum label="Owner" value={exception.owner} />
              <ExceptionDatum label="Status" value={exception.status} />
              <ExceptionDatum
                label="Evidence"
                value={
                  typeof exception.evidenceCount === "number"
                    ? exception.evidenceCount
                    : "Required"
                }
              />
            </dl>
            {exception.dueAt ? (
              <div
                className={cn(
                  denseMonoClassName,
                  "text-[12px] text-text-secondary leading-5"
                )}
              >
                Due {exception.dueAt}
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

interface EvidenceChecklistItem {
  readonly checked?: boolean;
  readonly description?: ReactNode;
  readonly dueAt?: ReactNode;
  readonly evidenceId?: ReactNode;
  readonly id: string;
  readonly label: ReactNode;
  readonly owner?: ReactNode;
  readonly required?: boolean;
  readonly status?: ReactNode;
  readonly tone?: BlockTone;
}

type EvidenceChecklistProps = ComponentProps<"section"> &
  BlockBaseProps & {
    readonly actions?: readonly BlockAction[] | ReactNode;
    readonly completion?: number;
    readonly description?: ReactNode;
    readonly items: readonly EvidenceChecklistItem[];
    readonly title: ReactNode;
  };

function EvidenceChecklist({
  actions,
  blockId,
  className,
  completion,
  density = "default",
  description,
  intent = "audit",
  items,
  state = "ready",
  title,
  tone = "neutral",
  ...props
}: EvidenceChecklistProps) {
  const checkedItemCount = countCheckedItems(items);
  const resolvedCompletion = clampPercentage(
    completion ?? calculateCompletion(items)
  );

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
      data-slot="evidence-checklist-block"
      data-state={state}
      data-tone={tone}
      {...props}
    >
      <BlockHeader
        actions={actions}
        description={description}
        icon={<FileCheck2Icon aria-hidden="true" className="size-4" />}
        status={{
          label: `${Math.round(resolvedCompletion)}% complete`,
          tone: resolvedCompletion === 100 ? "success" : "warning",
        }}
        title={title}
      />

      <div className="grid gap-2">
        <Progress
          aria-label="Evidence checklist completion"
          tone={resolvedCompletion === 100 ? "success" : "warning"}
          value={resolvedCompletion}
        />
        <span
          className={cn(
            denseMonoClassName,
            "text-[12px] text-text-secondary leading-5"
          )}
        >
          {checkedItemCount} of {items.length} items attached
        </span>
      </div>

      <ol className="grid min-w-0 divide-y divide-border-default overflow-hidden rounded-[var(--xforge-radius-md)] border border-border-default">
        {items.map((item) => (
          <li
            className="grid min-w-0 grid-cols-[1rem_minmax(0,1fr)] gap-3 p-3"
            key={item.id}
          >
            <ChecklistStateIcon checked={item.checked} tone={item.tone} />
            <div className="grid min-w-0 gap-1">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <span className="min-w-0 truncate font-medium text-[13px] text-text-primary leading-5">
                  {item.label}
                </span>
                {item.required ? (
                  <Badge tone="warning" variant="outline">
                    Required
                  </Badge>
                ) : null}
                {item.status ? (
                  <InlineStatus
                    label={item.status}
                    tone={item.tone ?? (item.checked ? "success" : "neutral")}
                  />
                ) : null}
              </div>
              {item.description ? (
                <p className={blockRecipe("blockDescription")}>
                  {item.description}
                </p>
              ) : null}
              <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-text-secondary leading-5">
                {item.evidenceId ? (
                  <span className={denseMonoClassName}>{item.evidenceId}</span>
                ) : null}
                {item.owner ? <span>{item.owner}</span> : null}
                {item.dueAt ? (
                  <time className={denseMonoClassName}>{item.dueAt}</time>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

interface EvidenceStatus {
  readonly label: ReactNode;
  readonly tone?: BlockTone;
}

function BlockHeader({
  actions,
  description,
  icon,
  status,
  title,
}: {
  readonly actions?: readonly BlockAction[] | ReactNode;
  readonly description?: ReactNode;
  readonly icon: ReactNode;
  readonly status?: EvidenceStatus;
  readonly title: ReactNode;
}) {
  return (
    <header className={blockRecipe("blockHeader")}>
      <div className={blockRecipe("blockHeaderContent")}>
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="grid size-7 shrink-0 place-items-center rounded-[var(--xforge-radius-sm)] border border-border-default bg-surface text-text-secondary">
            {icon}
          </span>
          <h2 className={blockRecipe("blockTitle")}>{title}</h2>
          {status ? (
            <Badge
              tone={blockToneToBadgeTone[status.tone ?? "neutral"]}
              variant="outline"
            >
              {status.label}
            </Badge>
          ) : null}
        </div>
        {description ? (
          <p className={blockRecipe("blockDescription")}>{description}</p>
        ) : null}
      </div>
      <BlockActions actions={actions} />
    </header>
  );
}

function MetaGrid({
  fields,
}: {
  readonly fields: readonly EvidenceMetaItem[];
}) {
  return (
    <dl className="grid min-w-0 grid-cols-1 gap-0 overflow-hidden rounded-[var(--xforge-radius-md)] border border-border-default sm:grid-cols-2">
      {fields.map((field) => (
        <div
          className="grid min-w-0 gap-1 border-border-default border-b p-3 last:border-b-0 sm:border-r sm:[&:nth-child(2n)]:border-r-0 sm:[&:nth-last-child(-n+2)]:border-b-0"
          key={field.id}
        >
          <dt className={blockRecipe("blockMetricLabel")}>{field.label}</dt>
          <dd
            className={cn(
              "min-w-0 truncate font-medium text-[13px] text-text-primary leading-5",
              field.mono && denseMonoClassName,
              toneTextClassName[field.tone ?? "neutral"]
            )}
          >
            {field.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function EvidenceLink({
  href,
  label,
  linkLabel,
}: {
  readonly href?: string;
  readonly label: ReactNode;
  readonly linkLabel?: string;
}) {
  if (!href) {
    return null;
  }

  const accessibleLabel =
    linkLabel ??
    (typeof label === "string"
      ? `Open evidence ${label}`
      : "Open evidence attachment");

  return (
    <Button asChild size="sm" variant="quiet">
      <a aria-label={accessibleLabel} href={href}>
        Open
      </a>
    </Button>
  );
}

function InlineStatus({
  label,
  tone,
}: {
  readonly label: ReactNode;
  readonly tone: BlockTone;
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 text-[12px] leading-5",
        toneTextClassName[tone]
      )}
    >
      <StatusDot tone={tone} />
      {label}
    </span>
  );
}

function StatusDot({ tone }: { readonly tone: BlockTone }) {
  return (
    <span
      aria-hidden="true"
      className={cn("size-1.5 shrink-0 rounded-full", toneDotClassName[tone])}
    />
  );
}

function ExceptionDatum({
  label,
  value,
}: {
  readonly label: ReactNode;
  readonly value: ReactNode;
}) {
  return (
    <div className="grid min-w-0 gap-0.5">
      <dt className="text-text-secondary">{label}</dt>
      <dd
        className={cn(
          "min-w-0 truncate font-medium text-text-primary",
          typeof value === "number" && denseMonoClassName
        )}
      >
        {value}
      </dd>
    </div>
  );
}

function ChecklistStateIcon({
  checked,
  tone = checked ? "success" : "neutral",
}: {
  readonly checked?: boolean;
  readonly tone?: BlockTone;
}) {
  if (checked) {
    return (
      <CheckCircle2Icon
        aria-hidden="true"
        className={cn("mt-0.5 size-4", toneTextClassName[tone])}
      />
    );
  }

  if (tone === "warning" || tone === "critical") {
    return (
      <CircleAlertIcon
        aria-hidden="true"
        className={cn("mt-0.5 size-4", toneTextClassName[tone])}
      />
    );
  }

  return (
    <CircleDashedIcon
      aria-hidden="true"
      className="mt-0.5 size-4 text-text-tertiary"
    />
  );
}

function calculateCompletion(items: readonly EvidenceChecklistItem[]) {
  if (!items.length) {
    return 0;
  }

  return (countCheckedItems(items) / items.length) * 100;
}

function countCheckedItems(items: readonly EvidenceChecklistItem[]) {
  return items.filter((item) => item.checked).length;
}

function clampPercentage(value: number) {
  if (Number.isNaN(value)) {
    return 0;
  }

  return Math.min(100, Math.max(0, value));
}

function formatEvidenceCount(count: number) {
  return `${count} evidence ${count === 1 ? "item" : "items"}`;
}

const blockDensityClassName = {
  compact: blockRecipe("blockCompact"),
  comfortable: blockRecipe("blockComfortable"),
  default: blockRecipe("blockComfortable"),
} as const;

const denseMonoClassName = "font-mono tabular-nums slashed-zero";

const toneTextClassName: Record<BlockTone, string> = {
  critical: "text-critical",
  info: "text-info",
  neutral: "text-text-secondary",
  success: "text-success",
  warning: "text-warning",
};

const toneDotClassName: Record<BlockTone, string> = {
  critical: "bg-critical",
  info: "bg-info",
  neutral: "bg-text-tertiary",
  success: "bg-success",
  warning: "bg-warning",
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

export {
  ApprovalDecisionTrail,
  EvidenceChecklist,
  ImmutableAuditTimeline,
  PolicyExceptionSummary,
  RowEvidencePanel,
};
export type {
  ApprovalDecision,
  ApprovalDecisionTrailProps,
  EvidenceChecklistItem,
  EvidenceChecklistProps,
  EvidenceMetaItem,
  EvidenceStatus,
  ImmutableAuditEvent,
  ImmutableAuditTimelineProps,
  PolicyException,
  PolicyExceptionSummaryProps,
  RowEvidenceArtifact,
  RowEvidencePanelProps,
};
