import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const storybookRoot = join(root, "apps", "storybook");
const storiesRoot = join(storybookRoot, "stories");
const mainConfigPath = join(storybookRoot, ".storybook", "main.ts");
const afendaUiStoriesDir = join(storiesRoot, "afenda-ui");
const blockStoriesDir = join(storiesRoot, "blocks");
const afendaUiComponentsDir = join(
  root,
  "packages",
  "design-system",
  "components",
  "afenda-ui"
);

const allowedRootStories = new Set([
  "tokens.stories.tsx",
]);

const restrictedUiImportPattern =
  /@repo\/design-system\/components\/ui(?:\/|["'])/;
const storyTitlePattern =
  /(?:const meta =|satisfies Meta)[\s\S]*?title:\s*["']([^"']+)["']/;
const rawHexPattern = /#[0-9a-fA-F]{3,8}\b/;
const transitionAllPattern = /\btransition-all\b/;

const errors = [];
const warnings = [];

if (existsSync(mainConfigPath)) {
  const mainSource = readFileSync(mainConfigPath, "utf8");

  if (
    /["']\.\.\/stories\/\*\*\/\*\.stories/.test(mainSource) ||
    /directory:\s*["']\.\.\/stories["'][\s\S]*files:\s*["']\*\*/.test(
      mainSource
    )
  ) {
    errors.push(
      "apps/storybook/.storybook/main.ts must not use a broad stories/** glob — register afenda-ui, blocks, and allowlisted root stories explicitly."
    );
  }

  if (!mainSource.includes('directory: "../stories/afenda-ui"')) {
    errors.push(
      "apps/storybook/.storybook/main.ts must register the afenda-ui story directory explicitly."
    );
  }

  if (!mainSource.includes('directory: "../stories/blocks"')) {
    errors.push(
      "apps/storybook/.storybook/main.ts must register the blocks story directory explicitly."
    );
  }
} else {
  errors.push("Missing Storybook main config.");
}

for (const file of readdirSync(storiesRoot)) {
  if (!file.endsWith(".stories.tsx")) {
    continue;
  }

  if (!allowedRootStories.has(file)) {
    errors.push(
      `Unexpected root story file: apps/storybook/stories/${file} — move it under afenda-ui/ or blocks/, or allowlist it in check-storybook-hygiene.mjs.`
    );
  }
}

for (const file of walkStoryFiles(storiesRoot)) {
  const source = readFileSync(file, "utf8");
  const path = relative(root, file);
  const titleMatch = source.match(storyTitlePattern);

  if (!titleMatch) {
    errors.push(`${path} is missing a CSF title.`);
    continue;
  }

  const title = titleMatch[1];

  if (file.startsWith(afendaUiStoriesDir)) {
    if (!title.startsWith("Afenda UI/")) {
      errors.push(
        `${path} title must start with "Afenda UI/" (found "${title}").`
      );
    }

    if (!source.includes('"afenda-ui"')) {
      errors.push(`${path} must include the "afenda-ui" tag.`);
    }
  } else if (file.startsWith(blockStoriesDir)) {
    if (!title.startsWith("Blocks/")) {
      errors.push(
        `${path} title must start with "Blocks/" (found "${title}").`
      );
    }

    if (!source.includes('"block"')) {
      errors.push(`${path} must include the "block" tag.`);
    }
  } else if (file.endsWith("tokens.stories.tsx")) {
    if (!title.startsWith("Foundations/")) {
      errors.push(
        `${path} title must start with "Foundations/" (found "${title}").`
      );
    }

    if (!source.includes('"foundations"')) {
      errors.push(`${path} must include the "foundations" tag.`);
    }
  }

  if (restrictedUiImportPattern.test(source)) {
    errors.push(
      `${path} imports components/ui — use afenda-ui in Storybook stories.`
    );
  }

  if (rawHexPattern.test(source)) {
    warnings.push(`${path} contains raw hex colors — prefer semantic tokens.`);
  }

  if (transitionAllPattern.test(source)) {
    errors.push(`${path} uses transition-all — prefer explicit motion tokens.`);
  }
}

if (existsSync(afendaUiComponentsDir) && existsSync(afendaUiStoriesDir)) {
  const components = readdirSync(afendaUiComponentsDir)
    .filter((file) => file.endsWith(".tsx"))
    .map((file) => file.replace(/\.tsx$/, ""));

  const stories = new Set(
    readdirSync(afendaUiStoriesDir)
      .filter((file) => file.endsWith(".stories.tsx"))
      .map((file) => file.replace(/\.stories\.tsx$/, ""))
  );

  for (const component of components) {
    if (!stories.has(component)) {
      errors.push(
        `Missing Afenda UI story for components/afenda-ui/${component}.tsx`
      );
    }
  }
}

if (errors.length || warnings.length) {
  console.error(
    `Storybook hygiene: ${errors.length ? "NOT READY" : "READY WITH WARNINGS"}`
  );

  for (const error of errors) {
    console.error(`ERROR: ${error}`);
  }

  for (const warning of warnings) {
    console.error(`WARNING: ${warning}`);
  }

  process.exit(errors.length ? 1 : 0);
}

console.log("Storybook hygiene checks passed.");

function walkStoryFiles(dir) {
  const files = [];

  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    const stat = statSync(path);

    if (stat.isDirectory()) {
      files.push(...walkStoryFiles(path));
      continue;
    }

    if (entry.endsWith(".stories.tsx")) {
      files.push(path);
    }
  }

  return files;
}
