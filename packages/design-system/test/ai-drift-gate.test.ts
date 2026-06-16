import { describe, expect, it } from "vitest";
import { scanDesignSystemAiDriftSource } from "../../../scripts/lib/design-system-ai-drift.mjs";

const registry = {
  blockRecipeIds: new Set(["blockShell"]),
  componentIds: new Set(["Button", "PageHeader"]),
  contractVersion: "0.1.0",
  exactSlots: new Set(["button"]),
  recipeIds: new Set(["bodyText"]),
  slotPatterns: [/^[a-z][a-z0-9]*(?:-[a-z0-9]+)+$/],
  tones: new Set(["neutral", "info", "success", "warning", "critical"]),
  variants: new Set(["primary", "secondary", "quiet", "critical", "link"]),
};

function scan(source: string, requireExampleVersion = false) {
  return scanDesignSystemAiDriftSource({
    path: "fixture.stories.tsx",
    registry,
    root: "",
    source,
    requireExampleVersion,
  }).join("\n");
}

describe("AI design-system drift gate", () => {
  it("hard-fails unregistered component names", () => {
    expect(scan("<ActionCard />")).toContain("[unknown-component-name]");
  });

  it("hard-fails unregistered recipe names", () => {
    expect(scan('recipe("heroMetric")')).toContain("[unknown-recipe]");
  });

  it("hard-fails unregistered data slots", () => {
    expect(scan('<div data-slot="hero" />')).toContain("[unknown-slot]");
  });

  it("hard-fails forbidden semantic aliases", () => {
    const result = scan(
      '<Button tone="positive" variant="destructive" className="text-danger" />'
    );

    expect(result).toContain("[unregistered-semantic-alias]");
  });

  it("hard-fails local vocabulary declarations", () => {
    expect(scan('const variants = ["primary", "secondary"]')).toContain(
      "[local-vocabulary-declaration]"
    );
  });

  it("hard-fails stale Storybook examples", () => {
    expect(scan("export const Example = { tags: ['example'] }", true)).toContain(
      "[stale-example]"
    );
  });
});
