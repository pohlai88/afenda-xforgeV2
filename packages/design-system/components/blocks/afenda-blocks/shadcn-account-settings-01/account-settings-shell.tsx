"use client";

import { cn } from "../../../../lib/utils";
import { blockRecipe } from "../../block-recipes";
import {
  accountSettingsContentClass,
  accountSettingsPageLayoutClass,
  accountSettingsPageMainClass,
} from "./account-settings-recipes";

export interface AccountSettingsShellProps {
  readonly nav: React.ReactNode;
  readonly children: React.ReactNode;
  readonly header?: React.ReactNode;
}

export function AccountSettingsShell({
  children,
  header,
  nav,
}: AccountSettingsShellProps) {
  return (
    <div
      className={cn(blockRecipe("blockShell"), accountSettingsPageMainClass)}
      data-slot="account-settings-shell"
    >
      {header && (
        <div
          className="shrink-0 border-b border-border-default px-4 py-4 md:px-6"
          data-slot="account-settings-header"
        >
          {header}
        </div>
      )}
      <div className={cn(accountSettingsPageLayoutClass)}>
        {nav}
        <main className={cn(accountSettingsContentClass)}>
          {children}
        </main>
      </div>
    </div>
  );
}
