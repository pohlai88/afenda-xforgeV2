/**
 * Afenda Export Contract
 *
 * Export owns access.
 *
 * Purpose:
 * - Define supported public import surfaces.
 * - Prevent private, deep, legacy, and circular imports.
 * - Keep design-system access deterministic for apps, packages, examples, and AI coding.
 *
 * This file must not contain component logic, styling values, or runtime behavior.
 */

export const AFENDA_EXPORT_CONTRACT_ID = "afenda.export" as const;

export const AFENDA_EXPORT_CONTRACT_VERSION = "0.1.0" as const;

export const AFENDA_EXPORT_AUTHORITY_RULES = {
  exportOwnsAccess: true,
  exportOwnsPublicSurface: true,
  exportOwnsImportBoundary: true,
  exportOwnsCompatibilitySurface: true,
} as const;

export const AFENDA_PUBLIC_EXPORTS = [
  "@repo/design-system",
  "@repo/design-system/design-system",
  "@repo/design-system/contracts/afenda-design-system",
  "@repo/design-system/contracts/afenda-token",
  "@repo/design-system/contracts/afenda-recipe",
  "@repo/design-system/contracts/afenda-component",
  "@repo/design-system/contracts/afenda-slot",
  "@repo/design-system/contracts/afenda-variant",
  "@repo/design-system/contracts/afenda-class-name-policy",
  "@repo/design-system/contracts/afenda-export",
  "@repo/design-system/contracts/afenda-accessibility",
  "@repo/design-system/contracts/afenda-motion",
  "@repo/design-system/contracts/afenda-state",
  "@repo/design-system/contracts/afenda-example",
  "@repo/design-system/lib/utils",
  "@repo/design-system/styles/globals.css",
  "@repo/design-system/tokens/tokens.json",
] as const;

export type AfendaPublicExport = (typeof AFENDA_PUBLIC_EXPORTS)[number];

export const AFENDA_FORBIDDEN_IMPORT_PATTERNS = [
  "@repo/design-system/src/",
  "@repo/design-system/internal/",
  "@repo/design-system/components/internal/",
  "@repo/design-system/components/ui/",
  "../internal/",
  "./internal/",
  "../tokens/",
  "./tokens/",
] as const;

export const AFENDA_EXPORT_FORBIDDEN_OWNERSHIP = {
  consumersMustNotDefineAccessSurface: true,
  componentsMustNotDefinePublicExports: true,
  recipesMustNotDefinePublicExports: true,
  examplesMustNotUsePrivateImports: true,
  legacyContractsMustNotBecomeAuthority: true,
} as const;

export const AFENDA_EXPORT_IMPORT_RULES = {
  consumersMustUsePublicExportsOnly: true,
  privateImportsAreHardFail: true,
  deepImportsAreHardFailUnlessPubliclyDeclared: true,
  barrelImportsMustNotCreateCycles: true,
  indexFilesMustBeExportOnly: true,
  publicExportsMustBeStable: true,
} as const;

export const AFENDA_EXPORT_COMPATIBILITY_RULES = {
  backwardCompatibilityMustBePreserved: true,
  deprecatedExportsRequireMigrationTarget: true,
  removedExportsRequireMajorVersionBoundary: true,
  compatibilityAliasesMustPointToCanonicalExport: true,
  legacyExportsAreMigrationInputOnly: true,
} as const;

export const AFENDA_EXPORT_NAMING_RULES = {
  publicExportNamesMustUseAfendaPrefix: true,
  contractExportPathsMustUseAfendaPrefix: true,
  exportFilesMustUseKebabCase: true,
  barrelFilesMustNotRenameCanonicalExports: true,
} as const;

export const AFENDA_EXPORT_FORBIDDEN_PATTERNS = [
  "@repo/design-system/src/",
  "@repo/design-system/internal/",
  "@repo/design-system/components/internal/",
  "@repo/design-system/components/ui/",
  "../internal/",
  "./internal/",
  'export * from "./internal',
  'export * from "../internal',
] as const;

export const AFENDA_EXPORT_SOURCE_OF_TRUTH = [
  "afenda-export.contract.ts",
  "package.json",
  "tsconfig.json",
] as const;

export const AFENDA_EXPORT_PRINCIPLES = [
  "export-owns-access",
  "public-exports-are-the-only-supported-access-surface",
  "private-imports-are-hard-fail",
  "deep-imports-must-be-declared",
  "index-files-are-export-only",
  "legacy-contracts-are-migration-input-only",
  "compatibility-aliases-point-to-canonical-export",
] as const;

export const afendaExportContract = {
  id: AFENDA_EXPORT_CONTRACT_ID,
  version: AFENDA_EXPORT_CONTRACT_VERSION,
  publicExports: AFENDA_PUBLIC_EXPORTS,
  authorityRules: AFENDA_EXPORT_AUTHORITY_RULES,
  forbiddenOwnership: AFENDA_EXPORT_FORBIDDEN_OWNERSHIP,
  importRules: AFENDA_EXPORT_IMPORT_RULES,
  compatibilityRules: AFENDA_EXPORT_COMPATIBILITY_RULES,
  namingRules: AFENDA_EXPORT_NAMING_RULES,
  forbiddenImportPatterns: AFENDA_FORBIDDEN_IMPORT_PATTERNS,
  forbiddenPatterns: AFENDA_EXPORT_FORBIDDEN_PATTERNS,
  sourceOfTruth: AFENDA_EXPORT_SOURCE_OF_TRUTH,
  principles: AFENDA_EXPORT_PRINCIPLES,
} as const;

export type AfendaExportContract = typeof afendaExportContract;
