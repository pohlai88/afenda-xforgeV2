import { readFileSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const tokensPath = join(
  root,
  "packages",
  "design-system",
  "tokens",
  "tokens.json"
);
const globalsPath = join(
  root,
  "packages",
  "design-system",
  "styles",
  "globals.css"
);
const cssVariablePattern = /--[a-z0-9-]+(?=\s*:)/g;

const tokens = JSON.parse(readFileSync(tokensPath, "utf8"));
const globals = readFileSync(globalsPath, "utf8");
const cssVariables = new Set(globals.match(cssVariablePattern) ?? []);
const expectedCssVariables = new Set(getExpectedCssVariables(tokens));
const missingCssVariables = [...expectedCssVariables]
  .filter((variable) => !cssVariables.has(variable))
  .sort();
const tokenCategoryNames = [
  "color",
  "radius",
  "spacing",
  "layout",
  "typography",
  "shadow",
  "motion",
  "zIndex",
];
const metadataCategoryNames = Object.keys(tokens.metadata?.categories ?? {});
const missingCategoryMetadata = tokenCategoryNames.filter(
  (category) => !metadataCategoryNames.includes(category)
);
const missingFigmaCollections = tokenCategoryNames.filter(
  (category) => !tokens.metadata?.categories?.[category]?.figmaCollection
);
const report = {
  files: {
    globals: relative(root, globalsPath),
    tokens: relative(root, tokensPath),
  },
  counts: {
    cssVariables: cssVariables.size,
    expectedCssVariables: expectedCssVariables.size,
    metadataCategories: metadataCategoryNames.length,
  },
  missingCategoryMetadata,
  missingCssVariables,
  missingFigmaCollections,
  status:
    missingCssVariables.length ||
    missingCategoryMetadata.length ||
    missingFigmaCollections.length
      ? "DRIFT"
      : "READY",
};

console.log(JSON.stringify(report, null, 2));

if (report.status !== "READY") {
  process.exit(1);
}

function getExpectedCssVariables(source) {
  return [
    ...Object.keys(source.color ?? {}).map(
      (name) => `--xforge-color-${toKebab(name)}`
    ),
    ...Object.keys(source.radius ?? {}).map(
      (name) => `--xforge-radius-${toKebab(name)}`
    ),
    ...Object.keys(source.spacing ?? {}).map(
      (name) => `--xforge-space-${toKebab(name)}`
    ),
    ...Object.keys(source.layout ?? {}).map(
      (name) => `--xforge-layout-${toKebab(name)}`
    ),
    ...Object.keys(source.shadow ?? {}).map(
      (name) => `--xforge-shadow-${toKebab(name)}`
    ),
    ...Object.keys(source.motion ?? {}).map(
      (name) => `--xforge-${toKebab(name)}`
    ),
    ...Object.keys(source.zIndex ?? {}).map(
      (name) => `--xforge-z-${toKebab(name)}`
    ),
    ...Object.keys(source.typography ?? {}).flatMap((name) => [
      `--xforge-font-${toKebab(name)}-size`,
      `--xforge-font-${toKebab(name)}-weight`,
      `--xforge-font-${toKebab(name)}-line-height`,
    ]),
  ];
}

function toKebab(value) {
  return value.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}
