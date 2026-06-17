import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const docsDir = join(root, "packages", "design-system", "docs");
const contractsDir = join(root, "packages", "design-system", "contracts");
const blockStoriesDir = join(root, "apps", "storybook", "stories", "blocks");
const designSystemPackagePath = join(
  root,
  "packages",
  "design-system",
  "package.json"
);
const rootPackagePath = join(root, "package.json");
const errors = [];

const requiredDocs = [
  "README.md",
  "block-authoring.md",
  "block-governance.md",
  "block-migration-guide.md",
  "design-system-docs-audit.md",
  "governance.md",
  "mindful-operator.md",
];
const requiredReadPaths = [
  "AI IDE Contract Wall",
  "Primitive Or Block Change",
  "Release Reviewer",
];
const requiredScaffoldLanguage = [
  "Internal Shadcn Scaffold",
  "protected internal shadcn generator scaffold",
  "must not import `@repo/design-system/components/ui`",
];
const requiredStoryEvidence = [
  "Blocks/Quality Gates",
  "Blocks/Block Readiness",
  "Blocks/Storybook Coverage",
];
const requiredRootScripts = [
  "blocks:quality",
  "design-system:component-api",
  "design-system:check-drift",
  "design-system:check-import-boundaries",
  "design-system:docs-audit",
  "design-system:governance",
  "design-system:primitive-readiness",
  "design-system:stabilize",
  "design-system:token-diff",
  "enterprise:governance",
  "governance",
  "storybook:hygiene",
  "ui-craft:detect",
];
const requiredDesignSystemGovernanceSteps = [
  "design-system:check-drift",
  "design-system:component-api",
  "design-system:docs-audit",
  "design-system:token-diff",
  "design-system:check-import-boundaries",
  "design-system:primitive-readiness",
  "storybook:hygiene",
  "ui-craft:detect",
  "--filter @repo/design-system typecheck",
  "--filter @repo/design-system test",
  "--filter storybook typecheck",
];
const requiredDesignSystemExports = [
  "./contracts/afenda-design-system",
  "./contracts/afenda-token",
  "./contracts/afenda-recipe",
  "./contracts/afenda-component",
  "./contracts/afenda-slot",
  "./contracts/afenda-variant",
  "./contracts/afenda-class-name-policy",
  "./contracts/afenda-export",
  "./contracts/afenda-accessibility",
  "./contracts/afenda-motion",
  "./contracts/afenda-state",
  "./contracts/afenda-example",
];
const staleReferences = [
  "Afenda Pattern Library",
  "components/blocks/schema",
  "components/blocks/registry",
  "pattern-library",
];
const legacyUiImportReference = "@repo/design-system/components/ui";
const contractReferencePattern = /contracts\/([a-z0-9-]+\.contract\.ts)/g;
const storyTitlePattern = /title:\s*["']([^"']+)["']/;

if (!existsSync(docsDir)) {
  errors.push("Missing design-system docs directory.");
}

for (const doc of requiredDocs) {
  const path = join(docsDir, doc);

  if (!existsSync(path)) {
    errors.push(`Missing design-system doc: ${relative(root, path)}`);
    continue;
  }

  const source = readFileSync(path, "utf8");

  if (!source.startsWith("# ")) {
    errors.push(`${relative(root, path)} must start with a top-level heading.`);
  }

  for (const staleReference of staleReferences) {
    if (source.includes(staleReference)) {
      errors.push(
        `${relative(root, path)} contains stale reference: ${staleReference}`
      );
    }
  }

  if (doc !== "README.md" && source.includes(legacyUiImportReference)) {
    errors.push(
      `${relative(root, path)} references internal scaffold import ${legacyUiImportReference}.`
    );
  }

  for (const match of source.matchAll(contractReferencePattern)) {
    const contractPath = join(contractsDir, match[1]);

    if (!existsSync(contractPath)) {
      errors.push(
        `${relative(root, path)} references missing contract ${match[1]}.`
      );
    }
  }
}

const docsReadmePath = join(docsDir, "README.md");
const docsReadme = existsSync(docsReadmePath)
  ? readFileSync(docsReadmePath, "utf8")
  : "";

for (const readPath of requiredReadPaths) {
  if (!docsReadme.includes(readPath)) {
    errors.push(`docs/README.md must include read path "${readPath}".`);
  }
}

for (const phrase of requiredScaffoldLanguage) {
  if (!docsReadme.includes(phrase)) {
    errors.push(`docs/README.md must document scaffold rule "${phrase}".`);
  }
}

for (const title of requiredStoryEvidence) {
  if (!docsReadme.includes(`\`${title}\``)) {
    errors.push(`docs/README.md must document Storybook evidence "${title}".`);
  }
}

const storyTitles = existsSync(blockStoriesDir)
  ? new Set(
      readdirSync(blockStoriesDir)
        .filter((file) => file.endsWith(".stories.tsx"))
        .map((file) => readStoryTitle(join(blockStoriesDir, file)))
        .filter(Boolean)
    )
  : new Set();

for (const title of requiredStoryEvidence) {
  if (!storyTitles.has(title)) {
    errors.push(`Missing Storybook evidence story "${title}".`);
  }
}

const rootPackage = JSON.parse(readFileSync(rootPackagePath, "utf8"));

for (const script of requiredRootScripts) {
  if (!rootPackage.scripts?.[script]) {
    errors.push(`Root package.json must define script "${script}".`);
  }
}

if (
  rootPackage.scripts?.["design-system:stabilize"] &&
  !rootPackage.scripts["design-system:stabilize"].includes(
    "design-system:docs-audit"
  )
) {
  errors.push("design-system:stabilize must include design-system:docs-audit.");
}

const designSystemGovernance =
  rootPackage.scripts?.["design-system:governance"] ?? "";
for (const step of requiredDesignSystemGovernanceSteps) {
  if (!designSystemGovernance.includes(step)) {
    errors.push(`design-system:governance must include "${step}".`);
  }
}

const designSystemPackage = JSON.parse(
  readFileSync(designSystemPackagePath, "utf8")
);

for (const exportPath of requiredDesignSystemExports) {
  if (!designSystemPackage.exports?.[exportPath]) {
    errors.push(
      `@repo/design-system must export documented contract "${exportPath}".`
    );
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("Design system docs checks passed.");

function readStoryTitle(path) {
  const source = readFileSync(path, "utf8");
  return source.match(storyTitlePattern)?.[1];
}
