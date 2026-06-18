"use client";

import { TopbarShortcutsDialog } from "@repo/design-system";
import { useWorkspaceKeyboard } from "./workspace-keyboard-provider";
import { useWorkspaceShortcutDefinitions } from "./workspace-shortcuts";

export function WorkspaceShortcutsDialog() {
  const { setShortcutsOpen, shortcutsOpen } = useWorkspaceKeyboard();
  const { contextLabel, shortcuts } = useWorkspaceShortcutDefinitions();

  return (
    <TopbarShortcutsDialog
      contextLabel={contextLabel}
      onOpenChange={setShortcutsOpen}
      open={shortcutsOpen}
      shortcuts={shortcuts}
    />
  );
}
