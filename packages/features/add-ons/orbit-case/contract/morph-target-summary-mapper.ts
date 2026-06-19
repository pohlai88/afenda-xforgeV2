import type { OrbitMorphLifecycleRequestDto } from "./morph-lifecycle.types";
import {
  buildOrbitMorphTargetSummary,
  type OrbitMorphTargetSummary,
} from "./morph-target-summary";

export const toOrbitMorphTargetSummaryFromDto = (
  segment: string,
  targetType: string,
  dto: OrbitMorphLifecycleRequestDto
): OrbitMorphTargetSummary =>
  buildOrbitMorphTargetSummary({
    externalRefId:
      typeof dto.values.externalRefId === "string"
        ? dto.values.externalRefId
        : null,
    segment,
    status: dto.status,
    targetId: dto.id,
    targetType,
    title: dto.title,
    values: dto.values,
  });

export const toOrbitMorphTargetSummaryFromRecord = (input: {
  externalRefId?: string | null;
  segment: string;
  status: OrbitMorphTargetSummary["status"];
  targetId: string;
  targetType: string;
  title: string;
  values: Record<string, string | null>;
}): OrbitMorphTargetSummary => buildOrbitMorphTargetSummary(input);
