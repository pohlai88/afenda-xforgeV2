import { describe, expect, it } from "vitest";
import {
  ORBIT_BUDGET_REQUEST_TARGET_TYPE,
  toOrbitObjectLinkProjectionDto,
} from "../contract/link-projection";
import type { OrbitObjectLinkDto } from "../contract/orbit-case.types";

const baseLink = (
  overrides: Partial<OrbitObjectLinkDto> = {}
): OrbitObjectLinkDto => ({
  createdAt: "2026-06-17T00:00:00.000Z",
  id: "link_1",
  organizationId: "org_1",
  originCaseId: "case_1",
  payload: {
    destinationLabel: "Budget Request",
  },
  pushEventId: "push_1",
  targetId: "budget_1",
  targetType: ORBIT_BUDGET_REQUEST_TARGET_TYPE,
  ...overrides,
});

describe("toOrbitObjectLinkProjectionDto", () => {
  it("projects budget links with href and label", () => {
    expect(toOrbitObjectLinkProjectionDto(baseLink())).toEqual({
      createdAt: "2026-06-17T00:00:00.000Z",
      href: "/orbit-case/budget/budget_1",
      id: "link_1",
      label: "Budget Request",
      targetId: "budget_1",
      targetType: ORBIT_BUDGET_REQUEST_TARGET_TYPE,
    });
  });

  it("falls back to target type when destination label is missing", () => {
    expect(
      toOrbitObjectLinkProjectionDto(
        baseLink({
          payload: {},
          targetType: "custom-target",
        })
      ).label
    ).toBe("custom-target");
  });
});
