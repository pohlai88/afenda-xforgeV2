import { Badge } from "@repo/design-system/components/afenda-ui/badge";
import { Button } from "@repo/design-system/components/afenda-ui/button";
import { Separator } from "@repo/design-system/components/afenda-ui/separator";
import { cn } from "@repo/design-system/lib/utils";
import { CheckCircle2Icon, CircleIcon, XIcon } from "lucide-react";
import type { ComponentProps, MouseEventHandler, ReactNode } from "react";
import { blockRecipe } from "./block-recipes";
import type { BlockAction, BlockBaseProps, BlockTone } from "./foundation";
import { BlockActions } from "./foundation";

type OperatorTone = BlockTone;

interface OperatorStatus {
  readonly label: string;
  readonly tone?: OperatorTone;
}

type DataTableShellProps = ComponentProps<"section"> &
  BlockBaseProps & {
    readonly title: ReactNode;
    readonly description?: ReactNode;
    readonly actions?: readonly BlockAction[] | ReactNode;
    readonly bulkActions?: ReactNode;
    readonly empty?: ReactNode;
    readonly footer?: ReactNode;
    readonly isLoading?: boolean;
    readonly pagination?: ReactNode;
    readonly selectedCount?: number;
    readonly status?: OperatorStatus;
    readonly toolbar?: ReactNode;
  };

function DataTableShell({
  blockId,
  density = "default",
  title,
  description,
  actions,
  bulkActions,
  empty,
  footer,
  isLoading = false,
  intent = "operation",
  pagination,
  selectedCount,
  state = isLoading ? "loading" : "ready",
  status,
  tone = "neutral",
  toolbar,
  className,
  children,
  ...props
}: DataTableShellProps) {
  const hasSelection = typeof selectedCount === "number" && selectedCount > 0;

  return (
    <section
      aria-busy={isLoading}
      className={cn(
        blockRecipe("blockPanel"),
        "min-w-0 overflow-hidden",
        className
      )}
      data-block-id={blockId}
      data-density={density}
      data-intent={intent}
      data-slot="data-table-shell-block"
      data-state={state}
      data-tone={tone}
      {...props}
    >
      <div
        className={cn(
          blockRecipe("blockPanelPadding"),
          "grid pb-3",
          blockDensityClassName[density]
        )}
      >
        <header className={blockRecipe("blockHeader")}>
          <div className={blockRecipe("blockHeaderContent")}>
            <div className="flex min-w-0 flex-wrap items-center gap-2">
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

        {toolbar ? (
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            {toolbar}
          </div>
        ) : null}
      </div>

      {bulkActions ? (
        <div className="border-border-default border-y bg-brand-primary/5 px-[var(--card-padding)] py-2">
          {bulkActions}
        </div>
      ) : null}

      <div
        className={cn(
          "min-w-0 overflow-x-auto",
          isLoading && "pointer-events-none opacity-70"
        )}
        data-selected={hasSelection ? "" : undefined}
      >
        {children ?? empty}
      </div>

      {footer || pagination ? (
        <footer className="flex min-w-0 flex-col gap-2 border-border-default border-t px-[var(--card-padding)] py-3 sm:flex-row sm:items-center sm:justify-between">
          {footer ? (
            <div className={blockRecipe("blockDescription")}>{footer}</div>
          ) : (
            <span aria-hidden="true" />
          )}
          {pagination}
        </footer>
      ) : null}
    </section>
  );
}

interface EntitySummaryField {
  readonly id: string;
  readonly label: ReactNode;
  readonly meta?: ReactNode;
  readonly mono?: boolean;
  readonly tone?: OperatorTone;
  readonly value: ReactNode;
}

type EntitySummaryPanelProps = ComponentProps<"section"> &
  BlockBaseProps & {
    readonly title: ReactNode;
    readonly actions?: readonly BlockAction[] | ReactNode;
    readonly description?: ReactNode;
    readonly fields: readonly EntitySummaryField[];
    readonly status?: OperatorStatus;
  };

function EntitySummaryPanel({
  blockId,
  density = "default",
  title,
  actions,
  description,
  fields,
  intent = "overview",
  state = "ready",
  status,
  tone = "neutral",
  className,
  children,
  ...props
}: EntitySummaryPanelProps) {
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
      data-slot="entity-summary-panel-block"
      data-state={state}
      data-tone={tone}
      {...props}
    >
      <header className={blockRecipe("blockHeader")}>
        <div className={blockRecipe("blockHeaderContent")}>
          <div className="flex min-w-0 flex-wrap items-center gap-2">
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
                field.mono && "font-mono tabular-nums",
                toneTextClassName[field.tone ?? "neutral"]
              )}
            >
              {field.value}
            </dd>
            {field.meta ? (
              <dd className={blockRecipe("blockDescription")}>{field.meta}</dd>
            ) : null}
          </div>
        ))}
      </dl>
      {children}
    </section>
  );
}

interface AuditTrailEvent {
  readonly action: ReactNode;
  readonly actor: ReactNode;
  readonly id: string;
  readonly outcome?: ReactNode;
  readonly target?: ReactNode;
  readonly time: ReactNode;
  readonly tone?: OperatorTone;
}

type AuditTrailPanelProps = ComponentProps<"section"> &
  BlockBaseProps & {
    readonly title: ReactNode;
    readonly actions?: readonly BlockAction[] | ReactNode;
    readonly description?: ReactNode;
    readonly events: readonly AuditTrailEvent[];
  };

function AuditTrailPanel({
  blockId,
  density = "default",
  title,
  actions,
  description,
  events,
  intent = "audit",
  state = "ready",
  tone = "neutral",
  className,
  ...props
}: AuditTrailPanelProps) {
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
      data-slot="audit-trail-panel-block"
      data-state={state}
      data-tone={tone}
      {...props}
    >
      <header className={blockRecipe("blockHeader")}>
        <div className={blockRecipe("blockHeaderContent")}>
          <h2 className={blockRecipe("blockTitle")}>{title}</h2>
          {description ? (
            <p className={blockRecipe("blockDescription")}>{description}</p>
          ) : null}
        </div>
        <BlockActions actions={actions} />
      </header>

      <ol className="grid min-w-0 divide-y divide-border-default overflow-hidden rounded-[var(--xforge-radius-md)] border border-border-default">
        {events.map((event) => (
          <li
            className="grid min-w-0 gap-2 p-3 sm:grid-cols-[7.5rem_minmax(0,1fr)_auto] sm:items-center"
            key={event.id}
          >
            <time className="font-mono text-[12px] text-text-secondary tabular-nums leading-5">
              {event.time}
            </time>
            <div className="grid min-w-0 gap-0.5">
              <div className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[13px] leading-5">
                <span className="font-medium text-text-primary">
                  {event.actor}
                </span>
                <span className="text-text-secondary">{event.action}</span>
                {event.target ? (
                  <span className="min-w-0 truncate text-text-primary">
                    {event.target}
                  </span>
                ) : null}
              </div>
            </div>
            {event.outcome ? (
              <span
                className={cn(
                  "inline-flex w-fit items-center gap-1.5 text-[12px] leading-5",
                  toneTextClassName[event.tone ?? "neutral"]
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "size-1.5 rounded-full",
                    toneDotClassName[event.tone ?? "neutral"]
                  )}
                />
                {event.outcome}
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}

type BulkActionBarProps = ComponentProps<"output"> &
  Pick<BlockBaseProps, "blockId" | "density" | "intent" | "state" | "tone"> & {
    readonly selectedCount: number;
    readonly actions?: readonly BlockAction[] | ReactNode;
    readonly clearLabel?: string;
    readonly label?: ReactNode;
    readonly onClear?: MouseEventHandler<HTMLButtonElement>;
  };

function BulkActionBar({
  blockId,
  density = "default",
  selectedCount,
  actions,
  clearLabel = "Clear selection",
  intent = "operation",
  label,
  onClear,
  state = "ready",
  tone = "neutral",
  className,
  ...props
}: BulkActionBarProps) {
  return (
    <output
      className={cn(
        "flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
        blockDensityClassName[density],
        className
      )}
      data-block-id={blockId}
      data-density={density}
      data-intent={intent}
      data-slot="bulk-action-bar-block"
      data-state={state}
      data-tone={tone}
      {...props}
    >
      <div className="flex min-w-0 items-center gap-2">
        <CheckCircle2Icon
          aria-hidden="true"
          className="size-4 shrink-0 text-brand-primary"
        />
        <span className="min-w-0 truncate font-medium text-[13px] text-text-primary leading-5">
          {label ?? `${selectedCount} selected`}
        </span>
      </div>
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <BlockActions actions={actions} />
        {onClear ? (
          <>
            <Separator className="hidden h-5 sm:block" orientation="vertical" />
            <Button onClick={onClear} size="sm" variant="quiet">
              <XIcon aria-hidden="true" className="size-4" />
              {clearLabel}
            </Button>
          </>
        ) : null}
      </div>
    </output>
  );
}

interface StatusTimelineItem {
  readonly description?: ReactNode;
  readonly id: string;
  readonly label: ReactNode;
  readonly meta?: ReactNode;
  readonly time?: ReactNode;
  readonly tone?: OperatorTone;
}

type StatusTimelineProps = ComponentProps<"section"> &
  BlockBaseProps & {
    readonly title: ReactNode;
    readonly actions?: readonly BlockAction[] | ReactNode;
    readonly description?: ReactNode;
    readonly items: readonly StatusTimelineItem[];
  };

function StatusTimeline({
  blockId,
  density = "default",
  title,
  actions,
  description,
  intent = "operation",
  items,
  state = "ready",
  tone = "neutral",
  className,
  ...props
}: StatusTimelineProps) {
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
      data-slot="status-timeline-block"
      data-state={state}
      data-tone={tone}
      {...props}
    >
      <header className={blockRecipe("blockHeader")}>
        <div className={blockRecipe("blockHeaderContent")}>
          <h2 className={blockRecipe("blockTitle")}>{title}</h2>
          {description ? (
            <p className={blockRecipe("blockDescription")}>{description}</p>
          ) : null}
        </div>
        <BlockActions actions={actions} />
      </header>

      <ol className="grid min-w-0">
        {items.map((item, index) => (
          <li
            className="grid min-w-0 grid-cols-[1rem_minmax(0,1fr)] gap-3"
            key={item.id}
          >
            <div className="relative flex justify-center">
              <span
                aria-hidden="true"
                className={cn(
                  "mt-1.5 size-2.5 rounded-full ring-4 ring-surface-raised",
                  toneDotClassName[item.tone ?? "neutral"]
                )}
              />
              {index < items.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="absolute top-4 bottom-0 w-px bg-border-default"
                />
              ) : null}
            </div>
            <div className="grid min-w-0 gap-1 pb-4 last:pb-0">
              <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <span className="min-w-0 truncate font-medium text-[13px] text-text-primary leading-5">
                  {item.label}
                </span>
                {item.time ? (
                  <time className="font-mono text-[12px] text-text-secondary tabular-nums leading-5">
                    {item.time}
                  </time>
                ) : null}
              </div>
              {item.description ? (
                <p className={blockRecipe("blockDescription")}>
                  {item.description}
                </p>
              ) : null}
              {item.meta ? (
                <div className="flex min-w-0 items-center gap-1.5 text-[12px] text-text-secondary leading-5">
                  <CircleIcon aria-hidden="true" className="size-2" />
                  <span className="min-w-0 truncate">{item.meta}</span>
                </div>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

const toneTextClassName: Record<OperatorTone, string> = {
  critical: "text-danger",
  info: "text-info",
  neutral: "text-text-secondary",
  success: "text-success",
  warning: "text-warning",
};

const toneDotClassName: Record<OperatorTone, string> = {
  critical: "bg-danger",
  info: "bg-info",
  neutral: "bg-text-tertiary",
  success: "bg-success",
  warning: "bg-warning",
};

const blockDensityClassName = {
  compact: blockRecipe("blockCompact"),
  comfortable: blockRecipe("blockComfortable"),
  default: blockRecipe("blockComfortable"),
} as const;

const blockToneToBadgeTone: Record<
  OperatorTone,
  ComponentProps<typeof Badge>["tone"]
> = {
  critical: "critical",
  info: "info",
  neutral: "neutral",
  success: "positive",
  warning: "warning",
};

export {
  AuditTrailPanel,
  BulkActionBar,
  DataTableShell,
  EntitySummaryPanel,
  StatusTimeline,
};
export type {
  AuditTrailEvent,
  AuditTrailPanelProps,
  BulkActionBarProps,
  DataTableShellProps,
  EntitySummaryField,
  EntitySummaryPanelProps,
  OperatorStatus,
  OperatorTone,
  StatusTimelineItem,
  StatusTimelineProps,
};
