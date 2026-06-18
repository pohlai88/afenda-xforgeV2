import { describe, expect, it } from "vitest";
import { ORBIT_MORPH_DESTINATION_MANIFEST } from "../contract/morph-destination-manifest";
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
  targetId: "target_1",
  targetType: "budget-request",
  ...overrides,
});

const routedMorphSlices = ORBIT_MORPH_DESTINATION_MANIFEST.filter(
  (slice) => slice.hasAppRoute
);

describe("toOrbitObjectLinkProjectionDto", () => {
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

  for (const slice of routedMorphSlices) {
    it(`projects ${slice.label} links with href and label`, () => {
      expect(
        toOrbitObjectLinkProjectionDto(
          baseLink({
            payload: { destinationLabel: slice.label },
            targetId: "target_1",
            targetType: slice.targetType,
          })
        )
      ).toEqual({
        createdAt: "2026-06-17T00:00:00.000Z",
        href: `/orbit-case/${slice.segment}/target_1`,
        id: "link_1",
        label: slice.label,
        targetId: "target_1",
        targetType: slice.targetType,
      });

      expect(resolveOrbitMorphLinkHref(slice.targetType, "target_1")).toBe(
        `/orbit-case/${slice.segment}/target_1`
      );
    });
  }
});
