import type { MetadataBlock, MetadataBlockAction } from "./metadata-schema";
import type { OrchestratedBlockState } from "./state-orchestration";

type MetadataDiagnosticSeverity = "error" | "info" | "warning";

type MetadataDiagnosticCode =
  | "action.disabled"
  | "action.normalized"
  | "binding.invalid"
  | "binding.missing"
  | "block.denied"
  | "block.hidden"
  | "block.rendered"
  | "config.missing"
  | "page.invalid"
  | "state.changed";

type MetadataTelemetryEventName =
  | "metadata.action.normalized"
  | "metadata.binding.invalid"
  | "metadata.block.denied"
  | "metadata.block.hidden"
  | "metadata.block.rendered"
  | "metadata.page.invalid"
  | "metadata.state.changed";

type MetadataAuditEventName =
  | "metadata.action.normalized"
  | "metadata.action.disabled"
  | "metadata.block.denied"
  | "metadata.state.changed";

type MetadataActionSurface = "bulk" | "primary";

type MetadataActionConfigField =
  | "auditEvent"
  | "auditScope"
  | "capability"
  | "confirmationLabel"
  | "permission"
  | "reason";

interface MetadataEventScope {
  readonly blockId?: string;
  readonly blockType?: MetadataBlock["type"];
  readonly pageId?: string;
}

interface MetadataDiagnosticEvent extends MetadataEventScope {
  readonly code: MetadataDiagnosticCode;
  readonly details?: Readonly<Record<string, unknown>>;
  readonly message: string;
  readonly severity: MetadataDiagnosticSeverity;
}

interface MetadataTelemetryEvent extends MetadataEventScope {
  readonly name: MetadataTelemetryEventName;
  readonly properties?: Readonly<Record<string, unknown>>;
}

interface MetadataAuditEvent extends MetadataEventScope {
  readonly actionKey?: string;
  readonly auditEvent?: string;
  readonly auditScope?: string;
  readonly capability?: string;
  readonly confirmationLabel?: string;
  readonly destructive?: boolean;
  readonly disabled?: boolean;
  readonly event: MetadataAuditEventName;
  readonly permission?: string;
  readonly reason?: string;
  readonly roles?: readonly string[];
  readonly state?: OrchestratedBlockState["state"];
  readonly surface?: MetadataActionSurface;
  readonly tone?: OrchestratedBlockState["tone"];
}

interface MetadataDiagnosticsReport {
  readonly audit: readonly MetadataAuditEvent[];
  readonly diagnostics: readonly MetadataDiagnosticEvent[];
  readonly telemetry: readonly MetadataTelemetryEvent[];
}

interface MetadataDiagnosticsSink {
  readonly emitAudit?: (event: MetadataAuditEvent) => void;
  readonly emitDiagnostic?: (event: MetadataDiagnosticEvent) => void;
  readonly emitTelemetry?: (event: MetadataTelemetryEvent) => void;
}

interface MetadataDiagnosticsCollector extends MetadataDiagnosticsSink {
  readonly report: MetadataDiagnosticsReport;
}

interface MetadataActionDiagnosticsInput {
  readonly action: MetadataBlockAction;
  readonly actionKey: string;
  readonly auditEvent: string;
  readonly auditScope: string;
  readonly blockId: string;
  readonly blockType: MetadataBlock["type"];
  readonly capability: string;
  readonly confirmationLabel?: string;
  readonly disabled: boolean;
  readonly pageId?: string;
  readonly permission: string;
  readonly reason?: string;
  readonly surface: MetadataActionSurface;
}

function createMetadataDiagnosticsCollector(): MetadataDiagnosticsCollector {
  const audit: MetadataAuditEvent[] = [];
  const diagnostics: MetadataDiagnosticEvent[] = [];
  const telemetry: MetadataTelemetryEvent[] = [];

  return {
    emitAudit: (event) => {
      audit.push(event);
    },
    emitDiagnostic: (event) => {
      diagnostics.push(event);
    },
    emitTelemetry: (event) => {
      telemetry.push(event);
    },
    get report() {
      return {
        audit,
        diagnostics,
        telemetry,
      };
    },
  };
}

function createMetadataDiagnosticsDispatcher(
  sinks: readonly (MetadataDiagnosticsSink | undefined)[]
): MetadataDiagnosticsSink {
  const activeSinks = sinks.filter(isMetadataDiagnosticsSink);

  return {
    emitAudit: (event) => {
      for (const sink of activeSinks) {
        sink.emitAudit?.(event);
      }
    },
    emitDiagnostic: (event) => {
      for (const sink of activeSinks) {
        sink.emitDiagnostic?.(event);
      }
    },
    emitTelemetry: (event) => {
      for (const sink of activeSinks) {
        sink.emitTelemetry?.(event);
      }
    },
  };
}

function isMetadataDiagnosticsSink(
  sink: MetadataDiagnosticsSink | undefined
): sink is MetadataDiagnosticsSink {
  return Boolean(sink);
}

function emitMetadataBlockRendered(
  sink: MetadataDiagnosticsSink | undefined,
  pageId: string | undefined,
  block: MetadataBlock
) {
  sink?.emitDiagnostic?.({
    blockId: block.blockId,
    blockType: block.type,
    code: "block.rendered",
    message: `Rendered metadata block "${block.blockId}".`,
    pageId,
    severity: "info",
  });
  sink?.emitTelemetry?.({
    blockId: block.blockId,
    blockType: block.type,
    name: "metadata.block.rendered",
    pageId,
    properties: {
      density: block.density,
      intent: block.intent,
    },
  });
}

function emitMetadataStateAudit(
  sink: MetadataDiagnosticsSink | undefined,
  pageId: string | undefined,
  block: MetadataBlock,
  orchestration: OrchestratedBlockState | undefined
) {
  if (!orchestration) {
    return;
  }

  sink?.emitDiagnostic?.({
    blockId: block.blockId,
    blockType: block.type,
    code: "state.changed",
    details: {
      disabledReason: orchestration.disabledReason,
      signal: orchestration.signal,
    },
    message: `Resolved metadata state for block "${block.blockId}".`,
    pageId,
    severity: "info",
  });
  sink?.emitTelemetry?.({
    blockId: block.blockId,
    blockType: block.type,
    name: "metadata.state.changed",
    pageId,
    properties: {
      signal: orchestration.signal,
      state: orchestration.state,
      tone: orchestration.tone,
    },
  });
  sink?.emitAudit?.({
    blockId: block.blockId,
    blockType: block.type,
    event: "metadata.state.changed",
    pageId,
    reason: orchestration.disabledReason,
    state: orchestration.state,
    tone: orchestration.tone,
  });
}

function emitMetadataActionDiagnostics(
  sink: MetadataDiagnosticsSink | undefined,
  input: MetadataActionDiagnosticsInput
) {
  const missingFields = getMissingActionConfigFields(input.action);

  for (const field of missingFields) {
    sink?.emitDiagnostic?.({
      blockId: input.blockId,
      blockType: input.blockType,
      code: "config.missing",
      details: {
        actionKey: input.actionKey,
        field,
        surface: input.surface,
      },
      message: `Action "${input.actionKey}" is missing explicit ${field} config.`,
      pageId: input.pageId,
      severity: "warning",
    });
  }

  sink?.emitDiagnostic?.({
    blockId: input.blockId,
    blockType: input.blockType,
    code: input.disabled ? "action.disabled" : "action.normalized",
    details: {
      actionKey: input.actionKey,
      surface: input.surface,
    },
    message: `Normalized governed action "${input.actionKey}".`,
    pageId: input.pageId,
    severity: input.disabled ? "warning" : "info",
  });
  sink?.emitTelemetry?.({
    blockId: input.blockId,
    blockType: input.blockType,
    name: "metadata.action.normalized",
    pageId: input.pageId,
    properties: {
      actionKey: input.actionKey,
      disabled: input.disabled,
      surface: input.surface,
    },
  });
  sink?.emitAudit?.({
    actionKey: input.actionKey,
    auditEvent: input.auditEvent,
    auditScope: input.auditScope,
    blockId: input.blockId,
    blockType: input.blockType,
    capability: input.capability,
    confirmationLabel: input.confirmationLabel,
    destructive: input.action.destructive,
    disabled: input.disabled,
    event: input.disabled
      ? "metadata.action.disabled"
      : "metadata.action.normalized",
    pageId: input.pageId,
    permission: input.permission,
    reason: input.reason,
    roles: input.action.roles,
    surface: input.surface,
  });
}

function getMissingActionConfigFields(
  action: MetadataBlockAction
): readonly MetadataActionConfigField[] {
  const missingFields: MetadataActionConfigField[] = [];

  if (!action.auditEvent) {
    missingFields.push("auditEvent");
  }

  if (!action.auditScope) {
    missingFields.push("auditScope");
  }

  if (!action.capability) {
    missingFields.push("capability");
  }

  if (action.destructive && !action.confirmationLabel) {
    missingFields.push("confirmationLabel");
  }

  if (!action.permission) {
    missingFields.push("permission");
  }

  if (!action.reason) {
    missingFields.push("reason");
  }

  return missingFields;
}

export {
  createMetadataDiagnosticsCollector,
  createMetadataDiagnosticsDispatcher,
  emitMetadataActionDiagnostics,
  emitMetadataBlockRendered,
  emitMetadataStateAudit,
  getMissingActionConfigFields,
};
export type {
  MetadataActionConfigField,
  MetadataActionSurface,
  MetadataAuditEvent,
  MetadataAuditEventName,
  MetadataDiagnosticCode,
  MetadataDiagnosticEvent,
  MetadataDiagnosticSeverity,
  MetadataDiagnosticsCollector,
  MetadataDiagnosticsReport,
  MetadataDiagnosticsSink,
  MetadataTelemetryEvent,
  MetadataTelemetryEventName,
};
