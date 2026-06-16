import { describe, expect, it } from "vitest";

import {
  contentLayoutSidebarAriaLabel,
  contentLayoutSidebarToggleAriaLabel,
} from "../components/blocks/afenda-blocks/content-layout/content-layout-constants";
import { applyContentLayoutResize } from "../components/blocks/afenda-blocks/content-layout/content-layout-helpers";

describe("content layout resize helpers", () => {
  const start = { height: 400, width: 640, x: 16, y: 12 };

  it("expands width from the right edge", () => {
    expect(
      applyContentLayoutResize("resize-right", start, 40, 0, 320, 240, 800, 600)
    ).toEqual({
      ...start,
      width: 680,
    });
  });

  it("shrinks width from the left edge while preserving the right edge", () => {
    expect(
      applyContentLayoutResize("resize-left", start, 40, 0, 320, 240, 800, 600)
    ).toEqual({
      height: 400,
      width: 600,
      x: 56,
      y: 12,
    });
  });

  it("expands height from the bottom edge", () => {
    expect(
      applyContentLayoutResize("resize-bottom", start, 0, 24, 320, 240, 800, 600)
    ).toEqual({
      ...start,
      height: 424,
    });
  });

  it("shrinks height from the top edge while preserving the bottom edge", () => {
    expect(
      applyContentLayoutResize("resize-top", start, 0, 20, 320, 240, 800, 600)
    ).toEqual({
      height: 380,
      width: 640,
      x: 16,
      y: 32,
    });
  });
});

describe("content layout aria helpers", () => {
  it("uses override sidebar labels when provided", () => {
    expect(contentLayoutSidebarAriaLabel("left", "Navigation")).toBe(
      "Navigation"
    );
  });

  it("builds default sidebar toggle labels", () => {
    expect(contentLayoutSidebarToggleAriaLabel("right", true)).toBe(
      "Expand right sidebar"
    );
    expect(contentLayoutSidebarToggleAriaLabel("right", false)).toBe(
      "Collapse right sidebar"
    );
  });
});
