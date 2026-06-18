import { parseOrbitCaseRoute } from "./orbit-case-route-context";

export const EVIDENCE_7W1H_DIMENSIONS = [
  { key: "who", label: "Who" },
  { key: "what", label: "What" },
  { key: "when", label: "When" },
  { key: "where", label: "Where" },
  { key: "why", label: "Why" },
  { key: "which", label: "Which" },
  { key: "how", label: "How" },
  { key: "howMuch", label: "How much" },
] as const;

export type Evidence7w1hDimensionKey =
  (typeof EVIDENCE_7W1H_DIMENSIONS)[number]["key"];

export interface Evidence7w1hEntry {
  readonly how: string;
  readonly howMuch: string;
  readonly id: string;
  readonly what: string;
  readonly when: string;
  readonly where: string;
  readonly which: string;
  readonly who: string;
  readonly why: string;
}

export interface EvidenceDrawerContext {
  readonly entries: readonly Evidence7w1hEntry[];
  readonly scopeLabel: string;
  readonly subjectLabel: string;
}

const baseEntry = (
  entry: Omit<Evidence7w1hEntry, "id"> & { readonly id?: string }
): Evidence7w1hEntry => ({
  id: entry.id ?? `evidence-${entry.when}-${entry.what.slice(0, 12)}`,
  how: entry.how,
  howMuch: entry.howMuch,
  what: entry.what,
  when: entry.when,
  where: entry.where,
  which: entry.which,
  who: entry.who,
  why: entry.why,
});

export const resolveEvidenceDrawerContext = (
  pathname: string
): EvidenceDrawerContext => {
  const orbitContext = parseOrbitCaseRoute(pathname);

  if (orbitContext) {
    switch (orbitContext.kind) {
      case "workspace":
        return {
          scopeLabel: "Orbit Case workspace",
          subjectLabel: "Case queue",
          entries: [
            baseEntry({
              who: "System",
              what: "Workspace loaded",
              when: "Just now",
              where: "/orbit-case",
              why: "Operator opened the case queue",
              which: "Orbit Case board",
              how: "App shell navigation",
              howMuch: "0 cases mutated",
            }),
            baseEntry({
              who: "Governance policy",
              what: "Tenant scope enforced",
              when: "Session start",
              where: "Auth middleware",
              why: "Prevent cross-tenant evidence leakage",
              which: "Active organization",
              how: "Organization switcher",
              howMuch: "1 tenant context",
            }),
          ],
        };
      case "case":
        return {
          scopeLabel: "Orbit Case detail",
          subjectLabel: `Case ${orbitContext.caseId.slice(0, 8)}`,
          entries: [
            baseEntry({
              who: "Operator",
              what: "Case viewed",
              when: "Just now",
              where: pathname,
              why: "Review case before push or update",
              which: orbitContext.caseId,
              how: "Case detail route",
              howMuch: "1 record opened",
            }),
            baseEntry({
              who: "Orbit Case engine",
              what: "Activity stream available",
              when: "On load",
              where: "Case detail panel",
              why: "Preserve operator accountability",
              which: orbitContext.caseId,
              how: "Server read + DTO serialize",
              howMuch: "Full 7W1H trail pending live feed",
            }),
          ],
        };
      case "morph-list":
        return {
          scopeLabel: orbitContext.label,
          subjectLabel: `${orbitContext.segment} queue`,
          entries: [
            baseEntry({
              who: "Operator",
              what: "Morph queue opened",
              when: "Just now",
              where: pathname,
              why: `Triage ${orbitContext.label.toLowerCase()} items`,
              which: orbitContext.segment,
              how: "Morph list route",
              howMuch: "Queue snapshot",
            }),
          ],
        };
      case "morph-detail":
        return {
          scopeLabel: orbitContext.label,
          subjectLabel: orbitContext.requestId,
          entries: [
            baseEntry({
              who: "Operator",
              what: "Morph request opened",
              when: "Just now",
              where: pathname,
              why: "Validate pushed fields before approval",
              which: orbitContext.requestId,
              how: "Morph detail route",
              howMuch: "1 request record",
            }),
            baseEntry({
              who: "Orbit Case push",
              what: "Origin case linked",
              when: "At push time",
              where: "Morph projection",
              why: "Maintain finality back to source case",
              which: orbitContext.requestId,
              how: "Push registry routing",
              howMuch: "1 origin link",
            }),
          ],
        };
      case "settings":
        return {
          scopeLabel: "Push registry",
          subjectLabel: "Orbit Case settings",
          entries: [
            baseEntry({
              who: "Tenant owner",
              what: "Registry settings viewed",
              when: "Just now",
              where: pathname,
              why: "Audit destination and template configuration",
              which: "Push registry",
              how: "Settings route",
              howMuch: "Read-only review",
            }),
          ],
        };
      default:
        break;
    }
  }

  if (pathname.startsWith("/cms")) {
    return {
      scopeLabel: "CMS",
      subjectLabel: "Content workspace",
      entries: [
        baseEntry({
          who: "Editor",
          what: "CMS route accessed",
          when: "Just now",
          where: pathname,
          why: "Content authoring or review",
          which: "CMS collection",
          how: "App navigation",
          howMuch: "1 workspace view",
        }),
      ],
    };
  }

  return {
    scopeLabel: "Workspace",
    subjectLabel: "Current view",
    entries: [
      baseEntry({
        who: "Operator",
        what: "Page viewed",
        when: "Just now",
        where: pathname,
        why: "Routine workspace operation",
        which: pathname,
        how: "Authenticated shell",
        howMuch: "1 page view",
      }),
    ],
  };
};
