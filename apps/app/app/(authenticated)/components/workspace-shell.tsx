"use client";

import { AuthenticatedAppShellBlock } from "@repo/design-system";
import type { ReactNode } from "react";
import { AppTopbar } from "./app-topbar";
import { AppSidebarNav } from "./sidebar";
import type { CockpitQueueRowKey } from "./workspace-cockpit-data";
import { WorkspaceKeyboardProvider } from "./workspace-keyboard-provider";
import { WorkspaceSessionProvider } from "./workspace-session-context";

interface WorkspaceShellRootProperties {
  readonly activeOrganizationId: string | null;
  readonly children: ReactNode;
  readonly onEditSelectedRow?: (rowKey: CockpitQueueRowKey) => void;
  readonly userEmail?: string | null;
  readonly userName?: string | null;
}

export function WorkspaceShellRoot({
  activeOrganizationId,
  children,
  onEditSelectedRow,
  userEmail,
  userName,
}: WorkspaceShellRootProperties) {
  return (
    <WorkspaceSessionProvider
      activeOrganizationId={activeOrganizationId}
      userEmail={userEmail}
      userName={userName}
    >
      <WorkspaceKeyboardProvider onEditSelectedRow={onEditSelectedRow}>
        {children}
      </WorkspaceKeyboardProvider>
    </WorkspaceSessionProvider>
  );
}

interface WorkspaceShellFrameProperties {
  readonly children: ReactNode;
}

export function WorkspaceShellFrame({
  children,
}: WorkspaceShellFrameProperties) {
  return (
    <AuthenticatedAppShellBlock
      appSidebar={<AppSidebarNav />}
      appSidebarConfig={{ collapsible: "icon", variant: "sidebar" }}
      appTopbar={<AppTopbar />}
      contentPadded
      density="compact"
      intent="operation"
      siteContainerConfig={{ adjustable: false, mode: "docked" }}
    >
      {children}
    </AuthenticatedAppShellBlock>
  );
}
