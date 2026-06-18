"use client";

import { BugIcon, GripVerticalIcon, LayersPlusIcon, SendIcon, StoreIcon, ZapIcon } from "lucide-react";
import { useId, useMemo, useState } from "react";
import { toast } from "sonner";
import { blockRecipe } from "../../../block-recipes";
import { Button } from "../../../../afenda-ui/button";
import { Checkbox } from "../../../../afenda-ui/checkbox";
import { Label } from "../../../../afenda-ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../afenda-ui/popover";
import { ScrollArea } from "../../../../afenda-ui/scroll-area";
import { Textarea } from "../../../../afenda-ui/textarea";
import { cn } from "../../../../../lib/utils";
import {
  TOPBAR_UTILITY_CATALOG,
  TOPBAR_UTILITY_MAX_PINNED,
  getTopbarUtilityDefinition,
  renderTopbarUtilityIcon,
  type TopbarUtilityId,
} from "./topbar-utilities-catalog";
import {
  reorderTopbarUtilityIds,
  getTopbarVisibleUtilityIds,
} from "./topbar-utilities-storage";
import { useTopbarUtilities } from "./topbar-utilities-context";
import {
  TopbarSortableVerticalItem,
  TopbarVerticalUtilitySortable,
} from "./topbar-utilities-sortable";
import {
  topbarActionIconClass,
  topbarFeedbackHiddenTriggerClass,
  topbarFeedbackMenuContentClass,
  topbarFeedbackMenuItemClass,
  topbarIconButtonClass,
  topbarUtilitiesMarketContentClass,
  topbarUtilitiesMarketDescriptionClass,
  topbarUtilitiesMarketDisabledRowClass,
  topbarUtilitiesMarketFooterClass,
  topbarUtilitiesMarketGripClass,
  topbarUtilitiesMarketGripIconClass,
  topbarUtilitiesMarketHeaderClass,
  topbarUtilitiesMarketListClass,
  topbarUtilitiesMarketListRegionClass,
  topbarUtilitiesMarketListScrollClass,
  topbarUtilitiesMarketMetaClass,
  topbarUtilitiesMarketRequestFormClass,
  topbarUtilitiesMarketRequestHeaderClass,
  topbarUtilitiesMarketRequestIconClass,
  topbarUtilitiesMarketRequestLabelClass,
  topbarUtilitiesMarketRequestSendIconClass,
  topbarUtilitiesMarketRequestSubmitClass,
  topbarUtilitiesMarketRequestSubmitRowClass,
  topbarUtilitiesMarketRequestTextareaClass,
  topbarUtilitiesMarketRowActionClass,
  topbarUtilitiesMarketRowClass,
  topbarUtilitiesMarketRowIconClass,
  topbarUtilitiesMarketRowLabelClass,
  topbarUtilitiesMarketTitleClass,
} from "./topbar-recipes";

export function TopbarUtilitiesMarketplace() {
  const {
    handleUtilityAction,
    persistUtilitiesState,
    utilitiesState,
    visibleIds,
  } = useTopbarUtilities();
  const [open, setOpen] = useState(false);
  const [utilityRequest, setUtilityRequest] = useState("");
  const utilityRequestFieldId = useId();

  const visibleSet = useMemo(
    () => new Set(utilitiesState.visible),
    [utilitiesState.visible]
  );

  const submitUtilityRequest = (): void => {
    const message = utilityRequest.trim();

    if (!message) {
      return;
    }

    toast.message(
      "Utility request received. Product will review your suggestion."
    );
    setUtilityRequest("");
  };

  const toggleUtility = (utilityId: TopbarUtilityId): void => {
    const isVisible = visibleSet.has(utilityId);

    if (isVisible) {
      persistUtilitiesState({
        ...utilitiesState,
        visible: utilitiesState.visible.filter((id) => id !== utilityId),
      });
      return;
    }

    if (visibleIds.length >= TOPBAR_UTILITY_MAX_PINNED) {
      toast.message(
        `Maximum ${TOPBAR_UTILITY_MAX_PINNED} utility icons can appear on the bar.`
      );
      return;
    }

    persistUtilitiesState({
      ...utilitiesState,
      visible: [...utilitiesState.visible, utilityId],
    });
  };

  const handleWidgetReorder = (
    sourceId: TopbarUtilityId,
    targetId: TopbarUtilityId
  ): void => {
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

  return (
    <Popover modal={false} onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          aria-haspopup="dialog"
          aria-label="Utilities marketplace"
          className={cn(blockRecipe("blockToolbar"), topbarIconButtonClass)}
          data-slot="app-topbar-utilities-market-trigger"
          size="icon-sm"
          type="button"
          variant="quiet"
        >
          <StoreIcon aria-hidden="true" className={cn(topbarActionIconClass)} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className={cn(topbarUtilitiesMarketContentClass)}
        data-slot="app-topbar-utilities-market-content"
        sideOffset={4}
      >
        <div className={cn(topbarUtilitiesMarketHeaderClass)}>
          <p className={cn(topbarUtilitiesMarketTitleClass)}>Utilities marketplace</p>
          <p className={cn(topbarUtilitiesMarketDescriptionClass)}>
            Choose which icons appear on the topbar. Drag here or on the topbar to
            reorder.
          </p>
        </div>
        <p className={cn(topbarUtilitiesMarketMetaClass)}>
          {visibleIds.length}/{TOPBAR_UTILITY_MAX_PINNED} selected ·{" "}
          {TOPBAR_UTILITY_CATALOG.length} available
        </p>
        <ScrollArea className={cn(topbarUtilitiesMarketListScrollClass)}>
          <div className={cn(topbarUtilitiesMarketListRegionClass)}>
            <TopbarVerticalUtilitySortable
              ids={utilitiesState.order}
              onReorder={handleWidgetReorder}
            >
              <ul className={cn(topbarUtilitiesMarketListClass)}>
                {utilitiesState.order.map((utilityId) => {
                  const utility = getTopbarUtilityDefinition(utilityId);
                  const checked = visibleSet.has(utilityId);
                  const disabled =
                    !checked &&
                    visibleIds.length >= TOPBAR_UTILITY_MAX_PINNED;

                  return (
                    <TopbarSortableVerticalItem
                      className={cn(
                        disabled && topbarUtilitiesMarketDisabledRowClass
                      )}
                      id={utilityId}
                      key={utilityId}
                    >
                      <div className={cn(topbarUtilitiesMarketRowClass)}>
                        <span
                          aria-hidden
                          className={cn(topbarUtilitiesMarketGripClass)}
                        >
                          <GripVerticalIcon
                            className={cn(topbarUtilitiesMarketGripIconClass)}
                          />
                        </span>
                        <Checkbox
                          aria-label={`Show ${utility.label} on topbar`}
                          checked={checked}
                          disabled={disabled}
                          onCheckedChange={() => {
                            toggleUtility(utilityId);
                          }}
                          onPointerDown={(event) => {
                            event.stopPropagation();
                          }}
                        />
                        <Button
                          className={cn(topbarUtilitiesMarketRowActionClass)}
                          onClick={() => {
                            handleUtilityAction(utilityId);
                          }}
                          onPointerDown={(event) => {
                            event.stopPropagation();
                          }}
                          type="button"
                          variant="quiet"
                        >
                          <span className={cn(topbarUtilitiesMarketRowIconClass)}>
                            {renderTopbarUtilityIcon(utilityId)}
                          </span>
                          <span className={cn(topbarUtilitiesMarketRowLabelClass)}>
                            {utility.label}
                          </span>
                        </Button>
                      </div>
                    </TopbarSortableVerticalItem>
                  );
                })}
              </ul>
            </TopbarVerticalUtilitySortable>
          </div>
        </ScrollArea>
        <footer className={cn(topbarUtilitiesMarketFooterClass)}>
          <div className={cn(topbarUtilitiesMarketRequestHeaderClass)}>
            <LayersPlusIcon
              aria-hidden
              className={cn(topbarUtilitiesMarketRequestIconClass)}
            />
            <Label
              className={cn(topbarUtilitiesMarketRequestLabelClass)}
              htmlFor={utilityRequestFieldId}
            >
              Request a utility
            </Label>
          </div>
          <form
            className={cn(topbarUtilitiesMarketRequestFormClass)}
            data-slot="app-topbar-utilities-request-form"
            onSubmit={(event) => {
              event.preventDefault();
              submitUtilityRequest();
            }}
          >
            <Textarea
              className={cn(topbarUtilitiesMarketRequestTextareaClass)}
              id={utilityRequestFieldId}
              onChange={(event) => {
                setUtilityRequest(event.target.value);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                  event.preventDefault();
                  submitUtilityRequest();
                }
              }}
              placeholder="Describe the shortcut or tool you need…"
              rows={2}
              value={utilityRequest}
            />
            <div className={cn(topbarUtilitiesMarketRequestSubmitRowClass)}>
              <Button
                className={cn(topbarUtilitiesMarketRequestSubmitClass)}
                disabled={!utilityRequest.trim()}
                size="sm"
                type="submit"
              >
                <SendIcon className={cn(topbarUtilitiesMarketRequestSendIconClass)} />
                Send
              </Button>
            </div>
          </form>
        </footer>
      </PopoverContent>
    </Popover>
  );
}

export function TopbarFeedbackMenu({
  onOpenChange,
  open,
}: {
  readonly onOpenChange: (open: boolean) => void;
  readonly open: boolean;
}) {
  return (
    <Popover onOpenChange={onOpenChange} open={open}>
      <PopoverTrigger asChild>
        <button
          aria-hidden
          className={cn(topbarFeedbackHiddenTriggerClass)}
          tabIndex={-1}
          type="button"
        />
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className={cn(topbarFeedbackMenuContentClass)}
        sideOffset={4}
      >
        <Button
          className={cn(topbarFeedbackMenuItemClass)}
          onClick={() => {
            onOpenChange(false);
            toast.message("Issue feedback is not wired yet.");
          }}
          type="button"
          variant="quiet"
        >
          <BugIcon className={cn(topbarActionIconClass)} />
          Issue
        </Button>
        <Button
          className={cn(topbarFeedbackMenuItemClass)}
          onClick={() => {
            onOpenChange(false);
            toast.message("Ideas feedback is not wired yet.");
          }}
          type="button"
          variant="quiet"
        >
          <ZapIcon className={cn(topbarActionIconClass)} />
          Ideas
        </Button>
      </PopoverContent>
    </Popover>
  );
}
