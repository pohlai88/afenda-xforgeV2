/**
 * Afenda Slot Contract
 *
 * Slot owns structure.
 *
 * Purpose:
 * - Define slot authority.
 * - Govern data-slot naming and structure.
 * - Prevent components, recipes, variants, and examples from inventing slots.
 * - Keep slot identity stable for styling, testing, accessibility, and AI imitation.
 *
 * This file must not contain component logic or styling values.
 */

export const AFENDA_SLOT_CONTRACT_ID = "afenda.slot" as const;

export const AFENDA_SLOT_CONTRACT_VERSION = "0.1.0" as const;

export const AFENDA_SLOT_AUTHORITY_RULES = {
  slotOwnsStructure: true,
  slotOwnsDataSlotIdentity: true,
  slotOwnsStructuralVocabulary: true,
  slotOwnsCompositionParts: true,
} as const;

export const AFENDA_SLOT_NAMING_RULES = {
  slotNamesMustUseKebabCase: true,
  dataSlotValuesMustUseKebabCase: true,
  dataSlotMustMatchContractSlotName: true,
  slotNamesMustBeStable: true,
  slotNamesMustNotEncodeStyling: true,
  slotNamesMustNotEncodeState: true,
  slotNamesMustNotEncodeBusinessMeaning: true,
} as const;

export const AFENDA_SLOT_USAGE_RULES = {
  componentsMustExposeDataSlot: true,
  componentsMustUseContractSlots: true,
  recipesMustTargetContractSlotsOnly: true,
  testsMustUseContractSlotsOnly: true,
  examplesMustUseContractSlotsOnly: true,
  unknownSlotIsHardFail: true,
} as const;

export const AFENDA_SLOT_FORBIDDEN_OWNERSHIP = {
  componentsMustNotInventSlots: true,
  recipesMustNotInventSlots: true,
  variantsMustNotInventSlots: true,
  examplesMustNotInventSlots: true,
  slotsMustNotOwnStyling: true,
  slotsMustNotOwnBehavior: true,
  slotsMustNotOwnValues: true,
  slotsMustNotOwnBusinessLogic: true,
} as const;

export const AFENDA_SLOT_CLASS_NAME_RULES = {
  slotMayExposeClassName: true,
  slotClassNameMustUseRecipe: true,
  slotClassNamePolicyIsLayoutOnly: true,
  slotClassNameMustNotOverrideSemanticIdentity: true,
} as const;

export const AFENDA_SLOT_ACCESSIBILITY_RULES = {
  structuralSlotsMustPreserveAriaRelationships: true,
  triggerContentPanelSlotsMustRemainLinked: true,
  labelControlSlotsMustRemainLinked: true,
  descriptionErrorSlotsMustRemainLinked: true,
} as const;

export const AFENDA_SLOT_FORBIDDEN_PATTERNS = [
  'data-slot="inner"',
  'data-slot="box"',
  'data-slot="thing"',
  'data-slot="item-wrapper"',
] as const;

export const AFENDA_SLOT_SOURCE_OF_TRUTH = [
  "afenda-slot.contract.ts",
  "afenda-component.contract.ts",
  "afenda-recipe.contract.ts",
] as const;

export const AFENDA_SLOT_PRINCIPLES = [
  "slot-owns-structure",
  "slot-owns-data-slot-identity",
  "slot-names-are-stable",
  "slot-names-use-kebab-case",
  "slot-does-not-own-styling",
  "slot-does-not-own-behavior",
  "slot-does-not-own-values",
  "unknown-slot-is-hard-fail",
] as const;

export const afendaSlotContract = {
  id: AFENDA_SLOT_CONTRACT_ID,
  version: AFENDA_SLOT_CONTRACT_VERSION,
  authorityRules: AFENDA_SLOT_AUTHORITY_RULES,
  namingRules: AFENDA_SLOT_NAMING_RULES,
  usageRules: AFENDA_SLOT_USAGE_RULES,
  forbiddenOwnership: AFENDA_SLOT_FORBIDDEN_OWNERSHIP,
  classNameRules: AFENDA_SLOT_CLASS_NAME_RULES,
  accessibilityRules: AFENDA_SLOT_ACCESSIBILITY_RULES,
  forbiddenPatterns: AFENDA_SLOT_FORBIDDEN_PATTERNS,
  sourceOfTruth: AFENDA_SLOT_SOURCE_OF_TRUTH,
  principles: AFENDA_SLOT_PRINCIPLES,
} as const;

export type AfendaSlotContract = typeof afendaSlotContract;
