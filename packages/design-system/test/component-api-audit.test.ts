import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  auditAfendaUiComponentApi,
  createComponentApiAuditRegistry,
} from "../governance/component-api-audit.mjs";

const registry = {
  colors: new Set([
    "primary",
    "secondary",
    "tertiary",
    "info",
    "success",
    "warning",
    "critical",
  ]),
  densities: new Set(["compact", "default", "comfortable"]),
  sizes: new Set(["xs", "sm", "md", "lg", "xl", "default", "icon-sm"]),
  tones: new Set(["neutral", "info", "success", "warning", "critical"]),
  variants: new Set(["primary", "secondary", "quiet", "critical", "link"]),
};

function audit(source: string) {
  return auditAfendaUiComponentApi({
    path: "fixture.tsx",
    registry,
    root: "",
    source,
  })
    .map((finding) => `[${finding.rule}] ${finding.message}`)
    .join("\n");
}

describe("component API audit", () => {
  it("hard-fails brand as a public tone", () => {
    expect(
      audit(
        'export function Demo() { return <Progress data-slot="progress" tone="brand" />; } recipe("bodyText");'
      )
    ).toContain("[ungoverned-component-api]");
  });

  it("hard-fails text hierarchy values exposed as tone", () => {
    expect(
      audit(
        'export function Demo() { return <Text data-slot="text" tone="primary" />; } recipe("bodyText");'
      )
    ).toContain("[ungoverned-component-api]");
  });

  it("hard-fails unregistered color values", () => {
    expect(
      audit(
        'export function Demo() { return <Text color="accent" data-slot="text" />; } recipe("bodyText");'
      )
    ).toContain("[ungoverned-component-api]");
  });

  it("hard-fails exported wrappers without data-slot", () => {
    expect(
      audit('export function Demo() { recipe("bodyText"); return <div />; }')
    ).toContain("[missing-data-slot]");
  });

  it("hard-fails one exported wrapper without data-slot even when another wrapper has one", () => {
    expect(
      audit(`
        export function Demo() { recipe("bodyText"); return <div data-slot="demo" />; }
        export function DemoPanel() { recipe("bodyText"); return <section />; }
      `)
    ).toContain("DemoPanel");
  });

  it("hard-fails exported public prop type unions with ungoverned vocabulary", () => {
    expect(
      audit(`
        export type DemoProps = {
          tone?: "brand" | "critical";
        };
        export function Demo() { recipe("bodyText"); return <div data-slot="demo" />; }
      `)
    ).toContain("[ungoverned-component-api]");
  });

  it("hard-fails local vocabulary arrays and enums", () => {
    const result = audit(`
      const colors = ["primary", "secondary"];
      const variants = ["primary", "secondary"];
      enum Tone { Primary = "primary" }
      export function Demo() { recipe("bodyText"); return <div data-slot="demo" />; }
    `);

    expect(result).toContain("[local-vocabulary-declaration]");
  });

  it("passes registered structural and action variants", () => {
    expect(
      audit(
        'export function Demo() { recipe("bodyText"); return <Button color="secondary" data-slot="button" size="icon-sm" variant="primary" />; }'
      )
    ).toBe("");
  });

  it("keeps Toaster slotted and recipe-backed", () => {
    const root = join(process.cwd(), "..", "..");
    const path = join(
      root,
      "packages",
      "design-system",
      "components",
      "afenda-ui",
      "sonner.tsx"
    );

    expect(
      auditAfendaUiComponentApi({
        path,
        registry: createComponentApiAuditRegistry(root),
        root,
        source: readFileSync(path, "utf8"),
      })
    ).toEqual([]);
  });
});
