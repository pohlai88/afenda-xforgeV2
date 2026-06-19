import { describe, expectTypeOf, it } from "vitest";
import type {
  SidebarNavUserActionMenuItem,
  SidebarNavUserLinkMenuItem,
  SidebarNavUserMenuItem,
} from "../components/blocks/afenda-blocks/afenda-appshell/sidebar/sidebar-nav-user-menu.types";

describe("SidebarNavUserLinkMenuItem", () => {
  it("requires href", () => {
    const item = {
      id: "account",
      label: "Account",
      href: "/account/organization",
    } as const satisfies SidebarNavUserLinkMenuItem;

    expectTypeOf(item.href).toEqualTypeOf<"/account/organization">();
  });

  it("href is typed as string", () => {
    expectTypeOf<SidebarNavUserLinkMenuItem["href"]>().toEqualTypeOf<string>();
  });

  it("is assignable to SidebarNavUserMenuItem", () => {
    expectTypeOf<SidebarNavUserLinkMenuItem>().toMatchTypeOf<SidebarNavUserMenuItem>();
  });
});

describe("SidebarNavUserActionMenuItem", () => {
  it("rejects href via never type", () => {
    expectTypeOf<SidebarNavUserActionMenuItem["href"]>().toEqualTypeOf<
      never | undefined
    >();
  });

  it("is assignable to SidebarNavUserMenuItem", () => {
    expectTypeOf<SidebarNavUserActionMenuItem>().toMatchTypeOf<SidebarNavUserMenuItem>();
  });

  it("objects with href are not assignable to SidebarNavUserActionMenuItem", () => {
    expectTypeOf<{
      id: string;
      label: string;
      href: string;
    }>().not.toMatchTypeOf<SidebarNavUserActionMenuItem>();
  });
});

describe("SidebarNavUserMenuItem discriminated union", () => {
  it("link and action item are both members", () => {
    expectTypeOf<SidebarNavUserLinkMenuItem>().toMatchTypeOf<SidebarNavUserMenuItem>();
    expectTypeOf<SidebarNavUserActionMenuItem>().toMatchTypeOf<SidebarNavUserMenuItem>();
  });
});
