import type {
  MetadataDataBinding,
  MetadataDataSourceEnvelope,
  MetadataDataSources,
} from "./metadata-schema";

type MetadataBindingStatus =
  | "empty"
  | "error"
  | "forbidden"
  | "idle"
  | "invalid-type"
  | "loading"
  | "missing-path"
  | "missing-source"
  | "ready"
  | "stale";

interface MetadataBindingDiagnostic {
  readonly binding: MetadataDataBinding;
  readonly message: string;
  readonly sourceState?: MetadataDataSourceEnvelope["state"];
  readonly status: Exclude<MetadataBindingStatus, "ready">;
}

type MetadataBindingResolution =
  | {
      readonly binding: MetadataDataBinding;
      readonly diagnostic?: MetadataBindingDiagnostic;
      readonly source?: MetadataDataSourceEnvelope;
      readonly status: "ready";
      readonly value: unknown;
    }
  | {
      readonly binding: MetadataDataBinding;
      readonly diagnostic: MetadataBindingDiagnostic;
      readonly source?: MetadataDataSourceEnvelope;
      readonly status: Exclude<MetadataBindingStatus, "ready">;
      readonly value?: unknown;
    };

function resolveMetadataBinding(
  binding: MetadataDataBinding,
  dataSources: MetadataDataSources
): MetadataBindingResolution {
  const sourceValue = dataSources[binding.source];

  if (sourceValue === undefined) {
    return fallbackOrDiagnostic(binding, "missing-source");
  }

  const source = toDataSourceEnvelope(sourceValue);

  if (source.state === "loading" || source.state === "idle") {
    return diagnosticResolution(binding, "loading", source, undefined);
  }

  if (source.state === "error" || source.state === "forbidden") {
    return diagnosticResolution(binding, source.state, source, undefined);
  }

  const resolved = readPath(source.data, binding.path);

  if (source.state === "empty") {
    const emptyValue = resolveEmptyFallback(binding, dataSources);

    return emptyValue === undefined
      ? diagnosticResolution(binding, "empty", source, undefined)
      : readyResolution(binding, emptyValue, source);
  }

  if (resolved === undefined) {
    return fallbackOrDiagnostic(binding, "missing-path", source);
  }

  const typeStatus = getExpectedTypeStatus(binding, resolved);

  if (typeStatus === "invalid-type") {
    return diagnosticResolution(binding, "invalid-type", source, resolved);
  }

  if (source.state === "stale") {
    return diagnosticResolution(binding, "stale", source, resolved);
  }

  return readyResolution(binding, resolved, source);
}

function fallbackOrDiagnostic(
  binding: MetadataDataBinding,
  status: "missing-path" | "missing-source",
  source?: MetadataDataSourceEnvelope
) {
  if (binding.fallback !== undefined) {
    return readyResolution(binding, binding.fallback, source);
  }

  return diagnosticResolution(binding, status, source, undefined);
}

function readyResolution(
  binding: MetadataDataBinding,
  value: unknown,
  source?: MetadataDataSourceEnvelope
): MetadataBindingResolution {
  return {
    binding,
    source,
    status: "ready",
    value,
  };
}

function diagnosticResolution(
  binding: MetadataDataBinding,
  status: Exclude<MetadataBindingStatus, "ready">,
  source: MetadataDataSourceEnvelope | undefined,
  value: unknown
): MetadataBindingResolution {
  return {
    binding,
    diagnostic: {
      binding,
      message: getDiagnosticMessage(binding, status, source),
      sourceState: source?.state,
      status,
    },
    source,
    status,
    value,
  };
}

function getDiagnosticMessage(
  binding: MetadataDataBinding,
  status: Exclude<MetadataBindingStatus, "ready">,
  source: MetadataDataSourceEnvelope | undefined
) {
  const scope = `${binding.source}:${binding.path}`;
  const sourceMessage = source?.diagnostics?.message ?? source?.error?.message;

  if (sourceMessage) {
    return sourceMessage;
  }

  switch (status) {
    case "empty":
      return `Data source "${binding.source}" is empty.`;
    case "error":
      return `Data source "${binding.source}" failed to load.`;
    case "forbidden":
      return `Data source "${binding.source}" is forbidden.`;
    case "invalid-type":
      return `Data binding "${scope}" did not match expected type "${binding.expectedType}".`;
    case "loading":
      return `Data source "${binding.source}" is loading.`;
    case "missing-path":
      return `Data binding "${scope}" did not resolve.`;
    case "missing-source":
      return `Data source "${binding.source}" is missing.`;
    case "stale":
      return `Data source "${binding.source}" is stale.`;
    default:
      return `Data binding "${scope}" could not be resolved.`;
  }
}

function resolveEmptyFallback(
  binding: MetadataDataBinding,
  dataSources: MetadataDataSources
) {
  const fallback = binding.emptyFallback;

  if (fallback === undefined) {
    return undefined;
  }

  if (isMetadataDataBinding(fallback)) {
    const resolution = resolveMetadataBinding(fallback, dataSources);

    return resolution.status === "ready" ? resolution.value : undefined;
  }

  return fallback;
}

function getExpectedTypeStatus(
  binding: MetadataDataBinding,
  value: unknown
): "invalid-type" | "ready" {
  if (!binding.expectedType) {
    return "ready";
  }

  switch (binding.expectedType) {
    case "array":
      return Array.isArray(value) ? "ready" : "invalid-type";
    case "boolean":
      return typeof value === "boolean" ? "ready" : "invalid-type";
    case "number":
      return typeof value === "number" ? "ready" : "invalid-type";
    case "record":
      return isRecord(value) ? "ready" : "invalid-type";
    case "scalar":
      return isScalar(value) ? "ready" : "invalid-type";
    case "string":
      return typeof value === "string" ? "ready" : "invalid-type";
    default:
      return "ready";
  }
}

function toDataSourceEnvelope(value: unknown): MetadataDataSourceEnvelope {
  if (isDataSourceEnvelope(value)) {
    return value;
  }

  return {
    data: value,
    state: "ready",
  };
}

function readPath(source: unknown, path: string) {
  return path
    .split(".")
    .filter(Boolean)
    .reduce<unknown>((current, segment) => {
      if (current === undefined || current === null) {
        return undefined;
      }

      if (Array.isArray(current)) {
        const index = Number(segment);
        return Number.isInteger(index) ? current[index] : undefined;
      }

      if (isRecord(current)) {
        return current[segment];
      }

      return undefined;
    }, source);
}

function isDataSourceEnvelope(
  value: unknown
): value is MetadataDataSourceEnvelope {
  return (
    isRecord(value) &&
    typeof value.state === "string" &&
    dataSourceStates.has(value.state)
  );
}

function isMetadataDataBinding(value: unknown): value is MetadataDataBinding {
  return (
    isRecord(value) &&
    typeof value.source === "string" &&
    typeof value.path === "string"
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isScalar(value: unknown) {
  return (
    value === null ||
    typeof value === "boolean" ||
    typeof value === "number" ||
    typeof value === "string"
  );
}

const dataSourceStates = new Set<string>([
  "empty",
  "error",
  "forbidden",
  "idle",
  "loading",
  "ready",
  "stale",
] as const);

export { isRecord, readPath, resolveMetadataBinding };
export type { MetadataBindingDiagnostic, MetadataBindingResolution };
