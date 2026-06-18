import { describe, expect, it } from "vitest";
import {
  getOrbitCaseBudgetCacheTags,
  getOrbitCaseCacheTags,
  getOrbitCaseMorphCacheTags,
  orbitCaseBoardTag,
  orbitCaseBudgetListTag,
  orbitCaseDetailTag,
  orbitCaseListTag,
  orbitCaseMorphListTag,
} from "../revalidate";

describe("orbit case cache tags", () => {
  it("builds org-scoped list and board tags", () => {
    expect(getOrbitCaseCacheTags({ organizationId: "org_1" })).toEqual([
      "orbit-case:all",
      orbitCaseListTag("org_1"),
      orbitCaseBoardTag("org_1"),
    ]);
  });

  it("includes detail tag when caseId is provided", () => {
    expect(
      getOrbitCaseCacheTags({ organizationId: "org_1", caseId: "case_1" })
    ).toContain(orbitCaseDetailTag("case_1"));
  });

  it("builds org-scoped budget list tags", () => {
    expect(getOrbitCaseBudgetCacheTags("org_1")).toEqual([
      "orbit-case:all",
      orbitCaseBudgetListTag("org_1"),
    ]);
  });

  it("builds generic morph list tags by segment", () => {
    expect(orbitCaseMorphListTag("meeting", "org_1")).toBe(
      "orbit-case:meeting-list:org_1"
    );
    expect(getOrbitCaseMorphCacheTags("meeting", "org_1")).toEqual([
      "orbit-case:all",
      "orbit-case:meeting-list:org_1",
    ]);
  });
});
