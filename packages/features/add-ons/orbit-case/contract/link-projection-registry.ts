import type { OrbitObjectLinkDto } from "./orbit-case.types";
import { ORBIT_MORPH_ROUTED_DESTINATIONS } from "./morph-target-types";

type OrbitMorphLinkHrefBuilder = (targetId: string) => string;

const orbitMorphLinkHrefBuilders: Readonly<
  Record<string, OrbitMorphLinkHrefBuilder>
> = Object.fromEntries(
  ORBIT_MORPH_ROUTED_DESTINATIONS.map((destination) => [
    destination.targetType,
    (targetId: string) =>
      `/orbit-case/${destination.segment}/${targetId}`,
  ])
);

export const resolveOrbitMorphLinkHref = (
  targetType: string,
  targetId: string
): string | null => {
  const buildHref = orbitMorphLinkHrefBuilders[targetType];

  if (!buildHref) {
    return null;
  }

  return buildHref(targetId);
};

export const readOrbitObjectLinkLabel = (link: OrbitObjectLinkDto): string => {
  const label = link.payload.destinationLabel;

  if (typeof label === "string" && label.length > 0) {
    return label;
  }

  return link.targetType;
};
