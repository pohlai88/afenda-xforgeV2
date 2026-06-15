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
const storiesDir = join(root, "apps", "storybook", "stories");
const afendaUiStoriesDir = join(storiesDir, "afenda-ui");
const primitiveContractPath = join(
  root,
  "packages",
  "design-system",
  "contracts",
  "primitive-hardening.contract.ts"
);
const primitiveDocPath = join(
  root,
  "packages",
  "design-system",
  "docs",
  "primitive-hardening.md"
);
const readinessStoryPath = join(
  root,
  "apps",
  "storybook",
  "stories",
  "primitive-readiness.stories.tsx"
);

const componentExtension = /\.tsx$/;
const storyExtension = /\.stories\.tsx$/;
const rawHexPattern = /#[0-9a-fA-F]{3,8}\b/g;
const transitionAllPattern = /\btransition-all\b/;
const layoutTransitionPattern =
  /\btransition-\[[^\]]*(?:width|height|top|right|bottom|left|margin|padding)[^\]]*\]/;
const outlineRemovalPattern =
  /\b(?:outline-none|outline-hidden|focus:outline-none)\b/;
const focusAffordancePattern = /\b(?:focus|focus-visible)(?::|\])/;
const warmthPattern =
  /\b(?:warm-(?:bark|doe|pink)|--warm-(?:bark|doe|pink)|--xforge-color-(?:bark|doe|pink))\b/;

const errors = [];
const warnings = [];

for (const path of [
  primitiveContractPath,
  primitiveDocPath,
  readinessStoryPath,
]) {
  if (!existsSync(path)) {
    errors.push(
      `Missing primitive readiness artifact: ${relative(root, path)}`
    );
  }
}

const componentSets = [
  {
    dir: afendaUiDir,
    label: "components/afenda-ui",
    storyDir: afendaUiStoriesDir,
  },
];

for (const { dir, label, storyDir } of componentSets) {
  if (!(existsSync(dir) && existsSync(storyDir))) {
    continue;
  }

  const components = readdirSync(dir)
    .filter((file) => file.endsWith(".tsx"))
    .map((file) => file.replace(componentExtension, ""));

  const stories = new Set(
    readdirSync(storyDir)
      .filter((file) => file.endsWith(".stories.tsx"))
      .map((file) => file.replace(storyExtension, ""))
  );

  for (const component of components) {
    if (!stories.has(component)) {
      errors.push(`Missing primitive story for ${label}/${component}.tsx`);
    }
  }
}

for (const file of walk([uiDir, afendaUiDir])) {
  if (!file.endsWith(".tsx")) {
    continue;
  }

  const content = readFileSync(file, "utf8");
  const path = relative(root, file);

  if (transitionAllPattern.test(content)) {
    errors.push(`Primitive uses transition-all: ${path}`);
  }

  if (layoutTransitionPattern.test(content)) {
    errors.push(`Primitive animates layout property: ${path}`);
  }

  if (warmthPattern.test(content)) {
    errors.push(
      `Primitive uses warmth token outside low-frequency expression: ${path}`
    );
  }

  if (file.endsWith(`${join("ui", "chart.tsx")}`)) {
    continue;
  }

  const hexMatches = content.match(rawHexPattern);
  if (hexMatches?.length) {
    errors.push(
      `Primitive contains raw hex color: ${path} (${[...new Set(hexMatches)].join(", ")})`
    );
  }

  for (const [index, line] of content.split(/\r?\n/).entries()) {
    if (!outlineRemovalPattern.test(line)) {
      continue;
    }

    const context = content
      .split(/\r?\n/)
      .slice(Math.max(0, index - 1), index + 3)
      .join(" ");

    if (
      !(
        focusAffordancePattern.test(context) ||
        hasFileLevelFocusAffordance(content)
      )
    ) {
      warnings.push(
        `Outline removed without nearby focus affordance: ${path}:${index + 1}`
      );
    }
  }
}

if (errors.length || warnings.length) {
  const status = errors.length ? "NOT READY" : "READY WITH WARNINGS";
  console.error(`Primitive readiness: ${status}`);
  for (const error of errors) {
    console.error(`ERROR: ${error}`);
  }
  for (const warning of warnings) {
    console.error(`WARNING: ${warning}`);
  }
  process.exit(errors.length ? 1 : 0);
}

console.log("Primitive readiness: READY");

function walk(paths) {
  const files = [];
  for (const path of paths) {
    if (!existsSync(path)) {
      continue;
    }

    const stat = statSync(path);
    if (stat.isDirectory()) {
      for (const child of readdirSync(path)) {
        files.push(...walk([join(path, child)]));
      }
    } else {
      files.push(path);
    }
  }
  return files;
}

function hasFileLevelFocusAffordance(content) {
  return (
    content.includes('recipe("focusRing') ||
    content.includes('"focusRing"') ||
    content.includes('"focusRingOnly"') ||
    content.includes("focus-visible:")
  );
}
