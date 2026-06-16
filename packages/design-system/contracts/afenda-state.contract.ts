export const AFENDA_STATES = [
  "default",
  "hover",
  "focus",
  "active",
  "selected",
  "open",
  "closed",
  "disabled",
  "loading",
  "readonly",
  "invalid",
  "empty",
  "error",
  "success",
  "warning",
] as const;

export const AFENDA_STATE_OWNERSHIP_RULES = {
  stateOwnsRuntimeCondition: true,
  stateNamesMustUseContractVocabulary: true,
  localStateNamesAreHardFail: true,
  statesMustNotEncodeStyling: true,
} as const;

export type AfendaState = (typeof AFENDA_STATES)[number];

