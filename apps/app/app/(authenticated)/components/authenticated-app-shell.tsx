"use client";

import { useRouter } from "next/navigation";
import { useCallback, type ReactNode } from "react";
import {
  parseCockpitQueueRowKey,
  type CockpitQueueRowKey,
} from "./workspace-cockpit-data";
import { WorkspaceCommandPalette } from "./workspace-command-palette";
import { WorkspaceShortcutsDialog } from "./workspace-shortcuts-dialog";
import {
  WorkspaceShellFrame,
  WorkspaceShellRoot,
} from "./workspace-shell";

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
