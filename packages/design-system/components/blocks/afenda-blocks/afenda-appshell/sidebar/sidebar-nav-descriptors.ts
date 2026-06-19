import type {
  AfendaAppSidebarNavGroup,
  AfendaAppSidebarNavGroupSlot,
  AfendaAppSidebarNavLayout,
  AppSidebarNavIcon,
  AppSidebarNavItem,
} from "./sidebar-nav-types";

/** Serializable nav item fields shared by product and icon descriptors. */
export interface AfendaAppSidebarNavItemDescriptorBase {
  readonly description?: string;
  readonly href: string;
  readonly id: string;
  readonly label: string;
}

/** Boundary-safe product nav item (image URL only). */
export interface AfendaAppSidebarNavProductDescriptor
  extends AfendaAppSidebarNavItemDescriptorBase {
  readonly iconSrc: string;
  readonly kind: "product";
}

/** Boundary-safe icon nav item (icon resolved client-side via registry key). */
export interface AfendaAppSidebarNavIconDescriptor<
  IconKey extends string = string,
> extends AfendaAppSidebarNavItemDescriptorBase {
  readonly iconKey: IconKey;
  readonly kind: "icon";
}

export type AfendaAppSidebarNavItemDescriptor<IconKey extends string = string> =
  | AfendaAppSidebarNavProductDescriptor
  | AfendaAppSidebarNavIconDescriptor<IconKey>;

export interface AfendaAppSidebarNavGroupDescriptor<
  IconKey extends string = string,
> {
  readonly groupSlot: AfendaAppSidebarNavGroupSlot;
  readonly items: readonly AfendaAppSidebarNavItemDescriptor<IconKey>[];
  readonly label: string;
}

export interface AfendaAppSidebarNavLayoutDescriptor<
  IconKey extends string = string,
> {
  readonly footer?: AfendaAppSidebarNavGroupDescriptor<IconKey>;
  readonly main?: AfendaAppSidebarNavGroupDescriptor<IconKey>;
  readonly scroll?: readonly AfendaAppSidebarNavGroupDescriptor<IconKey>[];
}

/** Client-side map from descriptor `iconKey` to a Lucide (or compatible) icon component. */
export type AfendaAppSidebarNavIconRegistry<IconKey extends string = string> =
  Readonly<Record<IconKey, AppSidebarNavIcon>>;

/** Infer the icon-key union from a concrete registry object (literal keys preserved via `satisfies`). */
export type AfendaAppSidebarNavIconKeysOf<
  Registry extends Record<string, unknown>,
> = keyof Registry & string;

interface SidebarNavMatchDescriptor {
  readonly href: string;
  readonly id: string;
}

function resolveNavIconDescriptor<IconKey extends string>(
  item: AfendaAppSidebarNavIconDescriptor<IconKey>,
  iconRegistry: AfendaAppSidebarNavIconRegistry<IconKey>
): AppSidebarNavItem {
  const icon = iconRegistry[item.iconKey];

  if (!icon) {
    throw new Error(
      `Unknown sidebar nav icon key "${item.iconKey}" for item "${item.id}".`
    );
  }

  return {
    description: item.description,
    href: item.href,
    icon,
    id: item.id,
    kind: "icon",
    label: item.label,
  };
}

export function resolveAfendaAppSidebarNavItemDescriptor<
  IconKey extends string = string,
>(
  item: AfendaAppSidebarNavItemDescriptor<IconKey>,
  iconRegistry: AfendaAppSidebarNavIconRegistry<IconKey>
): AppSidebarNavItem {
  if (item.kind === "product") {
    return item;
  }

  return resolveNavIconDescriptor(item, iconRegistry);
}

function resolveNavGroupDescriptor<IconKey extends string>(
  group: AfendaAppSidebarNavGroupDescriptor<IconKey>,
  iconRegistry: AfendaAppSidebarNavIconRegistry<IconKey>
): AfendaAppSidebarNavGroup {
  return {
    groupSlot: group.groupSlot,
    label: group.label,
    items: group.items.map((item) =>
      resolveAfendaAppSidebarNavItemDescriptor(item, iconRegistry)
    ),
  };
}

export function resolveAfendaAppSidebarNavLayout<
  IconKey extends string = string,
>(
  navDescriptor: AfendaAppSidebarNavLayoutDescriptor<IconKey>,
  iconRegistry: AfendaAppSidebarNavIconRegistry<IconKey>
): AfendaAppSidebarNavLayout {
  return {
    footer: navDescriptor.footer
      ? resolveNavGroupDescriptor(navDescriptor.footer, iconRegistry)
      : undefined,
    main: navDescriptor.main
      ? resolveNavGroupDescriptor(navDescriptor.main, iconRegistry)
      : undefined,
    scroll: navDescriptor.scroll?.map((group) =>
      resolveNavGroupDescriptor(group, iconRegistry)
    ),
  };
}

export function collectSidebarNavItemDescriptors<
  IconKey extends string = string,
>(
  navDescriptor: AfendaAppSidebarNavLayoutDescriptor<IconKey> | undefined
): readonly (readonly SidebarNavMatchDescriptor[])[] {
  if (!navDescriptor) {
    return [];
  }

  const groups: SidebarNavMatchDescriptor[][] = [];

  if (navDescriptor.main?.items.length) {
    groups.push([...navDescriptor.main.items]);
  }

  for (const group of navDescriptor.scroll ?? []) {
    if (group.items.length) {
      groups.push([...group.items]);
    }
  }

  if (navDescriptor.footer?.items.length) {
    groups.push([...navDescriptor.footer.items]);
  }

  return groups;
}
