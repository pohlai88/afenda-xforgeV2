import type {
  SidebarItemActiveFn,
  SidebarLabelGroup,
  SidebarNavGroup,
  SidebarNavItem,
} from "./sidebar-types";

export const EMPTY_SIDEBAR_LABEL_GROUPS: readonly SidebarLabelGroup[] = [];

function normalizeSidebarPath(path: string): string {
  if (path.length <= 1) {
    return path;
  }

  return path.endsWith("/") ? path.slice(0, -1) : path;
}

function matchesSidebarPath(
  pathname: string,
  href: string,
  match: SidebarNavItem["match"]
): boolean {
  const normalizedPathname = normalizeSidebarPath(pathname);
  const normalizedHref = normalizeSidebarPath(href);

  if (normalizedHref === "/") {
    return normalizedPathname === "/";
  }

  if (match === "exact") {
    return normalizedPathname === normalizedHref;
  }

  return (
    normalizedPathname === normalizedHref ||
    normalizedPathname.startsWith(`${normalizedHref}/`)
  );
}

export function isSidebarNavItemActive(
  pathname: string,
  item: SidebarNavItem
): boolean {
  if (item.selected !== undefined) {
    return item.selected;
  }

  return matchesSidebarPath(pathname, item.href, item.match);
}

export function flattenSidebarNavGroups<
  TGroup extends { readonly items: readonly SidebarNavItem[] },
>(groups: readonly TGroup[]): readonly SidebarNavItem[] {
  return groups.flatMap((group) => group.items);
}

/** Removes static `selected` flags so pathname-driven activation can apply. */
export function stripSidebarNavItemSelection(
  groups: readonly SidebarNavGroup[]
): readonly SidebarNavGroup[] {
  return groups.map((group) => ({
    ...group,
    items: group.items.map(({ selected: _selected, ...item }) => item),
  }));
}

export function resolveSidebarActiveItemIds(
  groups: readonly SidebarNavGroup[],
  pathname: string,
  isItemActive: SidebarItemActiveFn = isSidebarNavItemActive
): ReadonlySet<string> {
  const activeItemIds = new Set<string>();

  for (const group of groups) {
    for (const item of group.items) {
      if (isItemActive(pathname, item)) {
        activeItemIds.add(item.id);
      }
    }
  }

  return activeItemIds;
}
