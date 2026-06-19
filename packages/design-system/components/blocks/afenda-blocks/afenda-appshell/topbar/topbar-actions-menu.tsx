"use client";

import { EllipsisVerticalIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "../../../../../lib/utils";
import { Button } from "../../../../afenda-ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../afenda-ui/dropdown-menu";
import { blockRecipe } from "../../../block-recipes";
import {
  topbarActionIconClass,
  topbarActionsMenuContentClass,
  topbarActionsMenuGroupLabelClass,
  topbarActionsMenuHeaderClass,
  topbarActionsMenuHeaderEmailClass,
  topbarActionsMenuHeaderNameClass,
  topbarActionsMenuItemClass,
  topbarActionsMenuItemDestructiveClass,
  topbarIconButtonClass,
} from "./topbar-recipes";
import type { TopbarActionsMenuProps } from "./topbar-types";

export function TopbarActionsMenu({
  groups = [],
  header,
  triggerLabel = "Actions",
}: TopbarActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const visibleGroups = groups.filter((group) => group.items.length > 0);

  if (visibleGroups.length === 0) {
    return null;
  }

  const showHeader = Boolean(header?.name || header?.email);

  return (
    <DropdownMenu onOpenChange={setOpen} open={open}>
      <DropdownMenuTrigger asChild>
        <Button
          aria-haspopup="menu"
          aria-label={triggerLabel}
          className={cn(blockRecipe("blockToolbar"), topbarIconButtonClass)}
          data-slot="app-topbar-actions-trigger"
          size="icon-sm"
          type="button"
          variant="quiet"
        >
          <EllipsisVerticalIcon
            aria-hidden="true"
            className={cn(topbarActionIconClass)}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className={cn(topbarActionsMenuContentClass)}
        data-slot="app-topbar-actions-content"
      >
        {showHeader ? (
          <div className={cn(topbarActionsMenuHeaderClass)}>
            {header?.name ? (
              <p className={cn(topbarActionsMenuHeaderNameClass)}>
                {header.name}
              </p>
            ) : null}
            {header?.email ? (
              <p className={cn(topbarActionsMenuHeaderEmailClass)}>
                {header.email}
              </p>
            ) : null}
          </div>
        ) : null}
        {visibleGroups.map((group, groupIndex) => (
          <DropdownMenuGroup key={group.key}>
            {groupIndex > 0 ? <DropdownMenuSeparator /> : null}
            {group.label ? (
              <DropdownMenuLabel
                className={cn(topbarActionsMenuGroupLabelClass)}
              >
                {group.label}
              </DropdownMenuLabel>
            ) : null}
            {group.items.map((item) => (
              <DropdownMenuItem
                className={cn(
                  topbarActionsMenuItemClass,
                  item.destructive && topbarActionsMenuItemDestructiveClass
                )}
                disabled={item.disabled}
                key={item.key}
                onSelect={(event) => {
                  event.preventDefault();
                  item.onSelect?.();
                  setOpen(false);
                }}
              >
                {item.icon}
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
