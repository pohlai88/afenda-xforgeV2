import { describe, expect, it } from "vitest";

import { DEFAULT_CONTENT_LAYOUT_INSETS } from "../components/blocks/afenda-blocks/content-layout/content-layout-constants";
import {
  getContentLayoutBodyGridClassName,
  resolveContentLayoutInsetStyle,
} from "../components/blocks/afenda-blocks/content-layout/content-layout-helpers";

describe("content layout helpers", () => {
  describe("getContentLayoutBodyGridClassName", () => {
    it("returns single column when no sidebars", () => {
      expect(
        getContentLayoutBodyGridClassName({
          hasLeftSidebar: false,
          hasRightSidebar: false,
        })
      ).toBe("grid-cols-1");
    });

    it("returns left + main when only left sidebar", () => {
      expect(
        getContentLayoutBodyGridClassName({
          hasLeftSidebar: true,
          hasRightSidebar: false,
        })
      ).toBe("grid-cols-[auto_minmax(0,1fr)]");
    });

    it("returns main + right when only right sidebar", () => {
      expect(
        getContentLayoutBodyGridClassName({
          hasLeftSidebar: false,
          hasRightSidebar: true,
        })
      ).toBe("grid-cols-[minmax(0,1fr)_auto]");
    });

    it("returns three columns when both sidebars", () => {
      expect(
        getContentLayoutBodyGridClassName({
          hasLeftSidebar: true,
          hasRightSidebar: true,
        })
      ).toBe("grid-cols-[auto_minmax(0,1fr)_auto]");
    });
  });

  describe("resolveContentLayoutInsetStyle", () => {
    it("returns geometry style when provided", () => {
      const geometryStyle = {
        height: "400px",
        left: "12px",
        top: "8px",
        width: "640px",
      };

      expect(resolveContentLayoutInsetStyle(geometryStyle)).toEqual(
        geometryStyle
      );
    });

    it("falls back to default insets when geometry is undefined", () => {
      expect(resolveContentLayoutInsetStyle(undefined)).toEqual(
        DEFAULT_CONTENT_LAYOUT_INSETS
      );
    });

    it("merges partial inset overrides with defaults", () => {
      expect(
        resolveContentLayoutInsetStyle(undefined, { top: "1rem", left: "2rem" })
      ).toEqual({
        ...DEFAULT_CONTENT_LAYOUT_INSETS,
        top: "1rem",
        left: "2rem",
      });
    });
  });
});
