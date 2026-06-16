import { describe, expect, it } from "vitest";

import {
  resolveEffectiveSidebarOpen,
  resolveInitialSidebarOpen,
} from "../components/afenda-ui/sidebar-behavior";

describe("resolveInitialSidebarOpen", () => {
  it("opens the rail for expanded mode", () => {
    expect(resolveInitialSidebarOpen("expanded", false)).toBe(true);
  });

  it("collapses the rail for icon and hover modes", () => {
    expect(resolveInitialSidebarOpen("icon", true)).toBe(false);
    expect(resolveInitialSidebarOpen("hover", true)).toBe(false);
  });
});

describe("resolveEffectiveSidebarOpen", () => {
  it("keeps expanded mode pinned open", () => {
    expect(
      resolveEffectiveSidebarOpen({
        behaviorMode: "expanded",
        hoverPeek: false,
        open: false,
      })
    ).toBe(true);
  });

  it("uses hover peek state in hover mode", () => {
    expect(
      resolveEffectiveSidebarOpen({
        behaviorMode: "hover",
        hoverPeek: true,
        open: false,
      })
    ).toBe(true);
    expect(
      resolveEffectiveSidebarOpen({
        behaviorMode: "hover",
        hoverPeek: false,
        open: true,
      })
    ).toBe(false);
  });

  it("uses open state in icon mode", () => {
    expect(
      resolveEffectiveSidebarOpen({
        behaviorMode: "icon",
        hoverPeek: false,
        open: true,
      })
    ).toBe(false);
    expect(
      resolveEffectiveSidebarOpen({
        behaviorMode: "icon",
        hoverPeek: true,
        open: false,
      })
    ).toBe(false);
  });
});
