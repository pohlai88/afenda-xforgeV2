import { describe, expect, it } from "vitest";
import {
  scanDesignSystemAiDriftFindings,
  scanDesignSystemAiDriftSource,
} from "../governance/design-system-ai-drift.mjs";

const registry = {
  blockRecipeIds: new Set(["blockShell"]),
  componentIds: new Set(["Button", "PageHeader"]),
  contractVersion: "0.1.0",
  exactSlots: new Set(["button"]),
  forbiddenSemanticAliases: {
    critical: ["danger", "destructive", "error", "negative"],
    success: ["approved", "good", "positive"],
  },
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

function scanFindings(source: string) {
  return scanDesignSystemAiDriftFindings({
    path: "fixture.stories.tsx",
    registry,
    requirePublicDesignSystemImports: true,
    root: "",
    source,
  });
}

describe("AI design-system drift gate", () => {
  it("hard-fails unregistered component names", () => {
    expect(scan("<ActionCard />")).toContain("[unknown-component-name]");
  });

  it("hard-fails unregistered recipe names", () => {
    expect(scan('recipe("heroMetric")')).toContain("[unknown-recipe]");
  });

  it("hard-fails dynamic recipe ids", () => {
    expect(scan("recipe(RECIPE_ID)")).toContain("[dynamic-recipe-id]");
  });

  it("hard-fails unregistered data slots", () => {
    expect(scan('<div data-slot="hero" />')).toContain("[unknown-slot]");
  });

  it("hard-fails expression data slots that resolve to unknown slots", () => {
    expect(scan("<div data-slot={'hero'} />")).toContain("[unknown-slot]");
  });

  it("hard-fails dynamic data slots without a registered template pattern", () => {
    expect(scan("<div data-slot={slot} />")).toContain("[dynamic-slot-id]");
  });

  it("allows registered data-slot template patterns", () => {
    expect(
      scan("<div data-slot={`app-sidebar-nav-item-${item.id}`} />")
    ).not.toContain("[dynamic-slot-id]");
  });

  it("hard-fails forbidden semantic aliases", () => {
    const result = scan(
      '<Button tone="positive" variant="destructive" className="text-danger" />'
    );

    expect(result).toContain("[unregistered-semantic-alias]");
  });

  it("hard-fails forbidden semantic aliases in expression props", () => {
    const result = scan("<Button tone={'positive'} variant={'destructive'} />");

    expect(result).toContain("[unregistered-semantic-alias]");
  });

  it("hard-fails forbidden semantic aliases in static className expressions", () => {
    expect(scan('<Button className={cn("text-danger")} />')).toContain(
      "[unregistered-semantic-alias]"
    );
  });

  it("hard-fails dynamic variant values in example surfaces", () => {
    expect(scan("<Button variant={variant} />", true)).toContain(
      "[dynamic-variant-value]"
    );
  });

  it("hard-fails local vocabulary declarations", () => {
    expect(scan('const variants = ["primary", "secondary"]')).toContain(
      "[local-vocabulary-declaration]"
    );
  });

  it("hard-fails local vocabulary enum declarations", () => {
    expect(scan('enum Tone { Positive = "positive" }')).toContain(
      "[local-vocabulary-declaration]"
    );
  });

  it("allows local PascalCase component declarations", () => {
    expect(
      scan("function ActionCard() { return null; }\n<ActionCard />")
    ).not.toContain("[unknown-component-name]");
  });

  it("ignores aliased external component imports", () => {
    expect(
      scan('import { Card as ActionCard } from "external-ui";\n<ActionCard />')
    ).not.toContain("[unknown-component-name]");
  });

  it("hard-fails stale Storybook examples", () => {
    expect(scan("export const Example = { tags: ['example'] }", true)).toContain(
      "[stale-example]"
    );
  });

  it("hard-fails private design-system imports in examples", () => {
    expect(
      scan(
        'import { Button } from "@repo/design-system/components/afenda-ui/button"'
      )
    ).not.toContain("[private-import]");

    const result = scanDesignSystemAiDriftSource({
      path: "fixture.stories.tsx",
      registry,
      requirePublicDesignSystemImports: true,
      root: "",
      source:
        'import { Button } from "@repo/design-system/components/afenda-ui/button"',
    }).join("\n");

    expect(result).toContain("[private-import]");
  });

  it("returns structured scanner findings for governance tooling", () => {
    expect(scanFindings("<ActionCard />")).toEqual([
      expect.objectContaining({
        message: expect.stringContaining("<ActionCard />"),
        path: "fixture.stories.tsx",
        rule: "unknown-component-name",
        severity: "error",
      }),
    ]);
  });
});
