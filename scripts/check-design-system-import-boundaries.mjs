import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const restrictedImportPattern =
  /@repo\/design-system\/components\/ui(?:\/|["'])/;

const designSystemRoot = normalize(
  join(root, "packages", "design-system")
);
const primitiveReadinessStory = normalize(
  join(root, "apps", "storybook", "stories", "primitive-readiness.stories.tsx")
);

const scanRoots = [join(root, "apps"), join(root, "packages")];
const errors = [];

for (const file of walk(scanRoots)) {
  if (!/\.(ts|tsx)$/.test(file)) {
    continue;
  }

  const normalized = normalize(file);

  if (normalized.startsWith(designSystemRoot)) {
    continue;
  }

  if (isPrimitiveStorybookStory(normalized)) {
    continue;
  }

  const source = readFileSync(file, "utf8");
  if (!restrictedImportPattern.test(source)) {
    continue;
  }

  const lines = source.split(/\r?\n/);
  for (const [index, line] of lines.entries()) {
    if (restrictedImportPattern.test(line)) {
      errors.push(
        `${relative(root, file)}:${index + 1} imports components/ui — use components/afenda-ui or components/blocks instead.`
      );
    }
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("Design system import boundary checks passed.");

function isPrimitiveStorybookStory(filePath) {
  return filePath === primitiveReadinessStory;
}

function normalize(value) {
  return value.replace(/\\/g, "/").toLowerCase();
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
