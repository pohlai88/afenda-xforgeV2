import { describe, expectTypeOf, it } from "vitest";
import type {
  AfendaAppSidebarNavIconDescriptor,
  AfendaAppSidebarNavIconKeysOf,
  AfendaAppSidebarNavLayoutDescriptor,
} from "../components/blocks/afenda-blocks/afenda-appshell/sidebar/sidebar-nav-descriptors";

const typedIconRegistry = {
  settings: () => null,
  shield: () => null,
} as const;

type RegistryIconKeys = AfendaAppSidebarNavIconKeysOf<typeof typedIconRegistry>;

describe("AfendaAppSidebarNavIconKeysOf", () => {
  it("extracts literal string keys from a registry object", () => {
    expectTypeOf<RegistryIconKeys>().toEqualTypeOf<"settings" | "shield">();
  });

  it("is a subtype of string", () => {
    expectTypeOf<RegistryIconKeys>().toMatchTypeOf<string>();
  });

  it("does not include non-registry keys", () => {
    expectTypeOf<RegistryIconKeys>().not.toEqualTypeOf<string>();
  });
});

describe("AfendaAppSidebarNavIconDescriptor", () => {
  it("constrains iconKey to the registry key union", () => {
    type SettingsIconDescriptor = AfendaAppSidebarNavIconDescriptor<"settings">;
    expectTypeOf<
      SettingsIconDescriptor["iconKey"]
    >().toEqualTypeOf<"settings">();
  });

  it("accepts valid registry keys as iconKey", () => {
    const descriptor = {
      id: "home",
      kind: "icon" as const,
      label: "Home",
      href: "/home",
      iconKey: "settings" as const,
    } satisfies AfendaAppSidebarNavIconDescriptor<RegistryIconKeys>;

    expectTypeOf(descriptor.iconKey).toEqualTypeOf<"settings">();
  });
});

describe("AfendaAppSidebarNavLayoutDescriptor", () => {
  it("is parameterized by the icon key union", () => {
    type Desc = AfendaAppSidebarNavLayoutDescriptor<"settings" | "shield">;
    type MainGroup = NonNullable<Desc["main"]>;
    type ItemDescriptor = MainGroup["items"][number];
    type IconItemDescriptor = Extract<ItemDescriptor, { kind: "icon" }>;

    expectTypeOf<IconItemDescriptor["iconKey"]>().toEqualTypeOf<
      "settings" | "shield"
    >();
  });

  it("all fields are optional at the layout level", () => {
    const empty: AfendaAppSidebarNavLayoutDescriptor<string> = {};
    expectTypeOf(empty).toMatchTypeOf<{
      main?: unknown;
      footer?: unknown;
      scroll?: unknown;
    }>();
  });
});
