const contributionLayerIds = [
  "core",
  "extended",
  "app-local",
  "out-of-scope",
] as const;

const contributionLifecycleStageIds = [
  "define",
  "classify",
  "build",
  "document",
  "validate",
  "adopt",
  "promote-or-retire",
] as const;

const contributionEvidenceValues = [
  "typed-contract",
  "storybook-story",
  "scorecard",
  "docs",
  "tests",
  "quality-gate",
  "owner",
  "migration-note",
] as const;

type ContributionLayerId = (typeof contributionLayerIds)[number];
type ContributionLifecycleStageId =
  (typeof contributionLifecycleStageIds)[number];
type ContributionEvidence = (typeof contributionEvidenceValues)[number];
type ContributionOwnership =
  | "app-team"
  | "design-system"
  | "domain-team"
  | "not-design-system";

interface ContributionLayerDefinition<
  TId extends ContributionLayerId = ContributionLayerId,
> {
  readonly defaultOwner: ContributionOwnership;
  readonly description: string;
  readonly examples: readonly string[];
  readonly exitRule: string;
  readonly id: TId;
  readonly name: string;
  readonly requiredEvidence: readonly ContributionEvidence[];
  readonly scopeRule: string;
}

interface ContributionLifecycleStage<
  TId extends ContributionLifecycleStageId = ContributionLifecycleStageId,
> {
  readonly decision: string;
  readonly id: TId;
  readonly name: string;
  readonly output: string;
}

type ContributionLayerCatalog = {
  readonly [TId in ContributionLayerId]: ContributionLayerDefinition<TId>;
};

type ContributionLifecycleCatalog = {
  readonly [TId in ContributionLifecycleStageId]: ContributionLifecycleStage<TId>;
};

const contributionLayers = {
  "app-local": {
    defaultOwner: "app-team",
    description:
      "Domain-specific UI, workflow composition, copy, routing, permissions, persistence, and business policy owned by one app surface.",
    examples: [
      "Tenant-specific approval workspace",
      "Customer onboarding workflow",
      "Route-owned record editor composition",
      "Domain copy and persisted action handlers",
    ],
    exitRule:
      "Promote to extended only after the same pattern is reused by more than one app or domain team.",
    id: "app-local",
    name: "App-local",
    requiredEvidence: ["owner", "docs"],
    scopeRule:
      "Keep local when the behavior depends on one product domain, route, persistence model, or permission policy.",
  },
  core: {
    defaultOwner: "design-system",
    description:
      "Stable primitives, tokens, recipes, public block contracts, and broadly reusable blocks that app teams should use by default.",
    examples: [
      "afenda-ui primitives",
      "Design tokens and recipes",
      "Foundation, operator, advanced, and stable workflow blocks",
      "Metadata schema v1 renderer contracts",
    ],
    exitRule:
      "Breaking changes require migration docs and compatibility tests; otherwise changes must be additive.",
    id: "core",
    name: "Core",
    requiredEvidence: [
      "typed-contract",
      "storybook-story",
      "scorecard",
      "docs",
      "tests",
      "quality-gate",
      "owner",
      "migration-note",
    ],
    scopeRule:
      "Accept only primitives, tokens, stable blocks, and cross-domain contracts with design-system ownership.",
  },
  extended: {
    defaultOwner: "domain-team",
    description:
      "Reusable ERP patterns and compositions that are valuable across more than one surface but not yet universal enough for core.",
    examples: [
      "Approval review pattern",
      "Batch posting pattern",
      "Policy lock/unlock pattern",
      "Long-running job state pattern",
    ],
    exitRule:
      "Promote to core after repeated adoption, stable evidence, accessibility coverage, and design-system owner acceptance.",
    id: "extended",
    name: "Extended",
    requiredEvidence: [
      "typed-contract",
      "storybook-story",
      "docs",
      "tests",
      "owner",
    ],
    scopeRule:
      "Use when a pattern is reusable and production-ready but still domain-owned or adoption-proving.",
  },
  "out-of-scope": {
    defaultOwner: "not-design-system",
    description:
      "Business logic, data persistence, routing, authorization policy, backend orchestration, and tenant-specific behavior.",
    examples: [
      "Database writes",
      "Route handlers",
      "Approval policy engines",
      "Tenant-specific copy or calculations",
    ],
    exitRule:
      "Do not promote into the design system; expose only UI contracts, states, and typed integration boundaries when needed.",
    id: "out-of-scope",
    name: "Out-of-scope",
    requiredEvidence: ["owner", "docs"],
    scopeRule:
      "Keep outside the design system when correctness depends on app data, server behavior, tenant policy, or persistence.",
  },
} as const satisfies ContributionLayerCatalog;

const contributionLifecycle = {
  adopt: {
    decision:
      "Is the contribution used by app teams without local forks, hidden assumptions, or repeated explanation?",
    id: "adopt",
    name: "Adopt",
    output: "Adoption note, owner, and support expectation.",
  },
  build: {
    decision:
      "Can the contribution be implemented without moving app-owned routing, persistence, or business logic into the design system?",
    id: "build",
    name: "Build",
    output: "Smallest scoped implementation that matches the selected layer.",
  },
  classify: {
    decision:
      "Does the work belong in core, extended, app-local, or outside the design system?",
    id: "classify",
    name: "Classify",
    output: "Layer decision with owner, support level, and required evidence.",
  },
  define: {
    decision:
      "What gap, duplicate pattern, bug, or workflow pressure requires a contribution?",
    id: "define",
    name: "Define",
    output:
      "Problem statement, non-goals, candidate users, and affected surfaces.",
  },
  document: {
    decision:
      "Can another app team understand when to use the contribution, when not to use it, and what remains app-owned?",
    id: "document",
    name: "Document",
    output:
      "Docs, Storybook taxonomy entry, examples, and migration notes when needed.",
  },
  "promote-or-retire": {
    decision:
      "Has evidence proven the contribution should graduate, stay where it is, or be removed from shared guidance?",
    id: "promote-or-retire",
    name: "Promote or retire",
    output:
      "Promotion, deprecation, or retirement note with compatibility impact.",
  },
  validate: {
    decision:
      "Do tests, typecheck, accessibility, visual baseline, overflow, and drift gates support the selected layer?",
    id: "validate",
    name: "Validate",
    output: "Passing quality gates or a documented exception with owner.",
  },
} as const satisfies ContributionLifecycleCatalog;

const contributionLayerEntries = contributionLayerIds.map(
  (id) => contributionLayers[id]
);

const contributionLifecycleEntries = contributionLifecycleStageIds.map(
  (id) => contributionLifecycle[id]
);

export {
  contributionEvidenceValues,
  contributionLayerEntries,
  contributionLayerIds,
  contributionLayers,
  contributionLifecycle,
  contributionLifecycleEntries,
  contributionLifecycleStageIds,
};
export type {
  ContributionEvidence,
  ContributionLayerCatalog,
  ContributionLayerDefinition,
  ContributionLayerId,
  ContributionLifecycleCatalog,
  ContributionLifecycleStage,
  ContributionLifecycleStageId,
  ContributionOwnership,
};
