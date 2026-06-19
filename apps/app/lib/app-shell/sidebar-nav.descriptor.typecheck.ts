import type { AfendaAppSidebarNavLayoutDescriptor } from "@repo/design-system";
import { authenticatedAppSidebarNavDescriptor } from "./sidebar-nav.descriptor";
import type { AuthenticatedAppSidebarNavIconKey } from "./sidebar-nav.registry";

type AssertEqual<T, U> = [T] extends [U]
  ? [U] extends [T]
    ? true
    : never
  : never;

type IconDescriptorItem = Extract<
  AfendaAppSidebarNavLayoutDescriptor<AuthenticatedAppSidebarNavIconKey>["main"] extends infer Main
    ? Main extends { items: readonly (infer Item)[] }
      ? Item
      : never
    : never,
  { kind: "icon" }
>;

type DescriptorLiteralIconKey = Extract<
  (typeof authenticatedAppSidebarNavDescriptor)["scroll"][number]["items"][number],
  { kind: "icon" }
>["iconKey"];

type _LiteralIconKeysAreNarrowed = AssertEqual<
  DescriptorLiteralIconKey,
  | "factory"
  | "folder-kanban"
  | "handshake"
  | "id-card"
  | "landmark"
  | "package"
  | "shopping-cart"
  | "store"
  | "trending-up"
  | "user-circle"
  | "users"
  | "wallet"
>;

type _RegistryCoversDescriptorIconKeys =
  DescriptorLiteralIconKey extends AuthenticatedAppSidebarNavIconKey
    ? true
    : never;

const _literalIconKeysAreNarrowed: _LiteralIconKeysAreNarrowed = true;
const _registryCoversDescriptorIconKeys: _RegistryCoversDescriptorIconKeys = true;

void (_literalIconKeysAreNarrowed satisfies true);
void (_registryCoversDescriptorIconKeys satisfies true);
void ({} as IconDescriptorItem);
