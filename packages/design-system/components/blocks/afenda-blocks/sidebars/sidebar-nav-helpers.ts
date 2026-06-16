import type {
  SidebarCardSection,
  SidebarCardSectionItem,
  SidebarCardSectionItemActiveFn,
  SidebarItemActiveFn,
  SidebarLabelGroup,
  SidebarMatchStrategy,
  SidebarNavGroup,
  SidebarNavItem,
} from "./sidebar-types";

export const EMPTY_SIDEBAR_LABEL_GROUPS: readonly SidebarLabelGroup[] = [];

export function hasOperatorSidebarNavigation(
  groups: readonly SidebarNavGroup[],
  labelGroups: readonly SidebarLabelGroup[] = EMPTY_SIDEBAR_LABEL_GROUPS
): boolean {
  return groups.length > 0 || labelGroups.length > 0;
}

function normalizeSidebarPath(path: string): string {
  if (path.length <= 1) {
    return path;
  }

  return path.endsWith("/") ? path.slice(0, -1) : path;
}

function matchesSidebarPath(
  pathname: string,
  href: string,
  match?: SidebarMatchStrategy
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

export function isSidebarCardSectionItemActive(
  pathname: string,
  item: SidebarCardSectionItem
): boolean {
  if (item.selected !== undefined) {
    return item.selected;
  }

  return matchesSidebarPath(pathname, item.href, item.match);
}

export function isSidebarCardSectionActive(
  pathname: string,
  section: SidebarCardSection,
  isItemActive: SidebarCardSectionItemActiveFn = isSidebarCardSectionItemActive
): boolean {
  if (section.selected !== undefined) {
    return section.selected;
  }

  if (matchesSidebarPath(pathname, section.href, section.match)) {
    return true;
  }

  const menuItems = section.menuItems ?? [];

  return [...section.items, ...menuItems].some((item) =>
    isItemActive(pathname, item)
  );
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

export function resolveSidebarActiveCardSectionIds(
  sections: readonly SidebarCardSection[],
  pathname: string,
  isItemActive: SidebarCardSectionItemActiveFn = isSidebarCardSectionItemActive
): ReadonlySet<string> {
  const activeSectionIds = new Set<string>();

  for (const section of sections) {
    if (isSidebarCardSectionActive(pathname, section, isItemActive)) {
      activeSectionIds.add(section.id);
    }
  }

  return activeSectionIds;
}
