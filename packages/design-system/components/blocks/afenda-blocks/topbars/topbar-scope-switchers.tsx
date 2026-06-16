"use client";

import { cn } from "@repo/design-system/lib/utils";
import { TopbarScopeSwitcher } from "./topbar-scope-switcher";
import type { TopbarScopeSwitchersProps } from "./topbar-types";

export function TopbarScopeSwitchers({
  className,
  switchers,
}: TopbarScopeSwitchersProps) {
  if (switchers.length === 0) {
    return null;
  }

  return (
    <fieldset
      className={cn(
        "flex min-w-0 items-center gap-1 border-0 p-0",
        className
      )}
      data-slot="app-topbar-scope-switchers"
    >
      <legend className="sr-only">Workspace scope switchers</legend>
      {switchers.map((switcher) => (
        <TopbarScopeSwitcher
          activeOptionId={switcher.activeOptionId}
          description={switcher.description}
          key={switcher.id}
          label={switcher.label}
          onSelect={switcher.onSelect}
          options={switcher.options}
          scopeId={switcher.id}
        />
      ))}
    </fieldset>
  );
}
