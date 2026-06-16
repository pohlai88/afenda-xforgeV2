import { AFENDA_DESIGN_SYSTEM_CONTRACT_VERSION } from "./afenda-design-system.contract";

export const AFENDA_EXAMPLE_RULES = {
  exampleOwnsAiImitation: true,
  mustBeCopyPasteSafe: true,
  mustUsePublicExportsOnly: true,
  mustUseRecipe: true,
  mustUseDataSlot: true,
  mustNotUseRawSemanticTailwind: true,
  mustNotContainBusinessLogic: true,
} as const;

export const AFENDA_EXAMPLE_VERSION_RULES = {
  examplesMustDeclareContractVersion: true,
  staleExamplesAreHardFail: true,
  examplesMustImportCurrentContract: true,
} as const;

export const AFENDA_EXAMPLE_CONTRACT_VERSION =
  AFENDA_DESIGN_SYSTEM_CONTRACT_VERSION;

