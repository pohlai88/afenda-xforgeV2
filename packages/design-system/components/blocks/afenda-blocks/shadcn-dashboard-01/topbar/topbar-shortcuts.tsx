"use client";

import { Button } from "../../../../afenda-ui/button";
import { topbarIconActionClass } from "./topbar-recipes";
import { cn } from "../../../../../lib/utils";
import { useEffect, useState } from "react";
import { TopbarShortcutsDialog } from "./topbar-shortcuts-dialog";
import { TopbarTooltip } from "./topbar-tooltip";
import type {
  TopbarShortcutsProps,
  TopbarUtilityAction,
} from "./topbar-types";

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tag = target.tagName;

  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    target.isContentEditable ||
    target.closest("[contenteditable='true']") !== null
  );
}

export function TopbarShortcuts({
  action,
  className,
  shortcuts,
}: {
  readonly action: TopbarUtilityAction;
  readonly className?: string;
  readonly shortcuts: TopbarShortcutsProps;
}) {
  const {
    contextLabel,
    description = action.description ?? "Keyboard shortcuts for this workspace.",
    emptyState,
    items,
    label = action.label,
    menuLabel = `Open ${action.label.toLowerCase()}`,
  } = shortcuts;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "?" || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      if (isEditableTarget(event.target)) {
        return;
      }

      event.preventDefault();
      setOpen(true);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <TopbarTooltip
        description={description}
        label={label}
        shortcut={action.shortcut}
      >
        <Button
          aria-haspopup="dialog"
          aria-label={menuLabel}
          className={cn(topbarIconActionClass, className)}
          data-slot={`app-topbar-utility-${action.id}`}
          onClick={() => setOpen(true)}
          size="icon-sm"
          type="button"
          variant="quiet"
        >
          {action.icon}
        </Button>
      </TopbarTooltip>
      <TopbarShortcutsDialog
        contextLabel={contextLabel}
        emptyState={emptyState}
        onOpenChange={setOpen}
        open={open}
        shortcuts={items}
      />
    </>
  );
}
