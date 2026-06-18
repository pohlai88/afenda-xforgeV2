import type {
  AfendaAppSidebarNavIconKeysOf,
  AfendaAppSidebarNavLayoutDescriptor,
} from "./sidebar-nav-descriptors";

type AssertEqual<T, U> = [T] extends [U]
  ? [U] extends [T]
    ? true
    : never
  : never;

const typedIconRegistry = {
  settings: () => null,
  shield: () => null,
} as const;

type RegistryIconKeys = AfendaAppSidebarNavIconKeysOf<typeof typedIconRegistry>;
type _RegistryKeysAreLiteral = AssertEqual<
  RegistryIconKeys,
  "settings" | "shield"
>;
const _registryKeysAreLiteral: _RegistryKeysAreLiteral = true;

const invalidIconKeyDescriptor: AfendaAppSidebarNavLayoutDescriptor<"settings"> =
  {
    main: {
      groupSlot: "app-sidebar-main-nav",
      label: "Main",
      items: [
        {
          id: "bad",
          kind: "icon",
          label: "Bad",
          href: "/bad",
          // @ts-expect-error iconKey must be a registry key
          iconKey: "missing-key",
        },
      ],
    },
  };

void _registryKeysAreLiteral;
void invalidIconKeyDescriptor;
