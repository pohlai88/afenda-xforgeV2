import { AFENDA_DESIGN_SYSTEM_CONTRACT_VERSION } from "./afenda-design-system.contract";

export const AFENDA_EXAMPLE_CONTRACT_VERSION =
  AFENDA_DESIGN_SYSTEM_CONTRACT_VERSION;

export const AFENDA_EXAMPLE_VERSION_REGISTRY = {
  currentContractVersion: AFENDA_EXAMPLE_CONTRACT_VERSION,
  examplesMustDeclareContractVersion: true,
  staleExamplesAreHardFail: true,
} as const;

