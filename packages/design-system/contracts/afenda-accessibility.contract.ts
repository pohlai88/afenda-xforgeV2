/**
 * Afenda Accessibility Contract
 *
 * Accessibility owns usable interaction safety.
 *
 * Purpose:
 * - Define accessibility authority.
 * - Govern keyboard, focus, ARIA, labels, descriptions, and error relationships.
 * - Prevent components, slots, variants, recipes, and examples from breaking accessibility.
 * - Keep accessibility behavior deterministic across components and AI coding.
 *
 * This file must not contain styling values or business logic.
 */

export const AFENDA_ACCESSIBILITY_CONTRACT_ID =
  "afenda.accessibility" as const;

export const AFENDA_ACCESSIBILITY_CONTRACT_VERSION = "0.1.0" as const;

export const AFENDA_ACCESSIBILITY_AUTHORITY_RULES = {
  accessibilityOwnsUsableInteractionSafety: true,
  accessibilityOwnsKeyboardSafety: true,
  accessibilityOwnsFocusSafety: true,
  accessibilityOwnsAriaRelationshipSafety: true,
  accessibilityOwnsScreenReaderSafety: true,
} as const;

export const AFENDA_ACCESSIBILITY_KEYBOARD_RULES = {
  interactiveElementsMustBeKeyboardReachable: true,
  focusableElementsMustHaveVisibleFocus: true,
  keyboardTrapIsForbiddenUnlessModal: true,
  escapeMustCloseDismissibleOverlays: true,
  enterAndSpaceMustActivateButtonLikeControls: true,
  arrowKeysMustFollowCompositeWidgetPattern: true,
} as const;

export const AFENDA_ACCESSIBILITY_FOCUS_RULES = {
  focusMustNotBeRemovedWithoutReplacement: true,
  focusMustMoveIntoModalDialog: true,
  focusMustReturnToTriggerAfterDismiss: true,
  focusOrderMustFollowDomOrder: true,
  focusRingMustNotBeHiddenByClassName: true,
} as const;

export const AFENDA_ACCESSIBILITY_ARIA_RULES = {
  ariaAttributesMustMatchRole: true,
  ariaHiddenMustNotHideFocusableContent: true,
  ariaLabelMustNotReplaceVisibleLabelWhenVisibleLabelExists: true,
  ariaDescribedByMustReferenceExistingElement: true,
  ariaControlsMustReferenceExistingElement: true,
  ariaExpandedMustReflectOpenState: true,
  ariaInvalidMustReflectInvalidState: true,
} as const;

export const AFENDA_ACCESSIBILITY_LABEL_RULES = {
  formControlsMustHaveAccessibleName: true,
  labelMustBeLinkedToControl: true,
  iconOnlyButtonsMustHaveAccessibleName: true,
  imagesMustHaveAltOrBeDecorative: true,
  headingsMustNotSkipStructureWithoutReason: true,
} as const;

export const AFENDA_ACCESSIBILITY_ERROR_RULES = {
  invalidControlsMustExposeErrorState: true,
  errorMessagesMustBeLinkedToControls: true,
  validationErrorsMustBeProgrammaticallyDiscoverable: true,
  destructiveActionsMustBeClearlyLabeled: true,
} as const;

export const AFENDA_ACCESSIBILITY_COMPONENT_RULES = {
  componentsMustPreserveAccessibilityProps: true,
  componentsMustForwardAriaAttributes: true,
  componentsMustNotSwallowKeyboardHandlers: true,
  componentsMustNotBreakPrimitiveAccessibility: true,
  componentsMustNotReplaceNativeSemanticsWithoutRole: true,
} as const;

export const AFENDA_ACCESSIBILITY_SLOT_RULES = {
  structuralSlotsMustPreserveAriaRelationships: true,
  triggerContentPanelSlotsMustRemainLinked: true,
  labelControlSlotsMustRemainLinked: true,
  descriptionErrorSlotsMustRemainLinked: true,
} as const;

export const AFENDA_ACCESSIBILITY_FORBIDDEN_PATTERNS = [
  "outline-none",
  "focus:outline-none",
  "tabIndex={-1}",
] as const;

export const AFENDA_ACCESSIBILITY_WARNING_PATTERNS = [
  'aria-hidden="true"',
  'role="button"',
  "onClick={",
] as const;

export const AFENDA_ACCESSIBILITY_SOURCE_OF_TRUTH = [
  "afenda-accessibility.contract.ts",
  "afenda-component.contract.ts",
  "afenda-slot.contract.ts",
  "afenda-state.contract.ts",
] as const;

export const AFENDA_ACCESSIBILITY_PRINCIPLES = [
  "accessibility-owns-usable-interaction-safety",
  "interactive-elements-are-keyboard-reachable",
  "focus-visible-must-not-be-removed",
  "aria-relationships-must-remain-valid",
  "form-controls-must-have-accessible-names",
  "errors-must-be-programmatically-linked",
  "primitive-accessibility-must-not-be-broken",
] as const;

export const afendaAccessibilityContract = {
  id: AFENDA_ACCESSIBILITY_CONTRACT_ID,
  version: AFENDA_ACCESSIBILITY_CONTRACT_VERSION,
  authorityRules: AFENDA_ACCESSIBILITY_AUTHORITY_RULES,
  keyboardRules: AFENDA_ACCESSIBILITY_KEYBOARD_RULES,
  focusRules: AFENDA_ACCESSIBILITY_FOCUS_RULES,
  ariaRules: AFENDA_ACCESSIBILITY_ARIA_RULES,
  labelRules: AFENDA_ACCESSIBILITY_LABEL_RULES,
  errorRules: AFENDA_ACCESSIBILITY_ERROR_RULES,
  componentRules: AFENDA_ACCESSIBILITY_COMPONENT_RULES,
  slotRules: AFENDA_ACCESSIBILITY_SLOT_RULES,
  forbiddenPatterns: AFENDA_ACCESSIBILITY_FORBIDDEN_PATTERNS,
  warningPatterns: AFENDA_ACCESSIBILITY_WARNING_PATTERNS,
  sourceOfTruth: AFENDA_ACCESSIBILITY_SOURCE_OF_TRUTH,
  principles: AFENDA_ACCESSIBILITY_PRINCIPLES,
} as const;

export type AfendaAccessibilityContract =
  typeof afendaAccessibilityContract;
