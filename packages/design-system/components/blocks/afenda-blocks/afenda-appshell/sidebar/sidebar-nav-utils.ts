interface SidebarNavMatchItem {
  readonly href: string;
  readonly id: string;
}

function resolveActiveSidebarNavItemId(
  pathname: string,
  items: readonly SidebarNavMatchItem[]
): string | undefined {
  const normalizedPath = pathname.replace(/\/+$/, "") || "/";

  const matches = items
    .filter((item) => {
      const normalizedHref = item.href.replace(/\/+$/, "") || "/";

      if (normalizedPath === normalizedHref) {
        return true;
      }

      if (normalizedHref === "/") {
        return false;
      }

      return normalizedPath.startsWith(`${normalizedHref}/`);
    })
    .sort((left, right) => right.href.length - left.href.length);

  return matches[0]?.id;
}

function resolveActiveSidebarNavItemIds(
  pathname: string,
  groups: readonly (readonly SidebarNavMatchItem[])[]
): ReadonlySet<string> {
  const activeIds = new Set<string>();

  for (const items of groups) {
    const activeId = resolveActiveSidebarNavItemId(pathname, items);

    if (activeId) {
      activeIds.add(activeId);
    }
  }

  return activeIds;
}

export { resolveActiveSidebarNavItemId, resolveActiveSidebarNavItemIds };
