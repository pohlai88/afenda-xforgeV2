"use client";

import { cn } from "../../../../../lib/utils";
import { blockRecipe } from "../../../block-recipes";
import { TopbarContextSwitcher } from "./topbar-context-switcher";
import {
  topbarScopeNavClass,
  topbarScopeSwitcherItemClass,
} from "./topbar-recipes";
import type { TopbarContextSwitcherProps } from "./topbar-types";

export function TopbarScopeSwitchers({
  switchers,
}: {
  readonly switchers: readonly TopbarContextSwitcherProps[];
}) {
  if (switchers.length === 0) {
    return (
      <div className="min-w-0 flex-1" data-slot="app-topbar-scope-switchers" />
    );
  }

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
