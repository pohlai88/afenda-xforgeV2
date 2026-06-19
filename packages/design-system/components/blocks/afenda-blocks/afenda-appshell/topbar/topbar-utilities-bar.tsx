"use client";

import { cn } from "../../../../../lib/utils";
import { Button } from "../../../../afenda-ui/button";
import { blockRecipe } from "../../../block-recipes";
import {
  topbarIconButtonClass,
  topbarUtilitiesBarClass,
  topbarUtilitiesBarFieldsetClass,
  topbarUtilitiesBarLegendClass,
  topbarUtilitiesBarSortableItemClass,
} from "./topbar-recipes";
import {
  getTopbarUtilityDefinition,
  getTopbarUtilitySlotId,
  renderTopbarUtilityIcon,
  type TopbarUtilityId,
} from "./topbar-utilities-catalog";
import { useTopbarUtilities } from "./topbar-utilities-context";
import {
  TopbarHorizontalUtilitySortable,
  TopbarSortableHorizontalItem,
} from "./topbar-utilities-sortable";
import {
  getTopbarVisibleUtilityIds,
  reorderTopbarUtilityIds,
  reorderTopbarVisibleUtilities,
} from "./topbar-utilities-storage";

export function TopbarUtilitiesBar() {
  const {
    handleUtilityAction,
    persistUtilitiesState,
    utilitiesState,
    visibleIds,
  } = useTopbarUtilities();

  const handleReorder = (
    sourceId: TopbarUtilityId,
    targetId: TopbarUtilityId
  ): void => {
    const sourceVisible = visibleIds.includes(sourceId);
    const targetVisible = visibleIds.includes(targetId);

    if (sourceVisible && targetVisible) {
      persistUtilitiesState(
        reorderTopbarVisibleUtilities(utilitiesState, sourceId, targetId)
      );
      return;
    }

    const nextOrder = reorderTopbarUtilityIds(
      utilitiesState.order,
      sourceId,
      targetId
    );

    persistUtilitiesState({
      order: nextOrder,
      visible: getTopbarVisibleUtilityIds({
        order: nextOrder,
        visible: utilitiesState.visible,
      }),
    });
  };

  if (visibleIds.length === 0) {
    return null;
  }

  return (
    <TopbarHorizontalUtilitySortable ids={visibleIds} onReorder={handleReorder}>
      <fieldset
        className={cn(
          blockRecipe("blockToolbar"),
          topbarUtilitiesBarClass,
          topbarUtilitiesBarFieldsetClass
        )}
        data-slot="app-topbar-utilities-bar"
      >
        <legend className={cn(topbarUtilitiesBarLegendClass)}>
          Pinned utilities
        </legend>
        {visibleIds.map((utilityId) => {
          const definition = getTopbarUtilityDefinition(utilityId);

          return (
            <TopbarSortableHorizontalItem
              className={cn(topbarUtilitiesBarSortableItemClass)}
              id={utilityId}
              key={utilityId}
            >
              <Button
                aria-label={definition.label}
                className={cn(
                  blockRecipe("blockToolbar"),
                  topbarIconButtonClass
                )}
                data-slot={getTopbarUtilitySlotId(utilityId)}
                onClick={() => {
                  handleUtilityAction(utilityId);
                }}
                size="icon-sm"
                type="button"
                variant="quiet"
              >
                {renderTopbarUtilityIcon(utilityId)}
              </Button>
            </TopbarSortableHorizontalItem>
          );
        })}
      </fieldset>
    </TopbarHorizontalUtilitySortable>
  );
}
