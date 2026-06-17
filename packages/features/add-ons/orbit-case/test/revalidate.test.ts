import { describe, expect, it } from "vitest";
import {
  getOrbitCaseCacheTags,
  orbitCaseBoardTag,
  orbitCaseDetailTag,
  orbitCaseListTag,
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
});
