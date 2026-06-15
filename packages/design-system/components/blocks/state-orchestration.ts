import type { ErpRiskLevel, ErpSaveState } from "./erp-state";
import type { BlockRuntimeState, BlockTone } from "./foundation";

type StateSignal =
  | "autosave"
  | "conflict"
  | "empty"
  | "error"
  | "forbidden"
  | "loading"
  | "offline"
  | "readonly"
  | "ready"
  | "sla-breach"
  | "sla-critical"
  | "sla-watch";

interface BlockStateInput {
  readonly error?: boolean | string;
  readonly hasConflict?: boolean;
  readonly isEmpty?: boolean;
  readonly isForbidden?: boolean;
  readonly isLoading?: boolean;
  readonly isOffline?: boolean;
  readonly isReadonly?: boolean;
  readonly riskLevel?: ErpRiskLevel;
  readonly runtimeState?: BlockRuntimeState;
  readonly saveState?: ErpSaveState;
}

interface OrchestratedBlockState {
  readonly disabledReason?: string;
  readonly isInteractionDisabled: boolean;
  readonly signal: StateSignal;
  readonly state: BlockRuntimeState;
  readonly tone: BlockTone;
}

const runtimeStateSignal: Record<BlockRuntimeState, StateSignal> = {
  empty: "empty",
  error: "error",
  forbidden: "forbidden",
  loading: "loading",
  readonly: "readonly",
  ready: "ready",
};

const saveStateSignal: Record<ErpSaveState, StateSignal> = {
  conflict: "conflict",
  error: "error",
  idle: "autosave",
  offline: "offline",
  saved: "ready",
  saving: "loading",
};

const riskLevelSignal: Record<ErpRiskLevel, StateSignal> = {
  breach: "sla-breach",
  critical: "sla-critical",
  none: "ready",
  watch: "sla-watch",
};

const signalResolution: Record<StateSignal, OrchestratedBlockState> = {
  autosave: {
    isInteractionDisabled: false,
    signal: "autosave",
    state: "ready",
    tone: "neutral",
  },
  conflict: {
    disabledReason: "Resolve the current save conflict before editing.",
    isInteractionDisabled: true,
    signal: "conflict",
    state: "error",
    tone: "critical",
  },
  empty: {
    isInteractionDisabled: false,
    signal: "empty",
    state: "empty",
    tone: "neutral",
  },
  error: {
    disabledReason: "Restore the failed data source before continuing.",
    isInteractionDisabled: true,
    signal: "error",
    state: "error",
    tone: "critical",
  },
  forbidden: {
    disabledReason: "Current permissions do not allow this operation.",
    isInteractionDisabled: true,
    signal: "forbidden",
    state: "forbidden",
    tone: "critical",
  },
  loading: {
    disabledReason: "Wait for the block to finish loading.",
    isInteractionDisabled: true,
    signal: "loading",
    state: "loading",
    tone: "info",
  },
  offline: {
    disabledReason: "Reconnect before running server-side actions.",
    isInteractionDisabled: true,
    signal: "offline",
    state: "readonly",
    tone: "warning",
  },
  readonly: {
    disabledReason: "This block is read-only in the current context.",
    isInteractionDisabled: true,
    signal: "readonly",
    state: "readonly",
    tone: "warning",
  },
  ready: {
    isInteractionDisabled: false,
    signal: "ready",
    state: "ready",
    tone: "success",
  },
  "sla-breach": {
    disabledReason: "SLA breach requires escalation before normal processing.",
    isInteractionDisabled: false,
    signal: "sla-breach",
    state: "ready",
    tone: "critical",
  },
  "sla-critical": {
    disabledReason: "Critical risk requires operator review.",
    isInteractionDisabled: false,
    signal: "sla-critical",
    state: "ready",
    tone: "critical",
  },
  "sla-watch": {
    isInteractionDisabled: false,
    signal: "sla-watch",
    state: "ready",
    tone: "warning",
  },
};

function orchestrateBlockState(input: BlockStateInput): OrchestratedBlockState {
  return signalResolution[resolveStateSignal(input)];
}

function resolveStateSignal(input: BlockStateInput): StateSignal {
  if (input.isForbidden || input.runtimeState === "forbidden") {
    return "forbidden";
  }

  if (
    input.error ||
    input.saveState === "error" ||
    input.runtimeState === "error"
  ) {
    return "error";
  }

  if (input.hasConflict || input.saveState === "conflict") {
    return "conflict";
  }

  if (
    input.isLoading ||
    input.saveState === "saving" ||
    input.runtimeState === "loading"
  ) {
    return "loading";
  }

  if (input.isOffline || input.saveState === "offline") {
    return "offline";
  }

  if (input.isReadonly || input.runtimeState === "readonly") {
    return "readonly";
  }

  if (input.isEmpty || input.runtimeState === "empty") {
    return "empty";
  }

  if (input.riskLevel && input.riskLevel !== "none") {
    return riskLevelSignal[input.riskLevel];
  }

  if (input.saveState) {
    return saveStateSignal[input.saveState];
  }

  if (input.runtimeState) {
    return runtimeStateSignal[input.runtimeState];
  }

  return "ready";
}

export { orchestrateBlockState, resolveStateSignal };
export type { BlockStateInput, OrchestratedBlockState, StateSignal };
