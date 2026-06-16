import { describe, expect, it } from "vitest";

import {
  defaultSidebarLink,
  resolveSidebarLinkRenderer,
} from "../components/blocks/afenda-blocks/sidebars/sidebar-link-defaults";

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
