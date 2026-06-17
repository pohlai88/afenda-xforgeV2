import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const scanRoots = [join(root, "apps"), join(root, "packages")];
const designSystemRoot = normalize(join(root, "packages", "design-system"));
const unitTestPattern = /\.test\.tsx?$/;
const integrationTestPattern = /\.integration\.test\.tsx?$/;
const sourceFilePattern = /\.tsx?$/;
const privateDesignSystemImportPattern =
  /@repo\/design-system\/components\/(?:ui|afenda-ui|blocks)(?:\/|["'])/;
const packageImportsAppPattern =
  /from\s+["'](?:apps\/|\.\.\/\.\.\/apps\/|\.\.\/\.\.\/\.\.\/apps\/)/;
const liveDatabaseImportPattern = /from\s+["']@repo\/database["']/;
const databaseMockPattern = /vi\.mock\(["']@repo\/database["']/;
const errors = [];

for (const file of walk(scanRoots)) {
  if (!sourceFilePattern.test(file)) {
    continue;
  }

  const normalized = normalize(file);
  const source = readFileSync(file, "utf8");

  if (
    !normalized.startsWith(designSystemRoot) &&
    privateDesignSystemImportPattern.test(source)
  ) {
    errors.push(
      `${relative(root, file)} imports design-system implementation modules; use @repo/design-system/design-system.`
    );
  }

  if (normalized.includes("/packages/") && packageImportsAppPattern.test(source)) {
    errors.push(
      `${relative(root, file)} imports from apps; packages must not depend on deployables.`
    );
  }

  if (
    unitTestPattern.test(file) &&
    !integrationTestPattern.test(file) &&
    liveDatabaseImportPattern.test(source) &&
    !databaseMockPattern.test(source)
  ) {
    errors.push(
      `${relative(root, file)} imports @repo/database in a unit test without a vi.mock guard.`
    );
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("Enterprise governance checks passed.");

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
        path.includes(`${join(".next")}`) ||
        path.includes(`${join(".turbo")}`)
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
