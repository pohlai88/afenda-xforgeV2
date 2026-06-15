import type { ArgTypes } from "@storybook/react"

/** Shared argTypes for boolean props surfaced in Controls. */
export const booleanControl = { control: "boolean" as const }

/** Radix checkbox checked states for Controls + URL args. */
export const checkboxCheckedArgType = {
  control: "select" as const,
  options: [false, true, "indeterminate"],
}

/** Afenda semantic tone options shared across primitives. */
export const afendaToneArgType = {
  control: "select" as const,
  options: ["neutral", "info", "positive", "warning", "critical"],
}

/** Afenda checkbox tone variants (from CheckboxProps). */
export const afendaCheckboxToneArgType = afendaToneArgType

/** Afenda badge variant options. */
export const afendaBadgeVariantArgType = {
  control: "select" as const,
  options: ["solid", "soft", "outline"],
}

/** Afenda button variant options (from ButtonProps). */
export const afendaButtonVariantArgType = {
  control: "select" as const,
  options: ["primary", "secondary", "quiet", "destructive", "link"],
}

/** Afenda button size options (from ButtonProps). */
export const afendaButtonSizeArgType = {
  control: "select" as const,
  options: ["default", "sm", "lg", "icon", "icon-sm", "icon-lg"],
}

/** shadcn/ui button variant options. */
export const uiButtonVariantArgType = {
  control: "select" as const,
  options: [
    "default",
    "secondary",
    "outline",
    "ghost",
    "destructive",
    "link",
  ],
}

/** shadcn/ui button size options. */
export const uiButtonSizeArgType = {
  control: "select" as const,
  options: ["default", "sm", "lg", "icon"],
}

export const afendaButtonArgTypes = {
  children: { control: "text" as const },
  variant: afendaButtonVariantArgType,
  size: afendaButtonSizeArgType,
  disabled: booleanControl,
} satisfies ArgTypes

export const afendaBadgeArgTypes = {
  children: { control: "text" as const },
  tone: afendaToneArgType,
  variant: afendaBadgeVariantArgType,
} satisfies ArgTypes

export const interactiveInputArgTypes = {
  disabled: booleanControl,
  checked: checkboxCheckedArgType,
} satisfies ArgTypes
