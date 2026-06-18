import { createId } from "@paralleldrive/cuid2";
import type { OrbitMorphTargetType } from "../../contract/morph-destination-manifest";
import type { ExecutePushInput } from "../../contract/push.schema";
import type { ExecutePushContext, PushDestinationHandler, PushHandlerMeta } from "./push-types";

const readOptionalString = (value: unknown): string | null =>
  typeof value === "string" && value.length > 0 ? value : null;

export interface TwoFieldMorphPushHandlerConfig {
  fieldKeys: readonly [string] | readonly [string, string];
  insertRow: (row: {
    createdAt: Date;
    createdBy: string;
    fieldA: string | null;
    fieldB: string | null;
    id: string;
    organizationId: string;
    originCaseId: string;
    title: string;
  }) => Promise<void>;
  targetType: OrbitMorphTargetType;
}

export const createTwoFieldMorphPushHandler = (
  config: TwoFieldMorphPushHandlerConfig
): PushDestinationHandler => {
  const fieldAKey = config.fieldKeys[0];
  const fieldBKey = config.fieldKeys[1];

  return async (
    context: ExecutePushContext,
    input: ExecutePushInput,
    meta: PushHandlerMeta
  ): Promise<{ targetId: string; targetType: string }> => {
    const title =
      typeof input.fieldValues.title === "string" && input.fieldValues.title
        ? input.fieldValues.title
        : meta.orbitCase.title;

    const id = createId();
    const now = new Date();

    await config.insertRow({
      createdAt: now,
      createdBy: context.actorId,
      fieldA: readOptionalString(input.fieldValues[fieldAKey]),
      fieldB: fieldBKey
        ? readOptionalString(input.fieldValues[fieldBKey])
        : null,
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
