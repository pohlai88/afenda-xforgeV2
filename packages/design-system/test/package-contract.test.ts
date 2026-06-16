import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const packagePath = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "package.json"
);
const packageJson = JSON.parse(readFileSync(packagePath, "utf8")) as {
  readonly dependencies?: Record<string, string>;
  readonly exports?: Record<string, string>;
};
const dependencies = packageJson.dependencies ?? {};

describe("design-system package contract", () => {
  it("keeps app-owned and unused heavy dependencies out of design-system", () => {
    for (const dependency of appOwnedOrUnusedDependencies) {
      expect(dependencies, dependency).not.toHaveProperty(dependency);
    }
  });

  it("keeps intentionally package-owned runtime dependencies declared", () => {
    for (const dependency of requiredRuntimeDependencies) {
      expect(dependencies, dependency).toHaveProperty(dependency);
    }
  });

  it("keeps stable public package exports available", () => {
    for (const exportPath of stablePackageExports) {
      expect(packageJson.exports, exportPath).toHaveProperty(exportPath);
    }
  });

  it("does not document implementation layers as stable package exports", () => {
    for (const exportPath of implementationLayerExports) {
      expect(stablePackageExports, exportPath).not.toContain(exportPath);
    }
  });
});

const appOwnedOrUnusedDependencies = [
  "@hookform/resolvers",
  "@monaco-editor/react",
  "@tanstack/react-query",
  "axios",
  "common-tags",
  "date-fns",
  "openai",
  "openapi-fetch",
  "react-markdown",
  "react-moveable",
  "server-only",
] as const;

const requiredRuntimeDependencies = [
  "@tanstack/react-table",
  "react-day-picker",
  "recharts",
  "tw-animate-css",
] as const;

const stablePackageExports = [
  ".",
  "./design-system",
  "./contracts/afenda-design-system",
  "./contracts/afenda-token",
  "./contracts/afenda-accessibility",
  "./contracts/afenda-class-name-policy",
  "./contracts/afenda-component",
  "./contracts/afenda-example",
  "./contracts/afenda-export",
  "./contracts/afenda-motion",
  "./contracts/afenda-recipe",
  "./contracts/afenda-slot",
  "./contracts/afenda-state",
  "./contracts/afenda-variant",
  "./lib/fonts",
  "./lib/utils",
  "./postcss.config.mjs",
  "./styles/globals.css",
  "./tokens/token-usage.policy",
  "./tokens/tokens.json",
] as const;

const implementationLayerExports = [
  "./components/afenda-ui",
  "./components/afenda-ui/*",
  "./components/blocks",
  "./components/blocks/*",
  "./components/mode-toggle",
] as const;
