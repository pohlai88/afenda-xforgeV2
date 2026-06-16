"use client";

import {
  blockRecipe,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@repo/design-system/design-system";
import { cn } from "@repo/design-system/lib/utils";
import { useWorkspaceKeyboard } from "./workspace-keyboard-provider";

const shortcutRows = [
  { keys: "⌘K", description: "Open command palette" },
  { keys: "J / K", description: "Move selection down / up in queue tables" },
  { keys: "E", description: "Open selected record in search" },
  { keys: "N", description: "Create master record (toolbar action)" },
  { keys: "?", description: "Show keyboard shortcuts" },
] as const;

export function WorkspaceShortcutsDialog() {
  const { setShortcutsOpen, shortcutsOpen } = useWorkspaceKeyboard();

  return (
    <Dialog onOpenChange={setShortcutsOpen} open={shortcutsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Keyboard shortcuts</DialogTitle>
          <DialogDescription>
            Operator shortcuts for the governed workspace cockpit.
          </DialogDescription>
        </DialogHeader>
        <dl className="grid gap-2">
          {shortcutRows.map((row) => (
            <div
              className="flex items-center justify-between gap-4 border-border-default border-b py-2 last:border-b-0"
              key={row.keys}
            >
              <dt className={blockRecipe("blockDescription")}>{row.description}</dt>
              <dd>
                <kbd
                  className={cn(
                    "rounded border border-border-default bg-surface-muted/60 px-2 py-1 font-mono text-[11px] text-text-secondary tabular-nums"
                  )}
                >
                  {row.keys}
                </kbd>
              </dd>
            </div>
          ))}
        </dl>
      </DialogContent>
    </Dialog>
  );
}
