import {
  listRoutedMorphSlices,
  resolveRoutedMorphSliceBySegment,
} from "@repo/orbit-case";

export const ORBIT_CASE_BASE_PATH = "/orbit-case";

const morphSegmentSet = new Set<string>(
  listRoutedMorphSlices().map((slice) => slice.segment)
);

export type OrbitCaseRouteContext =
  | { readonly kind: "workspace" }
  | { readonly kind: "settings" }
  | { readonly kind: "case"; readonly caseId: string }
  | {
      readonly kind: "morph-list";
      readonly label: string;
      readonly segment: string;
    }
  | {
      readonly kind: "morph-detail";
      readonly label: string;
      readonly requestId: string;
      readonly segment: string;
    };

export interface AppShellBreadcrumbItem {
  readonly href?: string;
  readonly label: string;
}

export const isOrbitCasePath = (pathname: string): boolean =>
  pathname === ORBIT_CASE_BASE_PATH ||
  pathname.startsWith(`${ORBIT_CASE_BASE_PATH}/`);

export const parseOrbitCaseRoute = (
  pathname: string
): OrbitCaseRouteContext | null => {
  if (!isOrbitCasePath(pathname)) {
    return null;
  }

  const remainder = pathname.slice(ORBIT_CASE_BASE_PATH.length).replace(/^\//, "");

  if (!remainder) {
    return { kind: "workspace" };
  }

  const [firstSegment, secondSegment] = remainder.split("/");

  if (firstSegment === "settings") {
    return { kind: "settings" };
  }

  if (morphSegmentSet.has(firstSegment)) {
    const slice = resolveRoutedMorphSliceBySegment(firstSegment);

    if (!slice) {
      return null;
    }

    if (!secondSegment) {
      return {
        kind: "morph-list",
        label: slice.label,
        segment: slice.segment,
      };
    }

    return {
      kind: "morph-detail",
      label: slice.label,
      requestId: secondSegment,
      segment: slice.segment,
    };
  }

  if (firstSegment && !secondSegment) {
    return { kind: "case", caseId: firstSegment };
  }

  return null;
};

export const resolveOrbitCaseBreadcrumbs = (
  context: OrbitCaseRouteContext
): readonly AppShellBreadcrumbItem[] => {
  const root = { href: ORBIT_CASE_BASE_PATH, label: "Orbit Case" } as const;

  switch (context.kind) {
    case "workspace":
      return [root, { label: "Workspace" }];
    case "settings":
      return [root, { label: "Settings" }];
    case "case":
      return [root, { label: "Case" }];
    case "morph-list":
      return [root, { label: context.label }];
    case "morph-detail":
      return [
        root,
        {
          href: `${ORBIT_CASE_BASE_PATH}/${context.segment}`,
          label: context.label,
        },
        { label: context.requestId.slice(0, 8) },
      ];
    default:
      return [root];
  }
};

export const listOrbitCaseMorphNavItems = () =>
  listRoutedMorphSlices().map((slice) => ({
    href: `${ORBIT_CASE_BASE_PATH}/${slice.segment}`,
    id: slice.destinationId,
    label: slice.label,
    segment: slice.segment,
  }));
