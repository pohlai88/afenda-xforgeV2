import { existsSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

const tsStringPattern = /["']([^"']+)["']/g;
const jsxTagPattern = /<([A-Z][A-Za-z0-9]*)\b/g;
const localComponentPattern =
  /\b(?:function|const|class)\s+([A-Z][A-Za-z0-9]*)\b/g;
const namedImportPattern =
  /import\s+\{([^}]+)\}\s+from\s+["']([^"']+)["']/g;
const localVocabularyPattern =
  /\bconst\s+(?:variants|tones|states|densities|[A-Za-z0-9]*(?:Variant|Tone|State|Density)Values)\s*=\s*\[/g;
const recipeCallPattern = /\b(recipe|blockRecipe)\(\s*["']([^"']+)["']/g;
const dataSlotPattern = /data-slot\s*=\s*["']([^"']+)["']/g;
const variantDataPattern = /data-\[(variant|tone)=([^\]]+)\]/g;
const semanticTailwindPattern =
  /\b(?:bg|text|border|ring)-\[(?:#|var\()[^\]]+\]/g;
const rawHexPattern = /#[0-9a-fA-F]{3,8}\b/g;
const quotedLegacySemanticPattern =
  /(?:["'])(positive|danger|destructive|negative)(?:["'])/g;
const classLegacySemanticPattern =
  /\b(?:bg|text|border|ring|status)-(positive|danger|destructive|negative)\b/g;
const propLegacySemanticPattern =
  /\b(?:tone|variant)\s*=\s*["'](positive|danger|destructive|negative)["']/g;
const exampleTagPattern = /\b(?:copyPasteExample|aiExample|example)\b/;

export function createDesignSystemAiDriftRegistry(root = process.cwd()) {
  const contractsDir = join(root, "packages", "design-system", "contracts");
  const recipePath = join(
    root,
    "packages",
    "design-system",
    "components",
    "afenda-ui",
    "recipes.ts"
  );
  const blockRecipePath = join(
    root,
    "packages",
    "design-system",
    "components",
    "blocks",
    "block-recipes.ts"
  );
  const designSystemContractPath = join(
    contractsDir,
    "afenda-design-system.contract.ts"
  );
  const componentContractPath = join(contractsDir, "afenda-component.contract.ts");
  const slotContractPath = join(contractsDir, "afenda-slot.contract.ts");
  const variantContractPath = join(contractsDir, "afenda-variant.contract.ts");
  const afendaUiIndexPath = join(
    root,
    "packages",
    "design-system",
    "components",
    "afenda-ui",
    "index.ts"
  );
  const blockIndexPath = join(
    root,
    "packages",
    "design-system",
    "components",
    "blocks",
    "index.ts"
  );

  const contractSource = readIfExists(designSystemContractPath);
  const componentContractSource = readIfExists(componentContractPath);
  const slotContractSource = readIfExists(slotContractPath);
  const variantContractSource = readIfExists(variantContractPath);

  const primitiveComponentIds = extractStringArray(
    componentContractSource,
    "AFENDA_PRIMITIVE_COMPONENT_IDS"
  );
  const blockComponentIds = extractStringArray(
    componentContractSource,
    "AFENDA_BLOCK_COMPONENT_IDS"
  );
  const publicComponentExports = [
    ...extractBarrelExportNames(readIfExists(afendaUiIndexPath)),
    ...extractBarrelExportNames(readIfExists(blockIndexPath)),
  ];
  const internalComponentIdentities = extractStringArray(
    componentContractSource,
    "AFENDA_INTERNAL_COMPONENT_IDS"
  );
  const recipeIds = extractObjectKeys(readIfExists(recipePath), "afendaRecipe");
  const blockRecipeIds = extractObjectKeys(
    readIfExists(blockRecipePath),
    "afendaBlockRecipe"
  );
  const tones = extractStringArray(variantContractSource, "AFENDA_TONES");
  const actionVariants = extractStringArray(
    variantContractSource,
    "AFENDA_ACTION_VARIANTS"
  );
  const structuralVariants = extractStringArray(
    variantContractSource,
    "AFENDA_STRUCTURAL_VARIANTS"
  );
  const forbiddenSemanticAliases = extractObjectStringArrays(
    variantContractSource,
    "AFENDA_FORBIDDEN_VARIANT_ALIASES"
  );
  const hardFailRules = extractStringArray(
    contractSource,
    "AFENDA_AI_HARD_FAIL_RULES"
  );
  const slotPatternSources = extractStringArray(
    slotContractSource,
    "AFENDA_SLOT_IDENTITY_PATTERN_REGISTRY"
  );
  const exactSlots = new Set([
    ...primitiveComponentIds,
    "alert-description",
    "alert-title",
    "progress-indicator",
  ]);

  return {
    actionVariants: new Set(actionVariants),
    blockComponentIds: new Set(blockComponentIds),
    blockRecipeIds: new Set(blockRecipeIds),
    componentIds: new Set([
      ...primitiveComponentIds,
      ...blockComponentIds,
      ...publicComponentExports,
      ...internalComponentIdentities,
    ]),
    contractVersion: extractConstString(
      contractSource,
      "AFENDA_DESIGN_SYSTEM_CONTRACT_VERSION"
    ),
    exactSlots,
    forbiddenSemanticAliases,
    hardFailRules: new Set(hardFailRules),
    recipeIds: new Set(recipeIds),
    slotPatterns: slotPatternSources.map((pattern) => new RegExp(pattern)),
    variants: new Set([...actionVariants, ...structuralVariants]),
    tones: new Set(tones),
  };
}

export function scanDesignSystemAiDriftSource({
  path,
  registry,
  root = process.cwd(),
  source,
  requireExampleVersion = false,
}) {
  const errors = [];
  const normalizedPath = normalizePath(relative(root, path));
  const localComponents = new Set(
    [...source.matchAll(localComponentPattern)].map((match) => match[1])
  );
  const externalComponents = extractExternalImportNames(source);

  for (const match of source.matchAll(jsxTagPattern)) {
    const name = match[1];
    if (
      shouldCheckComponentName(name, localComponents, externalComponents) &&
      !registry.componentIds.has(name)
    ) {
      errors.push(
        formatHardFail(
          "unknown-component-name",
          normalizedPath,
          `Unknown component <${name} /> is not in the component identity registry.`
        )
      );
    }
  }

  for (const match of source.matchAll(recipeCallPattern)) {
    const [, helper, name] = match;
    const registrySet =
      helper === "blockRecipe" ? registry.blockRecipeIds : registry.recipeIds;
    if (!registrySet.has(name)) {
      errors.push(
        formatHardFail(
          "unknown-recipe",
          normalizedPath,
          `${helper}("${name}") is not in the recipe identity registry.`
        )
      );
    }
  }

  for (const match of source.matchAll(dataSlotPattern)) {
    const slot = match[1];
    if (!isKnownSlot(slot, registry)) {
      errors.push(
        formatHardFail(
          "unknown-slot",
          normalizedPath,
          `data-slot="${slot}" is not registered by the slot identity contract.`
        )
      );
    }
  }

  if (localVocabularyPattern.test(source)) {
    errors.push(
      formatHardFail(
        "local-vocabulary-declaration",
        normalizedPath,
        "Local vocabulary arrays must import or reference contract vocabularies."
      )
    );
  }

  for (const match of source.matchAll(quotedLegacySemanticPattern)) {
    errors.push(
      formatHardFail(
        "unregistered-semantic-alias",
        normalizedPath,
        `"${match[1]}" is a forbidden semantic alias.`
      )
    );
  }

  for (const match of source.matchAll(classLegacySemanticPattern)) {
    errors.push(
      formatHardFail(
        "unregistered-semantic-alias",
        normalizedPath,
        `${match[0]} uses a forbidden semantic alias.`
      )
    );
  }

  for (const match of source.matchAll(propLegacySemanticPattern)) {
    errors.push(
      formatHardFail(
        "unregistered-semantic-alias",
        normalizedPath,
        `${match[0]} uses a forbidden semantic alias.`
      )
    );
  }

  for (const match of source.matchAll(variantDataPattern)) {
    const [, axis, value] = match;
    const known = axis === "tone" ? registry.tones : registry.variants;
    if (!known.has(value)) {
      errors.push(
        formatHardFail(
          "ungoverned-variant",
          normalizedPath,
          `data-[${axis}=${value}] is not registered in the variant identity contract.`
        )
      );
    }
  }

  for (const match of source.matchAll(semanticTailwindPattern)) {
    errors.push(
      formatHardFail(
        "raw-semantic-tailwind",
        normalizedPath,
        `${match[0]} bypasses token and recipe ownership.`
      )
    );
  }

  for (const match of source.matchAll(rawHexPattern)) {
    errors.push(
      formatHardFail(
        "raw-semantic-tailwind",
        normalizedPath,
        `${match[0]} is a raw hex value outside token ownership.`
      )
    );
  }

  const isStory = normalizedPath.endsWith(".stories.tsx");
  if (
    isStory &&
    (requireExampleVersion || exampleTagPattern.test(source)) &&
    !source.includes(`afendaContractVersion: "${registry.contractVersion}"`)
  ) {
    errors.push(
      formatHardFail(
        "stale-example",
        normalizedPath,
        `Storybook example must declare afendaContractVersion: "${registry.contractVersion}".`
      )
    );
  }

  return errors;
}

export function extractStringArray(source, name) {
  const body = extractConstBody(source, name, "[", "]");
  return body ? [...body.matchAll(tsStringPattern)].map((match) => match[1]) : [];
}

export function extractObjectKeys(source, name) {
  const body = extractConstBody(source, name, "{", "}");
  if (!body) {
    return [];
  }

  return [...body.matchAll(/^\s*([A-Za-z][A-Za-z0-9_]*)\s*:/gm)].map(
    (match) => match[1]
  );
}

export function extractObjectStringArrays(source, name) {
  const body = extractConstBody(source, name, "{", "}");
  const result = {};
  if (!body) {
    return result;
  }

  for (const match of body.matchAll(/^\s*([A-Za-z][A-Za-z0-9_]*)\s*:\s*\[([^\]]*)\]/gm)) {
    result[match[1]] = [...match[2].matchAll(tsStringPattern)].map(
      (valueMatch) => valueMatch[1]
    );
  }
  return result;
}

export function extractBarrelExportNames(source) {
  return [...source.matchAll(/export\s+(?:type\s+)?\{([^}]+)\}/g)]
    .flatMap((match) => match[1].split(","))
    .map((entry) => entry.trim())
    .filter((entry) => entry && !entry.startsWith("type "))
    .map((entry) => entry.split(/\s+as\s+/)[0].trim())
    .filter((entry) => /^[A-Z]/.test(entry));
}

function shouldCheckComponentName(name, localComponents, externalComponents) {
  if (
    localComponents.has(name) ||
    externalComponents.has(name) ||
    name.endsWith("Icon")
  ) {
    return false;
  }

  return /(Action|Bar|Block|Card|Chart|Dialog|Header|Footer|Metric|Panel|Shell|Sidebar|Table|Timeline|Toolbar|Topbar)$/.test(
    name
  );
}

function extractExternalImportNames(source) {
  const names = new Set();

  for (const match of source.matchAll(namedImportPattern)) {
    const [, namedImports, specifier] = match;
    if (
      specifier.startsWith(".") ||
      specifier.startsWith("@repo/design-system")
    ) {
      continue;
    }

    for (const entry of namedImports.split(",")) {
      const name = entry.trim().split(/\s+as\s+/).pop()?.trim();
      if (name && /^[A-Z]/.test(name)) {
        names.add(name);
      }
    }
  }

  return names;
}

function isKnownSlot(slot, registry) {
  return (
    registry.exactSlots.has(slot) ||
    registry.slotPatterns.some((pattern) => pattern.test(slot))
  );
}

function extractConstString(source, name) {
  return source.match(
    new RegExp(`export\\s+const\\s+${escapeRegExp(name)}\\s*=\\s*["']([^"']+)["']`)
  )?.[1];
}

function extractConstBody(source, name, open, close) {
  const start = source.indexOf(`const ${name}`);
  const exportStart = source.indexOf(`export const ${name}`);
  const declarationStart =
    start === -1 ? exportStart : exportStart === -1 ? start : Math.min(start, exportStart);
  if (declarationStart === -1) {
    return undefined;
  }

  const openIndex = source.indexOf(open, declarationStart);
  if (openIndex === -1) {
    return undefined;
  }

  let depth = 0;
  for (let index = openIndex; index < source.length; index += 1) {
    const char = source[index];
    if (char === open) {
      depth += 1;
    }
    if (char === close) {
      depth -= 1;
      if (depth === 0) {
        return source.slice(openIndex + 1, index);
      }
    }
  }

  return undefined;
}

function formatHardFail(rule, path, message) {
  return `[${rule}] ${path}: ${message}`;
}

function readIfExists(path) {
  return existsSync(path) ? readFileSync(path, "utf8") : "";
}

function normalizePath(path) {
  return path.replace(/\\/g, "/");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
