import { Badge } from "@repo/design-system/components/afenda-ui/badge";
import { Button } from "@repo/design-system/components/afenda-ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@repo/design-system/components/afenda-ui/empty";
import { Input } from "@repo/design-system/components/afenda-ui/input";
import { Separator } from "@repo/design-system/components/afenda-ui/separator";
import { cn } from "@repo/design-system/lib/utils";
import { SearchIcon, XIcon } from "lucide-react";
import type {
  ChangeEventHandler,
  ComponentProps,
  MouseEventHandler,
  ReactNode,
} from "react";
import { Fragment } from "react";
import { blockRecipe } from "./block-recipes";

type BlockDensity = "compact" | "default" | "comfortable";

type BlockIntent =
  | "approval"
  | "audit"
  | "configuration"
  | "operation"
  | "overview"
  | "risk"
  | "setup";

type BlockRuntimeState =
  | "empty"
  | "error"
  | "forbidden"
  | "loading"
  | "readonly"
  | "ready";

type BlockTone = "neutral" | "info" | "success" | "warning" | "critical";

interface BlockBaseProps {
  readonly blockId?: string;
  readonly density?: BlockDensity;
  readonly intent?: BlockIntent;
  readonly state?: BlockRuntimeState;
  readonly tone?: BlockTone;
}

interface BlockAction {
  readonly "aria-label"?: string;
  readonly auditEvent?: string;
  readonly auditScope?: string;
  readonly capability?: string;
  readonly confirmationLabel?: string;
  readonly destructive?: boolean;
  readonly disabled?: boolean;
  readonly governanceCode?: string;
  readonly governanceStatus?: "allowed" | "denied" | "hidden";
  readonly href?: string;
  readonly icon?: ReactNode;
  readonly key: string;
  readonly label: string;
  readonly onClick?: MouseEventHandler<HTMLButtonElement>;
  readonly permission?: string;
  readonly reason?: string;
  readonly roles?: readonly string[];
  readonly variant?: ComponentProps<typeof Button>["variant"];
}

interface PageHeaderMeta {
  readonly id: string;
  readonly label: ReactNode;
}

type PageHeaderProps = ComponentProps<"section"> &
  BlockBaseProps & {
    readonly title: ReactNode;
    readonly description?: ReactNode;
    readonly eyebrow?: ReactNode;
    readonly status?: {
      readonly label: string;
      readonly tone?: BlockTone;
    };
    readonly meta?: readonly PageHeaderMeta[];
    readonly actions?: readonly BlockAction[] | ReactNode;
  };

function PageHeader({
  blockId,
  density = "default",
  title,
  description,
  eyebrow,
  intent,
  state = "ready",
  status,
  meta,
  actions,
  tone = "neutral",
  className,
  children,
  ...props
}: PageHeaderProps) {
  return (
    <section
      className={cn(
        blockRecipe("blockShell", "blockStack"),
        blockDensityClassName[density],
        className
      )}
      data-block-id={blockId}
      data-density={density}
      data-intent={intent}
      data-slot="page-header-block"
      data-state={state}
      data-tone={tone}
      {...props}
    >
      <header className={blockRecipe("blockHeader")}>
        <div className={blockRecipe("blockHeaderContent")}>
          {eyebrow ? (
            <div className="text-[length:var(--xforge-font-caption-size)] text-text-secondary leading-[var(--xforge-font-caption-line-height)]">
              {eyebrow}
            </div>
          ) : null}
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <h1 className="truncate font-semibold text-[20px] text-text-primary leading-6">
              {title}
            </h1>
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
            <p className={cn(blockRecipe("blockDescription"), "max-w-3xl")}>
              {description}
            </p>
          ) : null}
          {meta?.length ? (
            <div className="flex min-w-0 flex-wrap items-center gap-2 text-[length:var(--xforge-font-caption-size)] text-text-secondary leading-[var(--xforge-font-caption-line-height)]">
              {meta.map((item, index) => (
                <Fragment key={item.id}>
                  {index > 0 ? <span aria-hidden="true">/</span> : null}
                  <span className="min-w-0 truncate">{item.label}</span>
                </Fragment>
              ))}
            </div>
          ) : null}
        </div>
        <BlockActions actions={actions} />
      </header>
      {children}
    </section>
  );
}

interface ActiveFilter {
  readonly id: string;
  readonly label: string;
  readonly onRemove?: () => void;
  readonly tone?: BlockTone;
}

type FilterBarProps = ComponentProps<"section"> &
  BlockBaseProps & {
    readonly searchValue?: string;
    readonly searchPlaceholder?: string;
    readonly searchLabel?: string;
    readonly onSearchChange?: ChangeEventHandler<HTMLInputElement>;
    readonly filters?: ReactNode;
    readonly activeFilters?: readonly ActiveFilter[];
    readonly resultCount?: number | string;
    readonly onReset?: () => void;
    readonly actions?: readonly BlockAction[] | ReactNode;
  };

function FilterBar({
  blockId,
  density = "default",
  searchValue,
  searchPlaceholder = "Search records...",
  searchLabel = "Search records",
  intent,
  state = "ready",
  onSearchChange,
  filters,
  activeFilters,
  resultCount,
  onReset,
  actions,
  tone = "neutral",
  className,
  children,
  ...props
}: FilterBarProps) {
  const hasActiveFilters = Boolean(activeFilters?.length);

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
      data-slot="filter-bar-block"
      data-state={state}
      data-tone={tone}
      {...props}
    >
      <div className="flex min-w-0 flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <label
            className="sr-only"
            htmlFor={props.id ? `${props.id}-search` : undefined}
          >
            {searchLabel}
          </label>
          <div className="relative min-w-56 flex-1 sm:max-w-80">
            <SearchIcon
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-tertiary"
            />
            <Input
              aria-label={props.id ? undefined : searchLabel}
              className="pl-9"
              id={props.id ? `${props.id}-search` : undefined}
              onChange={onSearchChange}
              placeholder={searchPlaceholder}
              value={searchValue}
            />
          </div>
          {filters}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {resultCount !== undefined ? (
            <span className="text-[length:var(--xforge-font-caption-size)] text-text-secondary tabular-nums leading-[var(--xforge-font-caption-line-height)]">
              {resultCount} results
            </span>
          ) : null}
          <BlockActions actions={actions} />
        </div>
      </div>

      {hasActiveFilters || onReset || children ? (
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          {activeFilters?.map((filter) => (
            <span
              className={cn(
                "inline-flex h-7 max-w-full shrink-0 items-center gap-1.5 rounded-[var(--xforge-radius-sm)] border px-2.5 font-medium text-[12px] leading-none",
                filterChipClassName[filter.tone ?? "neutral"]
              )}
              key={filter.id}
            >
              <span className="min-w-0 truncate">{filter.label}</span>
              {filter.onRemove ? (
                <button
                  aria-label={`Remove ${filter.label} filter`}
                  className="inline-flex size-4 shrink-0 items-center justify-center rounded-[var(--xforge-radius-sm)] outline-none hover:bg-surface-hover focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                  onClick={filter.onRemove}
                  type="button"
                >
                  <XIcon aria-hidden="true" className="size-3" />
                </button>
              ) : null}
            </span>
          ))}
          {onReset && hasActiveFilters ? (
            <Button onClick={onReset} size="sm" variant="link">
              Reset filters
            </Button>
          ) : null}
          {children}
        </div>
      ) : null}
    </section>
  );
}

interface StatsMetric {
  readonly description?: ReactNode;
  readonly icon?: ReactNode;
  readonly id: string;
  readonly label: ReactNode;
  readonly tone?: BlockTone;
  readonly value: ReactNode;
}

type StatsStripProps = ComponentProps<"section"> &
  BlockBaseProps & {
    readonly metrics: readonly StatsMetric[];
    readonly columns?: 2 | 3 | 4;
  };

const metricToneClassName: Record<BlockTone, string> = {
  neutral: "",
  info: "text-info",
  success: "text-success",
  warning: "text-warning",
  critical: "text-danger",
};

const filterChipClassName: Record<BlockTone, string> = {
  neutral: "border-border-default bg-surface text-text-primary",
  info: "border-info/50 bg-surface text-info",
  success: "border-success/50 bg-surface text-success",
  warning: "border-warning/60 bg-surface text-warning",
  critical: "border-danger/60 bg-surface text-danger",
};

const blockDensityClassName: Record<BlockDensity, string> = {
  compact: blockRecipe("blockCompact"),
  comfortable: blockRecipe("blockComfortable"),
  default: blockRecipe("blockComfortable"),
};

const blockToneToBadgeTone: Record<
  BlockTone,
  ComponentProps<typeof Badge>["tone"]
> = {
  critical: "critical",
  info: "info",
  neutral: "neutral",
  success: "positive",
  warning: "warning",
};

function StatsStrip({
  blockId,
  density = "default",
  metrics,
  columns = 4,
  intent = "overview",
  state = "ready",
  tone = "neutral",
  className,
  ...props
}: StatsStripProps) {
  return (
    <section
      className={cn(
        blockRecipe("blockShell"),
        "grid",
        blockDensityClassName[density],
        columns === 2 && "sm:grid-cols-2",
        columns === 3 && "sm:grid-cols-3",
        columns === 4 && "sm:grid-cols-2 xl:grid-cols-4",
        className
      )}
      data-block-id={blockId}
      data-density={density}
      data-intent={intent}
      data-slot="stats-strip-block"
      data-state={state}
      data-tone={tone}
      {...props}
    >
      {metrics.map((metric, index) => (
        <article
          className={cn(
            blockRecipe("blockPanel", "blockPanelPadding", "blockSection"),
            index === 0 && "bg-brand-primary/5"
          )}
          key={metric.id}
        >
          <div className="flex min-w-0 items-start justify-between gap-3">
            <div className="grid min-w-0 gap-2">
              <span className={blockRecipe("blockMetricLabel")}>
                {metric.label}
              </span>
              <strong
                className={cn(
                  blockRecipe("blockMetric"),
                  metricToneClassName[metric.tone ?? "neutral"]
                )}
              >
                {metric.value}
              </strong>
            </div>
            {metric.icon ? (
              <span className="flex size-8 shrink-0 items-center justify-center rounded-[var(--xforge-radius-md)] border border-border-default bg-surface-muted text-text-secondary [&>svg]:size-4">
                {metric.icon}
              </span>
            ) : null}
          </div>
          {metric.description ? (
            <p className={blockRecipe("blockDescription")}>
              {metric.description}
            </p>
          ) : null}
        </article>
      ))}
    </section>
  );
}

type EmptyPanelProps = ComponentProps<"section"> &
  BlockBaseProps & {
    readonly title: ReactNode;
    readonly description?: ReactNode;
    readonly icon?: ReactNode;
    readonly actions?: readonly BlockAction[] | ReactNode;
  };

function EmptyPanel({
  blockId,
  density = "default",
  title,
  description,
  icon,
  intent,
  actions,
  state = "empty",
  tone = "neutral",
  className,
  children,
  ...props
}: EmptyPanelProps) {
  return (
    <section
      className={className}
      data-block-id={blockId}
      data-density={density}
      data-intent={intent}
      data-slot="empty-panel-block"
      data-state={state}
      data-tone={tone}
      {...props}
    >
      <Empty
        className={cn(
          blockRecipe("blockEmpty"),
          blockDensityClassName[density],
          tone === "critical" && "border-danger/40 bg-danger-muted/40",
          tone === "success" && "border-success/40 bg-success-muted/30",
          tone === "warning" && "border-warning/40 bg-warning-muted/30"
        )}
      >
        <EmptyHeader>
          {icon ? <EmptyMedia variant="icon">{icon}</EmptyMedia> : null}
          <EmptyTitle className={blockRecipe("blockTitle")}>{title}</EmptyTitle>
          {description ? (
            <EmptyDescription>{description}</EmptyDescription>
          ) : null}
        </EmptyHeader>
        {children ? <EmptyContent>{children}</EmptyContent> : null}
        <BlockActions actions={actions} />
      </Empty>
    </section>
  );
}

type FormSectionProps = ComponentProps<"section"> &
  BlockBaseProps & {
    readonly title: ReactNode;
    readonly description?: ReactNode;
    readonly status?: {
      readonly label: string;
      readonly tone?: BlockTone;
    };
    readonly actions?: readonly BlockAction[] | ReactNode;
    readonly footer?: ReactNode;
  };

function FormSection({
  blockId,
  density = "default",
  title,
  description,
  intent,
  state = "ready",
  status,
  actions,
  tone = "neutral",
  footer,
  className,
  children,
  ...props
}: FormSectionProps) {
  return (
    <section
      className={cn(blockRecipe("blockPanel"), className)}
      data-block-id={blockId}
      data-density={density}
      data-intent={intent}
      data-slot="form-section-block"
      data-state={state}
      data-tone={tone}
      {...props}
    >
      <div
        className={cn(
          blockRecipe("blockPanelPadding"),
          "grid",
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
        <div className={blockRecipe("blockSection")}>{children}</div>
        {footer ? (
          <>
            <Separator />
            <div className="text-[length:var(--xforge-font-caption-size)] text-text-secondary leading-[var(--xforge-font-caption-line-height)]">
              {footer}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}

function BlockActions({
  actions,
}: {
  readonly actions?: readonly BlockAction[] | ReactNode;
}) {
  if (!actions) {
    return null;
  }

  if (isBlockActionArray(actions)) {
    return (
      <div className={blockRecipe("blockToolbar")}>
        {actions.map((action) => (
          <BlockActionButton action={action} key={action.key} />
        ))}
      </div>
    );
  }

  return <div className={blockRecipe("blockToolbar")}>{actions}</div>;
}

function isBlockActionArray(
  actions: readonly BlockAction[] | ReactNode
): actions is readonly BlockAction[] {
  return (
    Array.isArray(actions) &&
    actions.every(
      (action) =>
        action &&
        typeof action === "object" &&
        "key" in action &&
        typeof action.key === "string" &&
        "label" in action &&
        typeof action.label === "string"
    )
  );
}

function BlockActionButton({ action }: { readonly action: BlockAction }) {
  const reasonId = action.reason ? getActionReasonId(action) : undefined;
  const content = (
    <>
      {action.icon}
      {action.label}
    </>
  );

  const resolvedVariant =
    action.destructive && !action.disabled
      ? "destructive"
      : (action.variant ?? "secondary");

  if (action.href && !action.disabled) {
    return (
      <>
        <Button
          aria-describedby={reasonId}
          aria-label={action["aria-label"]}
          asChild
          data-audit-event={action.auditEvent}
          data-audit-scope={action.auditScope}
          data-capability={action.capability}
          data-confirmation-label={action.confirmationLabel}
          data-governance-code={action.governanceCode}
          data-governance-status={action.governanceStatus}
          data-permission={action.permission}
          data-reason={action.reason}
          data-required-roles={action.roles?.join(" ")}
          size="sm"
          title={action.reason}
          variant={resolvedVariant}
        >
          <a href={action.href}>{content}</a>
        </Button>
        <BlockActionReason reason={action.reason} reasonId={reasonId} />
      </>
    );
  }

  return (
    <>
      <Button
        aria-describedby={reasonId}
        aria-label={action["aria-label"]}
        data-audit-event={action.auditEvent}
        data-audit-scope={action.auditScope}
        data-capability={action.capability}
        data-confirmation-label={action.confirmationLabel}
        data-governance-code={action.governanceCode}
        data-governance-status={action.governanceStatus}
        data-permission={action.permission}
        data-reason={action.reason}
        data-required-roles={action.roles?.join(" ")}
        disabled={action.disabled}
        onClick={action.onClick}
        size="sm"
        title={action.reason}
        variant={resolvedVariant}
      >
        {content}
      </Button>
      <BlockActionReason reason={action.reason} reasonId={reasonId} />
    </>
  );
}

function BlockActionReason({
  reason,
  reasonId,
}: {
  readonly reason?: string;
  readonly reasonId?: string;
}) {
  if (!(reason && reasonId)) {
    return null;
  }

  return (
    <span className="sr-only" id={reasonId}>
      {reason}
    </span>
  );
}

function getActionReasonId(action: BlockAction) {
  return `${action.auditScope ?? "block"}-${action.key}-action-reason`.replace(
    /[^A-Za-z0-9_-]/g,
    "-"
  );
}

export {
  BlockActionButton,
  BlockActions,
  EmptyPanel,
  FilterBar,
  FormSection,
  PageHeader,
  StatsStrip,
};
export type {
  ActiveFilter,
  BlockAction,
  BlockBaseProps,
  BlockDensity,
  BlockIntent,
  BlockRuntimeState,
  BlockTone,
  EmptyPanelProps,
  FilterBarProps,
  FormSectionProps,
  PageHeaderMeta,
  PageHeaderProps,
  StatsMetric,
  StatsStripProps,
};
