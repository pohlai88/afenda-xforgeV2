import { createId } from "@paralleldrive/cuid2";
import type { OrbitMorphTargetType } from "../../contract/morph-destination-manifest";
import type { ExecutePushInput } from "../../contract/push.schema";
import type {
  ExecutePushContext,
  PushDestinationHandler,
  PushHandlerMeta,
} from "./push-types";

const readOptionalString = (value: unknown): string | null =>
  typeof value === "string" && value.length > 0 ? value : null;

export interface MorphFieldPushInsertRow {
  createdAt: Date;
  createdBy: string;
  fieldValues: Record<string, string | null>;
  id: string;
  organizationId: string;
  originCaseId: string;
  title: string;
}

export interface MorphFieldPushHandlerConfig {
  fieldKeys: readonly string[];
  insertRow: (row: MorphFieldPushInsertRow) => Promise<void>;
  targetType: OrbitMorphTargetType;
}

export const createMorphFieldPushHandler = (
  config: MorphFieldPushHandlerConfig
): PushDestinationHandler => {
  return async (
    context: ExecutePushContext,
    input: ExecutePushInput,
    meta: PushHandlerMeta
  ): Promise<{ targetId: string; targetType: string }> => {
    const title =
      typeof input.fieldValues.title === "string" && input.fieldValues.title
        ? input.fieldValues.title
        : meta.orbitCase.title;

    const fieldValues = Object.fromEntries(
      config.fieldKeys.map((key) => [
        key,
        readOptionalString(input.fieldValues[key]),
      ])
    ) as Record<string, string | null>;

    const id = createId();
    const now = new Date();

    await config.insertRow({
      createdAt: now,
      createdBy: context.actorId,
      fieldValues,
      id,
      organizationId: context.organizationId,
      originCaseId: input.caseId,
      title,
    });

    return {
      targetId: id,
      targetType: config.targetType,
    };
  };
};
