import type { BlockAction, BlockBaseProps } from "./foundation";
import type { MetadataDiagnosticsSink } from "./metadata-diagnostics";
import {
  emitMetadataActionDiagnostics,
  emitMetadataBlockRendered,
  emitMetadataStateAudit,
} from "./metadata-diagnostics";
import type { MetadataBlock, MetadataBlockAction } from "./metadata-schema";
import type { OrchestratedBlockState } from "./state-orchestration";
import { orchestrateBlockState } from "./state-orchestration";

type MetadataActionSurface = "primary" | "bulk";

type MetadataGovernanceStatus = "allowed" | "denied" | "hidden";

interface MetadataActionContext {
  readonly blockId: string;
  readonly blockType: MetadataBlock["type"];
  readonly surface: MetadataActionSurface;
}

interface MetadataPermissionSubject {
  readonly actionKey?: string;
  readonly auditEvent?: string;
  readonly auditScope?: string;
  readonly blockId: string;
  readonly blockType: MetadataBlock["type"];
  readonly capability?: string;
  readonly permission?: string;
  readonly roles?: readonly string[];
  readonly surface?: MetadataActionSurface;
  readonly type: "action" | "block";
}

type MetadataPermissionDecision =
  | {
      readonly status: "allowed";
    }
  | {
      readonly code: string;
      readonly reason: string;
      readonly status: "denied" | "hidden";
    };

interface MetadataPermissionContext {
  readonly capabilities?: readonly string[];
  readonly isReadonly?: boolean;
  readonly permissions?: readonly string[];
  readonly resolvePermission?: (
    subject: MetadataPermissionSubject,
    context: MetadataPermissionContext
  ) => MetadataPermissionDecision;
  readonly roles?: readonly string[];
}

type MetadataBlockBaseProps = Pick<
  BlockBaseProps,
  "blockId" | "density" | "intent" | "state" | "tone"
>;

interface MetadataBlockRenderContext {
  readonly baseProps: MetadataBlockBaseProps;
  readonly block: MetadataBlock;
  readonly diagnostics?: MetadataDiagnosticsSink;
  readonly orchestration?: OrchestratedBlockState;
  readonly pageId?: string;
  readonly permissionContext?: MetadataPermissionContext;
}

interface MetadataBlockRenderContextOptions {
  readonly diagnostics?: MetadataDiagnosticsSink;
  readonly pageId?: string;
}

function createMetadataBlockRenderContext(
  block: MetadataBlock,
  permissionContext?: MetadataPermissionContext,
  options: MetadataBlockRenderContextOptions = {}
): MetadataBlockRenderContext {
  const orchestration = getOrchestratedBlockState(block);

  emitMetadataBlockRendered(options.diagnostics, options.pageId, block);
  emitMetadataStateAudit(
    options.diagnostics,
    options.pageId,
    block,
    orchestration
  );

  return {
    baseProps: toBaseProps(block, orchestration),
    block,
    diagnostics: options.diagnostics,
    orchestration,
    pageId: options.pageId,
    permissionContext,
  };
}

function resolveMetadataBlockActions(
  actions: readonly MetadataBlockAction[] | undefined,
  renderContext: MetadataBlockRenderContext,
  surface: MetadataActionSurface
): readonly BlockAction[] | undefined {
  const context = actionContext(renderContext.block, surface);

  return actions
    ?.map((action) =>
      normalizeGovernedAction(
        action,
        context,
        renderContext.orchestration,
        renderContext.permissionContext,
        renderContext.diagnostics,
        renderContext.pageId
      )
    )
    .filter((action) => action.governanceStatus !== "hidden");
}

function resolveMetadataBlockPermission(
  block: MetadataBlock,
  permissionContext: MetadataPermissionContext | undefined
): MetadataPermissionDecision {
  if (!permissionContext) {
    return allowedDecision;
  }

  return resolveMetadataPermission(
    {
      blockId: block.blockId,
      blockType: block.type,
      capability: block.capability,
      permission: block.permission,
      roles: block.roles,
      type: "block",
    },
    permissionContext
  );
}

function toBaseProps(
  block: MetadataBlock,
  orchestration: OrchestratedBlockState | undefined
): MetadataBlockBaseProps {
  return {
    blockId: block.blockId,
    density: block.density,
    intent: block.intent,
    state: block.state ?? orchestration?.state,
    tone: block.tone ?? orchestration?.tone,
  };
}

function actionContext(
  block: MetadataBlock,
  surface: MetadataActionSurface
): MetadataActionContext {
  return {
    blockId: block.blockId,
    blockType: block.type,
    surface,
  };
}

function normalizeGovernedAction(
  action: MetadataBlockAction,
  context: MetadataActionContext,
  orchestration: OrchestratedBlockState | undefined,
  permissionContext: MetadataPermissionContext | undefined,
  diagnostics: MetadataDiagnosticsSink | undefined,
  pageId: string | undefined
): BlockAction {
  const actionKey = action.actionId ?? action.key;
  const label = String(action.label);
  const disabled = action.disabled === true;
  const auditEvent =
    action.auditEvent ?? `${context.blockType}.${context.surface}.${actionKey}`;
  const auditScope = action.auditScope ?? context.blockId;
  const capability =
    action.capability ?? `${context.blockType}:${context.surface}:${actionKey}`;
  const permission =
    action.permission ??
    `blocks.${context.blockType}.${context.surface}.${actionKey}`;
  const confirmationLabel =
    action.confirmationLabel ?? (action.destructive ? label : undefined);
  const permissionDecision = permissionContext
    ? resolveMetadataPermission(
        {
          actionKey,
          auditEvent,
          auditScope,
          blockId: context.blockId,
          blockType: context.blockType,
          capability,
          permission,
          roles: action.roles,
          surface: context.surface,
          type: "action",
        },
        permissionContext
      )
    : allowedDecision;
  const readonlyReason = getReadonlyActionDisabledReason(
    action,
    permissionContext
  );
  const disabledReason =
    getPermissionDecisionReason(permissionDecision) ??
    readonlyReason ??
    getOrchestratedActionDisabledReason(orchestration) ??
    getGovernedActionDisabledReason(action, confirmationLabel);
  const reason =
    disabledReason ??
    (typeof action.reason === "string" ? action.reason : undefined) ??
    getDefaultGovernedActionReason(action);
  const normalizedAction = {
    "aria-label": action["aria-label"],
    auditEvent,
    auditScope,
    capability,
    confirmationLabel,
    destructive: action.destructive,
    governanceCode:
      permissionDecision.status === "allowed"
        ? undefined
        : permissionDecision.code,
    governanceStatus: permissionDecision.status,
    disabled: Boolean(disabled || disabledReason),
    href: typeof action.href === "string" ? action.href : undefined,
    key: action.key,
    label,
    permission,
    reason,
    roles: action.roles,
    variant: action.variant,
  } satisfies BlockAction;

  emitMetadataActionDiagnostics(diagnostics, {
    action,
    actionKey,
    auditEvent,
    auditScope,
    blockId: context.blockId,
    blockType: context.blockType,
    capability,
    confirmationLabel,
    disabled: normalizedAction.disabled ?? false,
    pageId,
    permission,
    reason,
    surface: context.surface,
  });

  return normalizedAction;
}

const allowedDecision = {
  status: "allowed",
} satisfies MetadataPermissionDecision;

function resolveMetadataPermission(
  subject: MetadataPermissionSubject,
  context: MetadataPermissionContext
): MetadataPermissionDecision {
  return context.resolvePermission
    ? context.resolvePermission(subject, context)
    : resolveDefaultMetadataPermission(subject, context);
}

function resolveDefaultMetadataPermission(
  subject: MetadataPermissionSubject,
  context: MetadataPermissionContext
): MetadataPermissionDecision {
  if (subject.roles?.length && !hasIntersection(subject.roles, context.roles)) {
    return deniedDecision(
      "role-mismatch",
      `Requires ${formatRequiredValues(subject.roles)} role.`
    );
  }

  if (
    subject.permission &&
    !context.permissions?.includes(subject.permission)
  ) {
    return deniedDecision(
      "permission-mismatch",
      `Requires ${subject.permission} permission.`
    );
  }

  if (
    subject.capability &&
    !context.capabilities?.includes(subject.capability)
  ) {
    return deniedDecision(
      "capability-mismatch",
      `Requires ${subject.capability} capability.`
    );
  }

  return allowedDecision;
}

function deniedDecision(
  code: string,
  reason: string
): MetadataPermissionDecision {
  return {
    code,
    reason,
    status: "denied",
  };
}

function getOrchestratedBlockState(block: MetadataBlock) {
  return block.orchestration
    ? orchestrateBlockState(block.orchestration)
    : undefined;
}

function getOrchestratedActionDisabledReason(
  orchestration: OrchestratedBlockState | undefined
) {
  if (!orchestration?.isInteractionDisabled) {
    return undefined;
  }

  return (
    orchestration.disabledReason ??
    "Current block state does not allow this action."
  );
}

function getGovernedActionDisabledReason(
  action: MetadataBlockAction,
  confirmationLabel: string | undefined
) {
  if (action.disabled === true) {
    return typeof action.reason === "string"
      ? action.reason
      : "Action disabled by page metadata.";
  }

  if (action.destructive && !confirmationLabel) {
    return "Destructive action requires a confirmation label.";
  }

  return undefined;
}

function getPermissionDecisionReason(decision: MetadataPermissionDecision) {
  return decision.status === "allowed" ? undefined : decision.reason;
}

function getReadonlyActionDisabledReason(
  action: MetadataBlockAction,
  permissionContext: MetadataPermissionContext | undefined
) {
  if (!permissionContext?.isReadonly || isReadonlySafeAction(action)) {
    return undefined;
  }

  return "This block is read-only in the current context.";
}

function isReadonlySafeAction(action: MetadataBlockAction) {
  return Boolean(action.href && !action.destructive);
}

function getDefaultGovernedActionReason(action: MetadataBlockAction) {
  return action.destructive
    ? "Requires confirmation and audit logging."
    : undefined;
}

function hasIntersection(
  requiredValues: readonly string[],
  grantedValues: readonly string[] | undefined
) {
  return requiredValues.some((value) => grantedValues?.includes(value));
}

function formatRequiredValues(values: readonly string[]) {
  return values.join(" / ");
}

export {
  createMetadataBlockRenderContext,
  resolveDefaultMetadataPermission,
  resolveMetadataBlockActions,
  resolveMetadataBlockPermission,
  resolveMetadataPermission,
};
export type {
  MetadataActionSurface,
  MetadataBlockBaseProps,
  MetadataBlockRenderContext,
  MetadataBlockRenderContextOptions,
  MetadataGovernanceStatus,
  MetadataPermissionContext,
  MetadataPermissionDecision,
  MetadataPermissionSubject,
};
