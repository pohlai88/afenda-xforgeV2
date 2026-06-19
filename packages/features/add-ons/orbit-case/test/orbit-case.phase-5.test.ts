import { describe, expect, it } from "vitest";
import { buildOrbitCasePushedEvent } from "../contract/events";
import { toOrbitMorphTargetSummaryFromDto } from "../contract/morph-target-summary-mapper";
import type { OrbitMorphLifecycleRequestDto } from "../contract/morph-lifecycle.types";

describe("Phase 5 ERP handoff contracts", () => {
  it("builds morph target summary from lifecycle dto", () => {
    const dto: OrbitMorphLifecycleRequestDto = {
      assigneeId: null,
      createdAt: "2026-06-19T12:00:00.000Z",
      id: "budget_1",
      originCaseId: "case_1",
      status: "submitted",
      title: "Pilot budget",
      updatedAt: "2026-06-19T12:00:00.000Z",
      values: {
        amount: "1200",
        costCenter: "CC-42",
        currency: "USD",
        externalRefId: "erp-budget-99",
        justification: "Q3 tooling",
      },
    };

    const summary = toOrbitMorphTargetSummaryFromDto(
      "budget",
      "budget-request",
      dto
    );

    expect(summary).toEqual({
      externalRefId: "erp-budget-99",
      segment: "budget",
      status: "submitted",
      targetId: "budget_1",
      targetType: "budget-request",
      title: "Pilot budget",
      values: dto.values,
    });
  });

  it("accepts optional morphTarget on pushed webhook event", () => {
    const event = buildOrbitCasePushedEvent({
      caseId: "case_1",
      destinationId: "budget-request",
      morphTarget: {
        segment: "budget",
        status: "submitted",
        targetId: "budget_1",
        targetType: "budget-request",
        title: "Pilot budget",
        values: { amount: "1200" },
      },
      pushEventId: "push_1",
      targetId: "budget_1",
      targetType: "budget-request",
    });

    expect(event.morphTarget?.values.amount).toBe("1200");
  });
});
