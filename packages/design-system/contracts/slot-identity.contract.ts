export const AFENDA_SLOT_IDENTITY_PATTERN_REGISTRY = [
  "^[a-z][a-z0-9]*(?:-[a-z0-9]+)+$",
  "^app-topbar-[a-z0-9-]+$",
  "^app-topbar-utility-[a-z0-9-]+$",
  "^app-sidebar-[a-z0-9-]+$",
  "^content-layout-[a-z0-9-]+$",
  "^nav-(started|secondary|main|documents)-(item|menu)-[a-z0-9-]+$",
  "^section-card-[a-z0-9-]+$",
] as const;

export const AFENDA_SLOT_IDENTITY_RULE_SUMMARY = {
  allSlotsMustUseDataSlot: true,
  slotNamesMustBeKebabCase: true,
  dynamicSlotsMustMatchRegisteredPattern: true,
  unknownSlotIsHardFail: true,
} as const;

export type AfendaSlotIdentityPattern =
  (typeof AFENDA_SLOT_IDENTITY_PATTERN_REGISTRY)[number];
