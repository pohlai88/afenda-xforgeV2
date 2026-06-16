import { AFENDA_EXAMPLE_CONTRACT_VERSION } from "./afenda-example.contract";

export const AFENDA_EXAMPLE_VERSION_REGISTRY = {
  currentContractVersion: AFENDA_EXAMPLE_CONTRACT_VERSION,
  examplesMustUseCurrentContractVersion: true,
  staleExamplesAreForbidden: true,
} as const;
