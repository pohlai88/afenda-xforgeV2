"use client";

import { cn } from "../../../../../lib/utils";
import { blockRecipe } from "../../../block-recipes";
import { TopbarActionsMenu } from "./topbar-actions-menu";
import {
  topbarRightClusterClass,
  topbarUtilitiesFixedClusterClass,
  topbarUtilitiesRailSeparatorClass,
} from "./topbar-recipes";
import { TopbarThemeToggle } from "./topbar-theme-toggle";
import type { TopbarRightActionsProps } from "./topbar-types";
import { TopbarUtilitiesBar } from "./topbar-utilities-bar";
import {
  TopbarUtilitiesProvider,
  useTopbarUtilities,
} from "./topbar-utilities-context";
import {
  TopbarFeedbackMenu,
  TopbarUtilitiesMarketplace,
} from "./topbar-utilities-marketplace";

function TopbarRightActionsInner({
  actionGroups,
}: Pick<TopbarRightActionsProps, "actionGroups">) {
  const { feedbackMenuOpen, setFeedbackMenuOpen } = useTopbarUtilities();

  return (
    <>
      <TopbarUtilitiesBar />
      <div
        aria-hidden
        className={cn(topbarUtilitiesRailSeparatorClass)}
        data-slot="app-topbar-utilities-rail"
      />
      <div
        className={cn(topbarUtilitiesFixedClusterClass)}
        data-slot="app-topbar-utilities-fixed"
      >
        <TopbarUtilitiesMarketplace />
        <TopbarThemeToggle />
        <TopbarActionsMenu groups={actionGroups} />
      </div>
      <TopbarFeedbackMenu
        onOpenChange={setFeedbackMenuOpen}
        open={feedbackMenuOpen}
      />
    </>
  );
}

export function TopbarRightActions({
  actionGroups,
  previewUtilities = false,
  tenantId,
  userId,
  utilityActionOverrides,
}: TopbarRightActionsProps) {
  return (
    <TopbarUtilitiesProvider
      preview={previewUtilities}
      tenantId={tenantId}
      userId={userId}
      utilityActionOverrides={utilityActionOverrides}
    >
      <div
        className={cn(blockRecipe("blockToolbar"), topbarRightClusterClass)}
        data-slot="app-topbar-right"
      >
        <TopbarRightActionsInner actionGroups={actionGroups} />
      </div>
    </TopbarUtilitiesProvider>
  );
}
