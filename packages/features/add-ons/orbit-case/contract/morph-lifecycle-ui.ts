import {
  MORPH_LIFECYCLE_DETAIL_PARAM_KEYS,
  type MorphLifecycleSegment,
} from "./morph-lifecycle.types";
import { resolveRoutedMorphSliceBySegment } from "./morph-request-shared";

export interface MorphLifecycleFieldConfig {
  key: string;
  label: string;
}

export interface MorphLifecycleSegmentConfig {
  detailParamKey: string;
  eyebrowLabel: string;
  listDescription: string;
  listTitle: string;
  panelTitle: string;
  segment: MorphLifecycleSegment;
  singularLabel: string;
}

export const getMorphLifecycleFieldConfigs = (
  segment: MorphLifecycleSegment
): MorphLifecycleFieldConfig[] => {
  const slice = resolveRoutedMorphSliceBySegment(segment);

  if (!slice) {
    return [];
  }

  return slice.templateFields
    .filter((field) => field.key !== "title")
    .map((field) => ({
      key: field.key,
      label: field.label,
    }));
};

export const resolveMorphLifecycleSegmentConfig = (
  segment: MorphLifecycleSegment
): MorphLifecycleSegmentConfig => {
  const slice = resolveRoutedMorphSliceBySegment(segment);

  if (!slice) {
    throw new Error(`Unknown morph lifecycle segment: ${segment}`);
  }

  const singularLabel = slice.label.toLowerCase();

  return {
    detailParamKey: MORPH_LIFECYCLE_DETAIL_PARAM_KEYS[segment],
    eyebrowLabel: slice.label,
    listDescription: `${slice.label}s created from Orbit Case pushes.`,
    listTitle: `${slice.label}s`,
    panelTitle: slice.label,
    segment,
    singularLabel,
  };
};

/** @deprecated Prefer `MorphLifecycleSegment` */
export type MorphPilotSegment = MorphLifecycleSegment;

/** @deprecated Prefer `MorphLifecycleSegmentConfig` */
export type MorphPilotSegmentConfig = MorphLifecycleSegmentConfig;

/** @deprecated Prefer `resolveMorphLifecycleSegmentConfig` */
export const resolveMorphPilotSegmentConfig = resolveMorphLifecycleSegmentConfig;
