import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Separator,
} from "@repo/design-system/design-system";
import { cn } from "@repo/design-system/lib/utils";
import { AlertTriangleIcon, LockIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { blockRecipe } from "./block-recipes";
import type { BlockAction, BlockBaseProps, BlockDensity } from "./foundation";

interface PermissionAwareAction extends BlockAction {
  readonly roles?: readonly string[];
}

interface PermissionActionAuditItem {
  readonly id: string;
  readonly label: ReactNode;
  readonly mono?: boolean;
  readonly value: ReactNode;
}

type PermissionActionToolbarProps = ComponentProps<"section"> &
  BlockBaseProps & {
    readonly actions: readonly PermissionAwareAction[];
    readonly currentRole?: string;
    readonly description?: ReactNode;
    readonly showDeniedActions?: boolean;
    readonly summary?: ReactNode;
    readonly title: ReactNode;
  };

function PermissionActionToolbar({
  actions,
  blockId,
  className,
  currentRole,
  density = "default",
  description,
  intent = "operation",
  showDeniedActions = true,
  state = "ready",
  summary,
  title,
  tone = "neutral",
  ...props
}: PermissionActionToolbarProps) {
  const evaluatedActions = actions
    .map((action) => evaluatePermissionAction(action, currentRole))
    .filter((action) => showDeniedActions || !action.denied);

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
      data-slot="permission-action-toolbar-block"
      data-state={state}
      data-tone={tone}
      {...props}
    >
      <header className={blockRecipe("blockHeader")}>
        <div className={blockRecipe("blockHeaderContent")}>
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <h2 className={blockRecipe("blockTitle")}>{title}</h2>
            {currentRole ? (
              <Badge tone="info" variant="outline">
                Role: {currentRole}
              </Badge>
            ) : null}
          </div>
          {description ? (
            <p className={blockRecipe("blockDescription")}>{description}</p>
          ) : null}
        </div>
        {summary ? (
          <div className="text-[length:var(--xforge-font-caption-size)] text-text-secondary tabular-nums leading-[var(--xforge-font-caption-line-height)]">
            {summary}
          </div>
        ) : null}
      </header>

      <div className="flex min-w-0 flex-wrap items-start gap-2">
        {evaluatedActions.map((action) => (
          <PermissionActionButton
            action={action}
            key={action.key}
            reasonId={`${action.key}-permission-reason`}
          />
        ))}
      </div>
    </section>
  );
}

type AuditSafeCriticalActionProps = ComponentProps<"section"> &
  Pick<BlockBaseProps, "blockId" | "density" | "intent" | "state" | "tone"> & {
    readonly action: PermissionAwareAction;
    readonly currentRole?: string;
    readonly description?: ReactNode;
    readonly evidence?: readonly PermissionActionAuditItem[];
    readonly title: ReactNode;
  };

function AuditSafeCriticalAction({
  action,
  blockId,
  className,
  currentRole,
  density = "default",
  description,
  evidence,
  intent = "risk",
  state = "ready",
  title,
  tone = "critical",
  ...props
}: AuditSafeCriticalActionProps) {
  const missingAuditEventReason = action.auditEvent
    ? undefined
    : "Critical actions require an audit event before they can run.";
  const auditedAction = evaluatePermissionAction(
    {
      ...action,
      critical: true,
      disabled: action.disabled || !action.auditEvent,
      reason: missingAuditEventReason ?? action.reason,
      variant: "critical",
    },
    currentRole
  );

  return (
    <section
      className={cn(
        blockRecipe("blockPanel", "blockPanelPadding"),
        "grid",
        blockDensityClassName[density],
        className
      )}
      data-audit-event={action.auditEvent}
      data-audit-scope={action.auditScope}
      data-block-id={blockId}
      data-density={density}
      data-intent={intent}
      data-slot="audit-safe-critical-action-block"
      data-state={state}
      data-tone={tone}
      {...props}
    >
      <header className={blockRecipe("blockHeader")}>
        <div className={blockRecipe("blockHeaderContent")}>
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <h2 className={blockRecipe("blockTitle")}>{title}</h2>
            <Badge tone="critical" variant="outline">
              Audit required
            </Badge>
          </div>
          {description ? (
            <p className={blockRecipe("blockDescription")}>{description}</p>
          ) : null}
        </div>
        <PermissionActionButton
          action={auditedAction}
          reasonId={`${auditedAction.key}-audit-reason`}
        />
      </header>

      <Alert tone="warning">
        <AlertTriangleIcon aria-hidden="true" />
        <AlertTitle>Critical action guard</AlertTitle>
        <AlertDescription>
          This action records capability, permission, role, audit event, and
          scope metadata before the application executes the mutation.
        </AlertDescription>
      </Alert>

      {evidence?.length ? (
        <>
          <Separator />
          <dl className="grid min-w-0 gap-0 overflow-hidden rounded-[var(--xforge-radius-md)] border border-border-default sm:grid-cols-2">
            {evidence.map((item) => (
              <div
                className="grid min-w-0 gap-1 border-border-default border-b p-3 last:border-b-0 sm:border-r sm:[&:nth-child(2n)]:border-r-0 sm:[&:nth-last-child(-n+2)]:border-b-0"
                key={item.id}
              >
                <dt className={blockRecipe("blockMetricLabel")}>
                  {item.label}
                </dt>
                <dd
                  className={cn(
                    "min-w-0 truncate font-medium text-[13px] text-text-primary leading-5",
                    item.mono && "font-mono tabular-nums"
                  )}
                >
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

type EvaluatedPermissionAction = PermissionAwareAction & {
  readonly denied: boolean;
  readonly disabled: boolean;
  readonly resolvedReason?: string;
};

function PermissionActionButton({
  action,
  reasonId,
}: {
  readonly action: EvaluatedPermissionAction;
  readonly reasonId: string;
}) {
  const content = (
    <>
      {action.denied ? (
        <LockIcon aria-hidden="true" className="size-4" />
      ) : (
        action.icon
      )}
      <span className="truncate">{action.label}</span>
    </>
  );
  const resolvedVariant =
    action.critical && !action.disabled
      ? "critical"
      : (action.variant ?? "secondary");

  return (
    <div
      className="grid min-w-0 max-w-72 gap-1"
      data-permission-state={action.denied ? "denied" : "allowed"}
    >
      {action.href && !action.disabled ? (
        <Button
          aria-label={action["aria-label"]}
          asChild
          data-audit-event={action.auditEvent}
          data-audit-scope={action.auditScope}
          data-capability={action.capability}
          data-confirmation-label={action.confirmationLabel}
          data-permission={action.permission}
          data-required-roles={action.roles?.join(" ")}
          size="sm"
          variant={resolvedVariant}
        >
          <a href={action.href}>{content}</a>
        </Button>
      ) : (
        <Button
          aria-describedby={action.resolvedReason ? reasonId : undefined}
          aria-label={action["aria-label"]}
          data-audit-event={action.auditEvent}
          data-audit-scope={action.auditScope}
          data-capability={action.capability}
          data-confirmation-label={action.confirmationLabel}
          data-permission={action.permission}
          data-required-roles={action.roles?.join(" ")}
          disabled={action.disabled}
          onClick={action.onClick}
          size="sm"
          variant={resolvedVariant}
        >
          {content}
        </Button>
      )}
      {action.resolvedReason ? (
        <span
          className="text-[12px] text-text-secondary leading-4"
          id={reasonId}
        >
          {action.resolvedReason}
        </span>
      ) : null}
    </div>
  );
}

function evaluatePermissionAction(
  action: PermissionAwareAction,
  currentRole?: string
): EvaluatedPermissionAction {
  const deniedByRole = Boolean(
    action.roles?.length && !(currentRole && action.roles.includes(currentRole))
  );
  const disabledByAction = Boolean(action.disabled);
  const resolvedReason =
    deniedByRole || disabledByAction
      ? (action.reason ??
        (deniedByRole
          ? `Requires ${formatRoles(action.roles)} role.`
          : undefined))
      : undefined;

  return {
    ...action,
    denied: deniedByRole,
    disabled: disabledByAction || deniedByRole,
    resolvedReason,
  };
}

function formatRoles(roles?: readonly string[]) {
  if (!roles?.length) {
    return "authorized";
  }

  return roles.join(" / ");
}

const blockDensityClassName: Record<BlockDensity, string> = {
  compact: blockRecipe("blockCompact"),
  comfortable: blockRecipe("blockComfortable"),
  default: blockRecipe("blockComfortable"),
};

export { AuditSafeCriticalAction, PermissionActionToolbar };
export type {
  AuditSafeCriticalActionProps,
  PermissionActionAuditItem,
  PermissionActionToolbarProps,
  PermissionAwareAction,
};
