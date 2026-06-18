import { describe, expect, it } from "vitest";

import {
  defaultSidebarLink,
  resolveSidebarLinkRenderer,
} from "../components/blocks/afenda-blocks/shadcn-dashboard-01/sidebar-link";

describe("resolveSidebarLinkRenderer", () => {
  it("returns the first provided renderer", () => {
    const customRenderer = () => null;

    expect(resolveSidebarLinkRenderer(undefined, customRenderer)).toBe(
      customRenderer
    );
  });

  it("falls back to defaultSidebarLink", () => {
    expect(resolveSidebarLinkRenderer(undefined)).toBe(defaultSidebarLink);
  });
});
