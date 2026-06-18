"use client";

import { blockRecipe } from "../../../block-recipes";
import { cn } from "../../../../../lib/utils";
import { TopbarContextSwitcher } from "./topbar-context-switcher";
import { topbarScopeNavClass, topbarScopeSwitcherItemClass } from "./topbar-recipes";
import type { TopbarContextSwitcherProps } from "./topbar-types";
import { useTopbarLinkedNav } from "./use-topbar-linked-nav";

export function TopbarScopeSwitchers({
  switchers: switchersProp,
}: {
  readonly switchers?: readonly TopbarContextSwitcherProps[];
}) {
  const linkedNav = useTopbarLinkedNav();
  const switchers = switchersProp ?? linkedNav.switchers;

  return (
    <nav
      aria-label="Workspace context"
      className={cn(blockRecipe("blockToolbar"), topbarScopeNavClass)}
      data-slot="app-topbar-scope-switchers"
    >
      {switchers.map((switcher) => (
        <div className={cn(topbarScopeSwitcherItemClass)} key={switcher.scope}>
          <TopbarContextSwitcher {...switcher} />
        </div>
      ))}
    </nav>
  );
}
