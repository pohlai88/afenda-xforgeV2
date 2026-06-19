import { describe, expect, it } from "vitest";
import { formatOrbitCaseActivitySummary } from "../contract/activity-format";
import {
  listBudgetRequestsFilterSchema,
  updateBudgetRequestSchema,
  updateMorphLifecycleRequestSchema,
} from "../contract/morph-lifecycle-update.schema";
import {
  ORBIT_MORPH_DEFAULT_STATUS,
  ORBIT_MORPH_STATUSES,
  orbitMorphStatusSchema,
  parseOrbitMorphStatus,
} from "../contract/morph-status";

describe("orbitMorphStatusSchema", () => {
  it("accepts Phase 5 morph statuses", () => {
    for (const status of ORBIT_MORPH_STATUSES) {
      expect(orbitMorphStatusSchema.parse(status)).toBe(status);
    }
  });

  it("defaults new budget rows to submitted", () => {
    expect(ORBIT_MORPH_DEFAULT_STATUS).toBe("submitted");
  });
});

describe("parseOrbitMorphStatus", () => {
  it("returns null for invalid values", () => {
    expect(parseOrbitMorphStatus("draft")).toBeNull();
  });
});

describe("updateMorphLifecycleRequestSchema", () => {
  it("accepts unified lifecycle patches for any segment", () => {
    const parsed = updateMorphLifecycleRequestSchema.parse({
      assigneeId: "user_1",
      requestId: "budget_1",
      segment: "lead",
      status: "approved",
      title: "Qualified lead",
      values: {
        company: "Acme",
        contact: "Jane",
      },
    });

    expect(parsed.segment).toBe("lead");
    expect(parsed.values?.company).toBe("Acme");
  });
});

describe("updateBudgetRequestSchema", () => {
  it("accepts unified lifecycle patches for budget segment", () => {
    const parsed = updateBudgetRequestSchema.parse({
      assigneeId: "user_1",
      requestId: "budget_1",
      segment: "budget",
      status: "in_review",
      title: "Production line",
      values: {
        amount: "RM50000",
      },
    });

    expect(parsed.status).toBe("in_review");
    expect(parsed.segment).toBe("budget");
  });
});

describe("listBudgetRequestsFilterSchema", () => {
  it("accepts status and assignee filters", () => {
    const parsed = listBudgetRequestsFilterSchema.parse({
      status: "approved",
      assigneeId: "user_1",
    });

    expect(parsed.status).toBe("approved");
  });
});

describe("formatOrbitCaseActivitySummary", () => {
  it("summarizes budget morph status changes", () => {
    expect(
      formatOrbitCaseActivitySummary("morph.budget.updated", {
        status: "approved",
      })
    ).toBe("Budget request status changed to approved");
  });

  it("summarizes approval morph status changes", () => {
    expect(
      formatOrbitCaseActivitySummary("morph.approval.updated", {
        status: "in_review",
      })
    ).toBe("Approval request status changed to in_review");
  });
});
