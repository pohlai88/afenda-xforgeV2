import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  AFENDA_COMPONENT_MANIFEST,
  afendaComponentManifest,
} from "../component.manifest";
import { AFENDA_STATES } from "../contracts/afenda-state.contract";
import { AFENDA_COMPONENT_IDENTITY_REGISTRY } from "../registries/component.registry";
import { AFENDA_RECIPE_REGISTRY } from "../registries/recipe.registry";
import {
  AFENDA_SLOT_EXACT_IDENTITY_REGISTRY,
  AFENDA_SLOT_IDENTITY_PATTERN_REGISTRY,
} from "../registries/slot.registry";
import { AFENDA_VARIANT_PROPS } from "../registries/variant.registry";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const slotPatterns = AFENDA_SLOT_IDENTITY_PATTERN_REGISTRY.map(
  (pattern) => new RegExp(pattern)
);

describe("afenda component manifest", () => {
  it("contains exactly one manifest entry for every public component identity", () => {
    const manifestIds = AFENDA_COMPONENT_MANIFEST.map((entry) => entry.id);

    expect(manifestIds).toEqual(AFENDA_COMPONENT_IDENTITY_REGISTRY);
    expect(new Set(manifestIds).size).toBe(manifestIds.length);
  });

  it("references only governed slots, variants, recipes, and states", () => {
    for (const entry of AFENDA_COMPONENT_MANIFEST) {
      for (const slot of entry.slots) {
        expect(isKnownSlot(slot), `${entry.id}:${slot}`).toBe(true);
      }

      for (const variant of entry.variants) {
        expect(AFENDA_VARIANT_PROPS, `${entry.id}:${variant}`).toContain(
          variant
        );
      }

      for (const recipe of entry.recipes) {
        expect(AFENDA_RECIPE_REGISTRY, `${entry.id}:${recipe}`).toContain(
          recipe
        );
      }

      for (const state of entry.states) {
        expect(AFENDA_STATES, `${entry.id}:${state}`).toContain(state);
      }
    }
  });

  it("is JSON-serializable", () => {
    expect(JSON.parse(JSON.stringify(afendaComponentManifest))).toEqual(
      afendaComponentManifest
    );
  });

  it("does not import component source files", () => {
    const source = readFileSync(
      join(packageRoot, "component.manifest.ts"),
      "utf8"
    );

    expect(source).not.toMatch(/from\s+["'][^"']*components\//);
    expect(source).not.toMatch(/from\s+["'][^"']*components\\/);
  });
});

function isKnownSlot(slot: string): boolean {
  return (
    AFENDA_SLOT_EXACT_IDENTITY_REGISTRY.includes(
      slot as (typeof AFENDA_SLOT_EXACT_IDENTITY_REGISTRY)[number]
    ) || slotPatterns.some((pattern) => pattern.test(slot))
  );
}
