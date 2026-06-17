import type { OrbitObjectLinkDto, OrbitObjectLinkProjectionDto } from "./orbit-case.types";

export const ORBIT_BUDGET_REQUEST_TARGET_TYPE = "budget-request" as const;

const readDestinationLabel = (link: OrbitObjectLinkDto): string => {
  const label = link.payload.destinationLabel;

  if (typeof label === "string" && label.length > 0) {
    return label;
  }

  return link.targetType;
};

const resolveOrbitObjectLinkHref = (link: OrbitObjectLinkDto): string | null => {
  if (link.targetType === ORBIT_BUDGET_REQUEST_TARGET_TYPE) {
    return `/orbit-case/budget/${link.targetId}`;
  }

  return null;
};

export const toOrbitObjectLinkProjectionDto = (
  link: OrbitObjectLinkDto
): OrbitObjectLinkProjectionDto => ({
  createdAt: link.createdAt,
  href: resolveOrbitObjectLinkHref(link),
  id: link.id,
  label: readDestinationLabel(link),
  targetId: link.targetId,
  targetType: link.targetType,
});
