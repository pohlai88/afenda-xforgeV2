import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const uiDir = join(root, "packages", "design-system", "components", "ui");
const afendaUiDir = join(
  root,
  "packages",
  "design-system",
  "components",
  "afenda-ui"
);
const afendaRecipePath = join(afendaUiDir, "recipes.ts");
const afendaRecipeContractPath = join(afendaUiDir, "recipes.contract.ts");
const afendaIndexPath = join(afendaUiDir, "index.ts");
const blocksDir = join(
  root,
  "packages",
  "design-system",
  "components",
  "blocks"
);
const blockRecipePath = join(blocksDir, "block-recipes.ts");
const blockRecipeContractPath = join(blocksDir, "block-recipes.contract.ts");
const blockLayoutContractsPath = join(blocksDir, "layout-contracts.ts");
const blockIndexPath = join(blocksDir, "index.ts");
const blockGovernancePath = join(
  root,
  "packages",
  "design-system",
  "docs",
  "block-governance.md"
);
const storiesDir = join(root, "apps", "storybook", "stories");
const blockStoriesDir = join(storiesDir, "blocks");
const globalsPath = join(
  root,
  "packages",
  "design-system",
  "styles",
  "globals.css"
);
const colorContractPath = join(
  root,
  "packages",
  "design-system",
  "contracts",
  "color.contract.ts"
);
const mindfulOperatorPath = join(
  root,
  "packages",
  "design-system",
  "docs",
  "mindful-operator.md"
);
const primitiveHardeningContractPath = join(
  root,
  "packages",
  "design-system",
  "contracts",
  "primitive-hardening.contract.ts"
);
const primitiveHardeningPath = join(
  root,
  "packages",
  "design-system",
  "docs",
  "primitive-hardening.md"
);
const primitiveReadinessStoryPath = join(
  root,
  "apps",
  "storybook",
  "stories",
  "primitive-readiness.stories.tsx"
);
const tokenLayerContractPath = join(
  root,
  "packages",
  "design-system",
  "contracts",
  "token-layer.contract.ts"
);
const tokenUsagePolicyPath = join(
  root,
  "packages",
  "design-system",
  "tokens",
  "token-usage.policy.ts"
);
const tokensPath = join(
  root,
  "packages",
  "design-system",
  "tokens",
  "tokens.json"
);
const componentExtension = /\.tsx$/;
const storyExtension = /\.stories\.tsx$/;
const rawColorFileExtension = /\.(ts|tsx|css|json)$/;
const hexPattern = /#[0-9a-fA-F]{3,8}\b/g;
const strictHexPattern = /^#[0-9a-fA-F]{6}$/;
const tokenReferencePattern = /^\{(.+)\}$/;
const afendaRecipeImportPattern = /import\s+\{[^}]*\brecipe\b[^}]*\}\s+from\s+["']\.\/recipes["']/;
const afendaRecipeUsagePattern = /\brecipe\(/;
const afendaNestedRecipeUsagePattern = /afendaRecipe\./;
const overlayPortalStandardization = [
  {
    component: "dialog",
    portal: "DialogPortal",
    content: "DialogContent",
    prop: "portalProps?: React.ComponentProps<typeof DialogPrimitive.Portal>",
  },
  {
    component: "alert-dialog",
    portal: "AlertDialogPortal",
    content: "AlertDialogContent",
    prop: "portalProps?: React.ComponentProps<typeof AlertDialogPrimitive.Portal>",
  },
  {
    component: "sheet",
    portal: "SheetPortal",
    content: "SheetContent",
    prop: "portalProps?: React.ComponentProps<typeof SheetPrimitive.Portal>",
  },
  {
    component: "drawer",
    portal: "DrawerPortal",
    content: "DrawerContent",
    prop: "portalProps?: React.ComponentProps<typeof DrawerPrimitive.Portal>",
  },
  {
    component: "dropdown-menu",
    portal: "DropdownMenuPortal",
    content: "DropdownMenuContent",
    prop: "portalProps?: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>",
  },
  {
    component: "context-menu",
    portal: "ContextMenuPortal",
    content: "ContextMenuContent",
    prop: "portalProps?: React.ComponentProps<typeof ContextMenuPrimitive.Portal>",
  },
  {
    component: "menubar",
    portal: "MenubarPortal",
    content: "MenubarContent",
    prop: "portalProps?: React.ComponentProps<typeof MenubarPrimitive.Portal>",
  },
  {
    component: "popover",
    portal: "PopoverPortal",
    content: "PopoverContent",
    prop: "portalProps?: React.ComponentProps<typeof PopoverPrimitive.Portal>",
  },
  {
    component: "hover-card",
    portal: "HoverCardPortal",
    content: "HoverCardContent",
    prop: "portalProps?: React.ComponentProps<typeof HoverCardPrimitive.Portal>",
  },
  {
    component: "select",
    portal: "SelectPortal",
    content: "SelectContent",
    prop: "portalProps?: React.ComponentProps<typeof SelectPrimitive.Portal>",
  },
  {
    component: "tooltip",
    portal: "TooltipPortal",
    content: "TooltipContent",
    prop: "portalProps?: React.ComponentProps<typeof TooltipPrimitive.Portal>",
  },
];
const blockRecipeImportPattern =
  /import\s+\{[^}]*\bblockRecipe\b[^}]*\}\s+from\s+["'][^"']*block-recipes["']|import\s+\{[^}]*\bblockRecipe\b[^}]*\}\s+from\s+["'][^"']*components\/blocks["']/;
const blockRecipeUsagePattern = /\bblockRecipe\(/;
const blockNestedRecipeUsagePattern = /afendaBlockRecipe\./;
const zodImportPattern = /from\s+["']zod["']|require\(["']zod["']\)/;
const recipeContractPattern = /satisfies\s+AfendaRecipeContract/;
const blockRecipeContractPattern = /satisfies\s+AfendaBlockRecipeContract/;
const cssVariableReferencePattern = /var\((--[^)]+)\)/g;
const afendaComponentDriftPatterns = [
  {
    pattern: /tracking-\[-/,
    message: "Use afendaRecipe typography instead of negative tracking.",
  },
  {
    pattern: /rounded-sm/,
    message: "Use afendaRecipe radius classes instead of rounded-sm.",
  },
  {
    pattern: /shadow-sm/,
    message: "Form controls must stay flat; use afendaRecipe surfaces.",
  },
  {
    pattern: /data-\[state=checked\]:font-medium/,
    message: "Selected rows must not change font weight.",
  },
  {
    pattern: /focus:bg-surface-muted(?!\/)/,
    message: "Interactive row hover must use the recipe opacity strength.",
  },
  {
    pattern: /(?:hover|focus|active):bg-surface-muted\//,
    message: "Interactive surfaces must use surface-hover or surface-active tokens.",
  },
  {
    pattern: /data-\[[^\]]+\]:bg-surface-muted\//,
    message: "Stateful surfaces must use surface-hover or surface-active tokens.",
  },
  {
    pattern: /border-border-focus/,
    message: "Components must use border-border-active for active/focus state.",
  },
];

const errors = [];
const globals = readFileSync(globalsPath, "utf8");

for (const path of [
  colorContractPath,
  mindfulOperatorPath,
  primitiveHardeningContractPath,
  primitiveHardeningPath,
  primitiveReadinessStoryPath,
  tokenLayerContractPath,
  tokenUsagePolicyPath,
  blockGovernancePath,
]) {
  if (!existsSync(path)) {
    errors.push(
      `Missing design-system governance artifact: ${relative(root, path)}`
    );
  }
}

const uiComponents = readdirSync(uiDir)
  .filter((file) => file.endsWith(".tsx"))
  .map((file) => file.replace(componentExtension, ""));

const stories = new Set(
  readdirSync(storiesDir)
    .filter((file) => file.endsWith(".stories.tsx"))
    .map((file) => file.replace(storyExtension, ""))
);

for (const component of uiComponents) {
  if (!stories.has(component)) {
    errors.push(
      `Missing Storybook coverage for components/ui/${component}.tsx`
    );
  }
}

if (existsSync(afendaUiDir)) {
  const afendaUiComponents = readdirSync(afendaUiDir)
    .filter((file) => file.endsWith(".tsx"))
    .map((file) => file.replace(componentExtension, ""));
  const afendaIndexSource = existsSync(afendaIndexPath)
    ? readFileSync(afendaIndexPath, "utf8")
    : "";

  const afendaUiStoriesDir = join(storiesDir, "afenda-ui");
  const afendaUiStories = existsSync(afendaUiStoriesDir)
    ? new Set(
        readdirSync(afendaUiStoriesDir)
          .filter((file) => file.endsWith(".stories.tsx"))
          .map((file) => file.replace(storyExtension, ""))
      )
    : new Set();

  for (const component of afendaUiComponents) {
    if (!afendaUiStories.has(component)) {
      errors.push(
        `Missing Storybook coverage for components/afenda-ui/${component}.tsx`
      );
    }
  }

  if (!existsSync(afendaRecipePath)) {
    errors.push("Missing Afenda UI recipe: components/afenda-ui/recipes.ts");
  } else {
    const recipeSource = readFileSync(afendaRecipePath, "utf8");

    if (zodImportPattern.test(recipeSource)) {
      errors.push("components/afenda-ui/recipes.ts must stay client-safe and not import Zod.");
    }

    if (!recipeContractPattern.test(recipeSource)) {
      errors.push("components/afenda-ui/recipes.ts must satisfy AfendaRecipeContract.");
    }

    for (const token of [
      "--xforge-font-body-size",
      "--xforge-font-caption-size",
      "--button-radius",
      "--button-height",
      "--button-padding-x",
      "--card-radius",
      "--modal-radius",
    ]) {
      if (!recipeSource.includes(token)) {
        errors.push(`components/afenda-ui/recipes.ts must reference ${token}.`);
      }
    }
  }

  if (!existsSync(afendaRecipeContractPath)) {
    errors.push(
      "Missing Afenda UI recipe contract: components/afenda-ui/recipes.contract.ts"
    );
  } else {
    const contractSource = readFileSync(afendaRecipeContractPath, "utf8");

    if (!zodImportPattern.test(contractSource)) {
      errors.push("components/afenda-ui/recipes.contract.ts must validate metadata with Zod.");
    }

    if (!contractSource.includes("afendaRecipeContractSchema.parse(afendaRecipe)")) {
      errors.push("components/afenda-ui/recipes.contract.ts must parse afendaRecipe.");
    }
  }

  for (const file of readdirSync(afendaUiDir).filter((entry) =>
    entry.endsWith(".tsx")
  )) {
    if (file === "index.tsx") {
      continue;
    }

    const path = join(afendaUiDir, file);
    const source = readFileSync(path, "utf8");
    const relativePath = relative(root, path);
    const componentName = file.replace(componentExtension, "");
    const barrelExportPattern = new RegExp(
      `from\\s+["']\\./${escapeRegExp(componentName)}["']`
    );

    if (!afendaRecipeImportPattern.test(source) || !afendaRecipeUsagePattern.test(source)) {
      errors.push(`${relativePath} must compose from recipe(...).`);
    }

    if (!barrelExportPattern.test(afendaIndexSource)) {
      errors.push(`${relativePath} must be exported from components/afenda-ui/index.ts.`);
    }

    for (const exportName of exportedValueNames(source)) {
      const valueExportPattern = new RegExp(
        `export\\s+\\{[\\s\\S]*\\b${escapeRegExp(exportName)}\\b[\\s\\S]*\\}\\s+from\\s+["']\\./${escapeRegExp(componentName)}["']`
      );

      if (!valueExportPattern.test(afendaIndexSource)) {
        errors.push(
          `${relativePath} exports ${exportName}, but components/afenda-ui/index.ts does not re-export it.`
        );
      }
    }

    for (const typeName of exportedTypeNames(source)) {
      const typeExportPattern = new RegExp(
        `export\\s+type\\s+\\{[^}]*\\b${escapeRegExp(typeName)}\\b[^}]*\\}\\s+from\\s+["']\\./${escapeRegExp(componentName)}["']`
      );

      if (!typeExportPattern.test(afendaIndexSource)) {
        errors.push(
          `${relativePath} exports type ${typeName}, but components/afenda-ui/index.ts does not re-export it.`
        );
      }
    }

    if (afendaNestedRecipeUsagePattern.test(source)) {
      errors.push(`${relativePath} must not use nested afendaRecipe.* class access.`);
    }

    for (const { pattern, message } of afendaComponentDriftPatterns) {
      if (pattern.test(source)) {
        errors.push(`${relativePath}: ${message}`);
      }
    }
  }

  for (const { component, portal, content, prop } of overlayPortalStandardization) {
    const path = join(afendaUiDir, `${component}.tsx`);

    if (!existsSync(path)) {
      errors.push(`Missing standardized overlay component: components/afenda-ui/${component}.tsx`);
      continue;
    }

    const source = readFileSync(path, "utf8");
    const relativePath = relative(root, path);

    if (!source.includes(`function ${portal}(`)) {
      errors.push(`${relativePath} must export a first-class ${portal} wrapper.`);
    }

    if (!source.includes(`function ${content}(`)) {
      errors.push(`${relativePath} must define ${content}.`);
    }

    if (!source.includes(prop)) {
      errors.push(`${relativePath} must expose standardized portalProps passthrough on ${content}.`);
    }

    if (!source.includes(`<${portal} {...portalProps}>`)) {
      errors.push(`${relativePath} must route ${content} through ${portal}.`);
    }
  }
}

if (existsSync(blocksDir)) {
  for (const path of [
    blockRecipePath,
    blockRecipeContractPath,
    blockLayoutContractsPath,
    blockIndexPath,
  ]) {
    if (!existsSync(path)) {
      errors.push(`Missing block governance artifact: ${relative(root, path)}`);
    }
  }

  if (!existsSync(blockStoriesDir)) {
    errors.push("Missing block Storybook directory: apps/storybook/stories/blocks");
  }

  if (!existsSync(join(blockStoriesDir, "block-readiness.stories.tsx"))) {
    errors.push("Missing block readiness story: apps/storybook/stories/blocks/block-readiness.stories.tsx");
  }

  if (existsSync(blockRecipePath)) {
    const blockRecipeSource = readFileSync(blockRecipePath, "utf8");

    if (zodImportPattern.test(blockRecipeSource)) {
      errors.push("components/blocks/block-recipes.ts must stay client-safe and not import Zod.");
    }

    if (!blockRecipeContractPattern.test(blockRecipeSource)) {
      errors.push("components/blocks/block-recipes.ts must satisfy AfendaBlockRecipeContract.");
    }

    for (const token of new Set(
      [...blockRecipeSource.matchAll(cssVariableReferencePattern)].map(
        (match) => match[1]
      )
    )) {
      if (!globals.includes(token)) {
        errors.push(`components/blocks/block-recipes.ts references missing globals.css token ${token}.`);
      }
    }
  }

  if (existsSync(blockRecipeContractPath)) {
    const blockContractSource = readFileSync(blockRecipeContractPath, "utf8");

    if (!zodImportPattern.test(blockContractSource)) {
      errors.push("components/blocks/block-recipes.contract.ts must validate metadata with Zod.");
    }

    if (!blockContractSource.includes("afendaBlockRecipeContractSchema.parse(afendaBlockRecipe)")) {
      errors.push("components/blocks/block-recipes.contract.ts must parse afendaBlockRecipe.");
    }
  }

  if (existsSync(blockLayoutContractsPath)) {
    const blockLayoutContractSource = readFileSync(
      blockLayoutContractsPath,
      "utf8"
    );

    for (const family of [
      "page-header",
      "filter-bar",
      "data-table-shell",
      "entity-summary-panel",
      "audit-trail-panel",
      "stats-strip",
      "empty-panel",
      "form-section",
    ]) {
      if (!blockLayoutContractSource.includes(`"${family}"`)) {
        errors.push(`components/blocks/layout-contracts.ts must define ${family}.`);
      }
    }
  }

  const blockStories = existsSync(blockStoriesDir)
    ? new Set(
        readdirSync(blockStoriesDir)
          .filter((file) => file.endsWith(".stories.tsx"))
          .map((file) => file.replace(storyExtension, ""))
      )
    : new Set();

  const blockComponents = readdirSync(blocksDir)
    .filter((file) => file.endsWith(".tsx"))
    .map((file) => file.replace(componentExtension, ""));

  for (const component of blockComponents) {
    if (!blockStories.has(component)) {
      errors.push(
        `Missing Storybook coverage for components/blocks/${component}.tsx`
      );
    }

    const path = join(blocksDir, `${component}.tsx`);
    const source = readFileSync(path, "utf8");
    const relativePath = relative(root, path);

    if (!blockRecipeImportPattern.test(source) || !blockRecipeUsagePattern.test(source)) {
      errors.push(`${relativePath} must compose from blockRecipe(...).`);
    }

    if (blockNestedRecipeUsagePattern.test(source)) {
      errors.push(`${relativePath} must not use nested afendaBlockRecipe.* class access.`);
    }
  }
}

const tokens = JSON.parse(readFileSync(tokensPath, "utf8"));

for (const token of [
  "--surface-hover",
  "--surface-active",
  "--border-hover",
  "--border-active",
]) {
  if (!globals.includes(token)) {
    errors.push(`globals.css must define ${token}.`);
  }
}

for (const colorName of Object.keys(tokens.color)) {
  const cssName = `--xforge-color-${toKebab(colorName)}`;
  if (!globals.includes(cssName)) {
    errors.push(`Missing CSS variable ${cssName} from globals.css`);
  }
}

for (const radiusName of Object.keys(tokens.radius)) {
  const cssName = `--xforge-radius-${toKebab(radiusName)}`;
  if (!globals.includes(cssName)) {
    errors.push(`Missing CSS variable ${cssName} from globals.css`);
  }
}

for (const spacingName of Object.keys(tokens.spacing)) {
  const cssName = `--xforge-space-${toKebab(spacingName)}`;
  if (!globals.includes(cssName)) {
    errors.push(`Missing CSS variable ${cssName} from globals.css`);
  }
}

for (const layoutName of Object.keys(tokens.layout)) {
  const cssName = `--xforge-layout-${toKebab(layoutName)}`;
  if (!globals.includes(cssName)) {
    errors.push(`Missing CSS variable ${cssName} from globals.css`);
  }
}

for (const shadowName of Object.keys(tokens.shadow)) {
  const cssName = `--xforge-shadow-${toKebab(shadowName)}`;
  if (!globals.includes(cssName)) {
    errors.push(`Missing CSS variable ${cssName} from globals.css`);
  }
}

for (const motionName of Object.keys(tokens.motion)) {
  const cssName = `--xforge-${toKebab(motionName)}`;
  if (!globals.includes(cssName)) {
    errors.push(`Missing CSS variable ${cssName} from globals.css`);
  }
}

for (const zIndexName of Object.keys(tokens.zIndex)) {
  const cssName = `--xforge-z-${toKebab(zIndexName)}`;
  if (!globals.includes(cssName)) {
    errors.push(`Missing CSS variable ${cssName} from globals.css`);
  }
}

for (const typographyName of Object.keys(tokens.typography)) {
  for (const property of ["size", "weight", "line-height"]) {
    const cssName = `--xforge-font-${toKebab(typographyName)}-${property}`;
    if (!globals.includes(cssName)) {
      errors.push(`Missing CSS variable ${cssName} from globals.css`);
    }
  }
}

for (const category of [
  "color",
  "spacing",
  "typography",
  "radius",
  "shadow",
  "motion",
  "zIndex",
]) {
  if (!hasTokenCategory(tokens, "primitive", category)) {
    errors.push(`Missing primitive token category: ${category}`);
  }
}

for (const category of ["color", "shadow", "motion"]) {
  if (!hasTokenCategory(tokens, "semantic", category)) {
    errors.push(`Missing semantic token category: ${category}`);
  }
}

if (!(tokens.component && Object.keys(tokens.component).length)) {
  errors.push("Missing component token layer.");
}

const lightBrand = resolveTokenReference(
  tokens,
  tokens.semantic?.color?.light?.brandPrimary
);
const lightSuccess = resolveTokenReference(
  tokens,
  tokens.semantic?.color?.light?.statusSuccess
);

if (lightBrand && lightSuccess && lightBrand === lightSuccess) {
  errors.push(
    "Brand primary and status success must not resolve to the same value."
  );
}

for (const mode of ["light", "dark"]) {
  const semanticColors = tokens.semantic?.color?.[mode] ?? {};
  for (const [name, value] of Object.entries(semanticColors)) {
    if (name.startsWith("status") && /bark|doe|pink/i.test(value)) {
      errors.push(
        `Warmth token ${value} is mapped to operational status ${mode}.${name}.`
      );
    }
  }
}

for (const pair of tokens.contrast?.pairs ?? []) {
  const foreground = resolveTokenValue(tokens, pair.foreground);
  const background = resolveTokenValue(tokens, pair.background);

  if (!(isHexColor(foreground) && isHexColor(background))) {
    errors.push(`Contrast pair "${pair.name}" must resolve to hex colors.`);
    continue;
  }

  const wcag = wcagContrast(foreground, background);
  const apca = Math.abs(apcaLc(foreground, background));

  if (wcag < pair.minWcag) {
    errors.push(
      `Contrast pair "${pair.name}" WCAG ${wcag.toFixed(2)} is below ${pair.minWcag}.`
    );
  }

  if (apca < pair.minApca) {
    errors.push(
      `Contrast pair "${pair.name}" APCA Lc ${apca.toFixed(1)} is below ${pair.minApca}.`
    );
  }
}

const rawColorRoots = [
  join(root, "apps", "app"),
  join(root, "apps", "web"),
  join(root, "packages", "design-system"),
];
const rawColorAllowList = new Set([
  normalize(join(root, "packages", "design-system", "tokens", "tokens.json")),
  normalize(
    join(root, "packages", "design-system", "tokens", "tokens.schema.json")
  ),
  normalize(globalsPath),
  normalize(
    join(root, "packages", "design-system", "components", "ui", "chart.tsx")
  ),
]);

for (const file of walk(rawColorRoots)) {
  if (
    !rawColorFileExtension.test(file) ||
    rawColorAllowList.has(normalize(file))
  ) {
    continue;
  }

  const matches = readFileSync(file, "utf8").match(hexPattern);
  if (matches?.length) {
    errors.push(
      `Raw hex color in ${relative(root, file)}: ${[...new Set(matches)].join(", ")}`
    );
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("Design system drift checks passed.");

function toKebab(value) {
  return value.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}

function hasTokenCategory(tokens, layer, category) {
  return Boolean(tokens[layer]?.[category]);
}

function resolveTokenValue(tokens, path) {
  return path.split(".").reduce((value, key) => value?.[key], tokens);
}

function resolveTokenReference(tokens, value) {
  if (typeof value !== "string") {
    return undefined;
  }

  const match = value.match(tokenReferencePattern);
  if (!match) {
    return value;
  }

  return resolveTokenValue(tokens, match[1]);
}

function isHexColor(value) {
  return typeof value === "string" && strictHexPattern.test(value);
}

function wcagContrast(foreground, background) {
  const first = relativeLuminance(foreground);
  const second = relativeLuminance(background);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

function relativeLuminance(hex) {
  const [red, green, blue] = hexToRgb(hex).map((channel) => {
    const value = channel / 255;
    return value <= 0.039_28 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function apcaLc(foreground, background) {
  const text = apcaY(foreground);
  const canvas = apcaY(background);
  const scale = 1.14;
  const loClip = 0.1;

  if (canvas > text) {
    const sapc = (canvas ** 0.56 - text ** 0.57) * scale;
    return sapc < loClip ? 0 : (sapc - 0.027) * 100;
  }

  const sapc = (canvas ** 0.65 - text ** 0.62) * scale;
  return sapc > -loClip ? 0 : (sapc + 0.027) * 100;
}

function apcaY(hex) {
  const [red, green, blue] = hexToRgb(hex).map((channel) => {
    const value = channel / 255;
    return value ** 2.4;
  });

  const luminance = 0.212_672_9 * red + 0.715_152_2 * green + 0.072_175 * blue;
  const blackThreshold = 0.022;

  if (luminance >= blackThreshold) {
    return luminance;
  }

  return luminance + (blackThreshold - luminance) ** Math.SQRT2;
}

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  return [
    Number.parseInt(value.slice(0, 2), 16),
    Number.parseInt(value.slice(2, 4), 16),
    Number.parseInt(value.slice(4, 6), 16),
  ];
}

function normalize(value) {
  return value.replace(/\\/g, "/").toLowerCase();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function exportedTypeNames(source) {
  return [...source.matchAll(/^export type \{([^}]+)\}/gm)]
    .flatMap((match) => match[1].split(","))
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function exportedValueNames(source) {
  return [...source.matchAll(/^export \{([\s\S]*?)\}/gm)]
    .flatMap((match) => match[1].split(","))
    .map((entry) => entry.trim())
    .filter((entry) => entry && !entry.startsWith("type "))
    .map((entry) => entry.split(/\s+as\s+/)[0].trim())
    .filter(Boolean);
}

function walk(paths) {
  const files = [];
  for (const path of paths) {
    if (!existsSync(path)) {
      continue;
    }

    const stat = statSync(path);
    if (stat.isDirectory()) {
      if (
        path.includes(`${join("node_modules")}`) ||
        path.includes(`${join(".next")}`)
      ) {
        continue;
      }
      for (const child of readdirSync(path)) {
        files.push(...walk([join(path, child)]));
      }
    } else {
      files.push(path);
    }
  }
  return files;
}
