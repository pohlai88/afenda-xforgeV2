import type {
  MorphLifecycleSegment,
  OrbitMorphLifecycleRequestDto,
} from "@repo/orbit-case";
import {
  getMorphLifecycleFieldConfigs,
  resolveMorphLifecycleSegmentConfig,
} from "@repo/orbit-case";
import type { OrbitMorphStatus } from "@repo/orbit-case";

export interface MorphPilotFieldConfig {
  key: string;
  label: string;
  placeholder?: string;
}

export interface MorphPilotRequestViewModel {
  assigneeId: string | null;
  createdAt: string;
  fields: Record<string, string | null>;
  id: string;
  status: OrbitMorphStatus;
  title: string;
  updatedAt: string;
}

export interface MorphPilotListItem {
  detailHref: string;
  fieldBadges: string[];
  id: string;
  originCaseId: string;
  status: OrbitMorphStatus;
  title: string;
}

export const getMorphPilotFieldConfigs = (
  segment: MorphLifecycleSegment
): MorphPilotFieldConfig[] => getMorphLifecycleFieldConfigs(segment);

export const toMorphPilotViewModel = (
  dto: OrbitMorphLifecycleRequestDto
): MorphPilotRequestViewModel => ({
  assigneeId: dto.assigneeId,
  createdAt: dto.createdAt,
  fields: dto.values,
  id: dto.id,
  status: dto.status,
  title: dto.title,
  updatedAt: dto.updatedAt,
});

export const toMorphPilotListItem = (
  segment: MorphLifecycleSegment,
  dto: OrbitMorphLifecycleRequestDto
): MorphPilotListItem => {
  const fieldBadges = getMorphLifecycleFieldConfigs(segment)
    .map((field) => {
      const value = dto.values[field.key];
      return typeof value === "string" && value.length > 0 ? value : null;
    })
    .filter((value): value is string => value !== null);

  return {
    detailHref: `/orbit-case/${segment}/${dto.id}`,
    fieldBadges,
    id: dto.id,
    originCaseId: dto.originCaseId,
    status: dto.status,
    title: dto.title,
  };
};

export const buildMorphPilotListHref = (
  segment: MorphLifecycleSegment,
  input: {
    assigneeId?: string;
    caseId?: string;
    status?: OrbitMorphStatus;
  }
): string => {
  const params = new URLSearchParams();

  if (input.caseId) {
    params.set("caseId", input.caseId);
  }

  if (input.assigneeId) {
    params.set("assigneeId", input.assigneeId);
  }

  if (input.status) {
    params.set("status", input.status);
  }

  const query = params.toString();
  return query ? `/orbit-case/${segment}?${query}` : `/orbit-case/${segment}`;
};

export { resolveMorphLifecycleSegmentConfig as resolveMorphPilotSegmentConfig };
