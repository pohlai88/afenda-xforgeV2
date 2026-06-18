import { describe, expect, it } from "vitest";
import {
  ORBIT_APPROVAL_REQUEST_TARGET_TYPE,
  ORBIT_BUDGET_REQUEST_TARGET_TYPE,
  ORBIT_MEETING_REQUEST_TARGET_TYPE,
} from "../contract/morph-target-types";
import { resolveOrbitMorphLinkHref } from "../contract/link-projection-registry";
import { toOrbitObjectLinkProjectionDto } from "../contract/serialize";
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

  it("returns null href for unregistered morph target types", () => {
    expect(resolveOrbitMorphLinkHref("custom-target", "target_1")).toBeNull();
    expect(
      toOrbitObjectLinkProjectionDto(
        baseLink({
          targetType: "custom-target",
        })
      ).href
    ).toBeNull();
  });

  it("projects meeting links with href and label", () => {
    expect(
      toOrbitObjectLinkProjectionDto(
        baseLink({
          payload: { destinationLabel: "Meeting Request" },
          targetId: "meeting_1",
          targetType: ORBIT_MEETING_REQUEST_TARGET_TYPE,
        })
      )
    ).toEqual({
      createdAt: "2026-06-17T00:00:00.000Z",
      href: "/orbit-case/meeting/meeting_1",
      id: "link_1",
      label: "Meeting Request",
      targetId: "meeting_1",
      targetType: ORBIT_MEETING_REQUEST_TARGET_TYPE,
    });
  });

  it("projects approval links with href and label", () => {
    expect(
      toOrbitObjectLinkProjectionDto(
        baseLink({
          payload: { destinationLabel: "Approval Request" },
          targetId: "approval_1",
          targetType: ORBIT_APPROVAL_REQUEST_TARGET_TYPE,
        })
      )
    ).toEqual({
      createdAt: "2026-06-17T00:00:00.000Z",
      href: "/orbit-case/approval/approval_1",
      id: "link_1",
      label: "Approval Request",
      targetId: "approval_1",
      targetType: ORBIT_APPROVAL_REQUEST_TARGET_TYPE,
    });
  });

  it("returns null href for unknown morph target types", () => {
    expect(resolveOrbitMorphLinkHref("unknown-request", "target_1")).toBeNull();
    expect(
      toOrbitObjectLinkProjectionDto(
        baseLink({
          payload: { destinationLabel: "Purchase" },
          targetId: "purchase_1",
          targetType: "unknown-request",
        })
      ).href
    ).toBeNull();
  });
});
