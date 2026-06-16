import {
  blockComponentIds,
  componentScorecards,
  primitiveComponentIds,
} from "./component-scorecards.contract";

export const AFENDA_COMPONENT_IDENTITY_REGISTRY = [
  ...primitiveComponentIds,
  ...blockComponentIds,
] as const;

export const AFENDA_INTERNAL_COMPONENT_IDENTITY_REGISTRY = [
  "SidebarCardSectionPanel",
  "SidebarLabelGroupPanel",
  "SidebarNavGroupPanel",
  "TopbarUtilitiesBar",
] as const;

export const AFENDA_COMPONENT_IDENTITY_SCORECARD_IDS = componentScorecards.map(
  (scorecard) => scorecard.id
);

export type AfendaComponentIdentity =
  (typeof AFENDA_COMPONENT_IDENTITY_REGISTRY)[number];
