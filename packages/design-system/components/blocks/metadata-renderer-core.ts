import type { BlockAction, BlockBaseProps } from "./foundation";
import type { MetadataBlock, MetadataBlockAction } from "./metadata-schema";
import type { OrchestratedBlockState } from "./state-orchestration";
import { orchestrateBlockState } from "./state-orchestration";

type MetadataActionSurface = "primary" | "bulk";

interface MetadataActionContext {
  readonly blockId: string;
  readonly blockType: MetadataBlock["type"];
  readonly surface: MetadataActionSurface;
}

type MetadataBlockBaseProps = Pick<
  BlockBaseProps,
  "blockId" | "density" | "intent" | "state" | "tone"
>;

interface MetadataBlockRenderContext {
  readonly baseProps: MetadataBlockBaseProps;
  readonly block: MetadataBlock;
  readonly orchestration?: OrchestratedBlockState;
}

function createMetadataBlockRenderContext(
  block: MetadataBlock
): MetadataBlockRenderContext {
  const orchestration = getOrchestratedBlockState(block);

  return {
    baseProps: toBaseProps(block, orchestration),
    block,
    orchestration,
  };
}

function resolveMetadataBlockActions(
  actions: readonly MetadataBlockAction[] | undefined,
  renderContext: MetadataBlockRenderContext,
  surface: MetadataActionSurface
): readonly BlockAction[] | undefined {
  const context = actionContext(renderContext.block, surface);

  return actions?.map((action) =>
    normalizeGovernedAction(action, context, renderContext.orchestration)
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
  orchestration: OrchestratedBlockState | undefined
): BlockAction {
  const actionKey = action.actionId ?? action.key;
  const confirmationLabel =
    action.confirmationLabel ?? (action.destructive ? action.label : undefined);
  const disabledReason =
    getOrchestratedActionDisabledReason(orchestration) ??
    getGovernedActionDisabledReason(action, confirmationLabel);
  const reason = disabledReason ?? action.reason ?? defaultActionReason(action);

  return {
    "aria-label": action["aria-label"],
    auditEvent:
      action.auditEvent ??
      `${context.blockType}.${context.surface}.${actionKey}`,
    auditScope: action.auditScope ?? context.blockId,
    capability:
      action.capability ??
      `${context.blockType}:${context.surface}:${actionKey}`,
    confirmationLabel,
    destructive: action.destructive,
    disabled: Boolean(action.disabled || disabledReason),
    href: action.href,
    key: action.key,
    label: action.label,
    permission:
      action.permission ??
      `blocks.${context.blockType}.${context.surface}.${actionKey}`,
    reason,
    roles: action.roles,
    variant: action.variant,
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
  if (action.disabled) {
    return action.reason ?? "Action disabled by page metadata.";
  }

  if (action.destructive && !confirmationLabel) {
    return "Destructive action requires a confirmation label.";
  }

  return undefined;
}

function defaultActionReason(action: MetadataBlockAction) {
  return action.destructive
    ? "Requires confirmation and audit logging."
    : "Available for the current metadata scope.";
}

export { createMetadataBlockRenderContext, resolveMetadataBlockActions };
export type {
  MetadataActionSurface,
  MetadataBlockBaseProps,
  MetadataBlockRenderContext,
};
