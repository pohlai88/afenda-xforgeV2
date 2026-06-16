"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useCallback } from "react";
import {
  type CockpitQueueRowKey,
  parseCockpitQueueRowKey,
} from "./workspace-cockpit-data";
import { WorkspaceCommandPalette } from "./workspace-command-palette";
import { WorkspaceShellFrame, WorkspaceShellRoot } from "./workspace-shell";
import { WorkspaceShortcutsDialog } from "./workspace-shortcuts-dialog";

interface AuthenticatedAppShellProperties {
  readonly activeOrganizationId: string | null;
  readonly children: ReactNode;
  readonly userEmail?: string | null;
  readonly userName?: string | null;
}

export const AuthenticatedAppShell = ({
  activeOrganizationId,
  children,
  userEmail,
  userName,
}: AuthenticatedAppShellProperties) => {
  const router = useRouter();

  const handleEditSelectedRow = useCallback(
    (rowKey: CockpitQueueRowKey) => {
      const { recordId } = parseCockpitQueueRowKey(rowKey);
      router.push(`/search?q=${encodeURIComponent(recordId)}`);
    },
    [router]
  );

  return (
    <WorkspaceShellRoot
      activeOrganizationId={activeOrganizationId}
      onEditSelectedRow={handleEditSelectedRow}
      userEmail={userEmail}
      userName={userName}
    >
      <WorkspaceShellFrame>{children}</WorkspaceShellFrame>
      <WorkspaceCommandPalette />
      <WorkspaceShortcutsDialog />
    </WorkspaceShellRoot>
  );
};
