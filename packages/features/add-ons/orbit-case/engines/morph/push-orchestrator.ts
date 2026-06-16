/**
 * Phase 2+: push orchestration — human-initiated morph only.
 * Stub retained for registry wiring and future idempotent push execution.
 */
export type PushOrchestratorResult =
  | { ok: true; pushEventId: string; targetType: string; targetId: string }
  | {
      ok: false;
      code: "destination_not_registered" | "missing_fields" | "forbidden";
      missingFields?: string[];
    };

export const pushOrchestratorNotImplemented = (): PushOrchestratorResult => ({
  ok: false,
  code: "destination_not_registered",
});
