import { describe, expect, it } from "vitest";
import {
  createOrbitCaseSchema,
  orbitCaseStatusSchema,
  updateOrbitCaseSchema,
} from "../contract/orbit-case.schema";

describe("createOrbitCaseSchema", () => {
  it("accepts minimal title", () => {
    const parsed = createOrbitCaseSchema.parse({ title: "Call supplier" });
    expect(parsed.title).toBe("Call supplier");
    expect(parsed.status).toBe("backlog");
    expect(parsed.priority).toBe("none");
  });

  it("rejects empty title", () => {
    expect(() => createOrbitCaseSchema.parse({ title: "   " })).toThrow();
  });
});

describe("updateOrbitCaseSchema", () => {
  it("requires caseId", () => {
    expect(() => updateOrbitCaseSchema.parse({ title: "Updated" })).toThrow();
  });

  it("accepts status transition", () => {
    const parsed = updateOrbitCaseSchema.parse({
      caseId: "case_1",
      status: "doing",
    });
    expect(parsed.status).toBe("doing");
  });
});

describe("orbitCaseStatusSchema", () => {
  it("includes kanban columns and cancelled", () => {
    for (const status of [
      "backlog",
      "ready",
      "doing",
      "waiting",
      "done",
      "cancelled",
    ]) {
      expect(orbitCaseStatusSchema.parse(status)).toBe(status);
    }
  });
});
