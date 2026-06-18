import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import tokens from "../tokens/tokens.json";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

function toCssTokenSegment(key: string): string {
  return key.replace(/([A-Z])/g, "-$1").toLowerCase();
}

function colorCssVar(key: keyof typeof tokens.color): string {
  return `--xforge-color-${toCssTokenSegment(key)}`;
}

describe("token css sync", () => {
  it("declares core xforge primitives from tokens.json in globals.css", () => {
    const globalsCss = readFileSync(
      join(packageRoot, "styles/globals.css"),
      "utf8"
    );

    const spotCheckColorKeys = [
      "brandPrimary",
      "ink",
      "muted",
      "raised",
      "surface",
    ] as const satisfies ReadonlyArray<keyof typeof tokens.color>;

    for (const key of spotCheckColorKeys) {
      const cssVar = colorCssVar(key);
      const tokenValue = tokens.color[key].toLowerCase();
      expect(globalsCss, cssVar).toContain(cssVar);
      expect(globalsCss, `${cssVar} value`).toContain(tokenValue);
    }

    for (const cssVar of [
      "--xforge-radius-lg",
      "--xforge-space-5",
      "--xforge-font-title-size",
    ]) {
      expect(globalsCss, cssVar).toContain(cssVar);
    }
  });

  it("keeps semantic aliases and component tokens wired to xforge primitives", () => {
    const globalsCss = readFileSync(
      join(packageRoot, "styles/globals.css"),
      "utf8"
    );

    expect(globalsCss).toMatch(/--text-primary:\s*var\(--xforge-color-ink\)/);
    expect(globalsCss).toMatch(
      /--text-secondary:\s*var\(--xforge-color-muted\)/
    );
    expect(globalsCss).toMatch(
      /--card-radius:\s*var\(--xforge-radius-lg\)/
    );
    expect(globalsCss).toMatch(
      /--card-padding:\s*var\(--xforge-space-5\)/
    );
    expect(globalsCss).toContain("--title-text-size");
  });
});
