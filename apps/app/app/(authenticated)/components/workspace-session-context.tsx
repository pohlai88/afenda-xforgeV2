"use client";

import { createContext, type ReactNode, useContext, useMemo } from "react";

export interface WorkspaceSessionState {
  readonly activeOrganizationId: string | null;
  readonly userEmail: string | null;
  readonly userName: string | null;
}

export interface WorkspaceSessionMeta {
  readonly displayName: string;
}

export interface WorkspaceSessionContextValue {
  readonly meta: WorkspaceSessionMeta;
  readonly state: WorkspaceSessionState;
}

const WorkspaceSessionContext =
  createContext<WorkspaceSessionContextValue | null>(null);

interface WorkspaceSessionProviderProperties {
  readonly activeOrganizationId: string | null;
  readonly children: ReactNode;
  readonly userEmail?: string | null;
  readonly userName?: string | null;
}

export function WorkspaceSessionProvider({
  activeOrganizationId,
  children,
  userEmail = null,
  userName = null,
}: WorkspaceSessionProviderProperties) {
  const value = useMemo<WorkspaceSessionContextValue>(() => {
    const normalizedEmail = userEmail?.trim() || null;
    const normalizedName = userName?.trim() || null;

    return {
      state: {
        activeOrganizationId,
        userEmail: normalizedEmail,
        userName: normalizedName,
      },
      meta: {
        displayName: normalizedName || normalizedEmail || "Signed in",
      },
    };
  }, [activeOrganizationId, userEmail, userName]);

  return (
    <WorkspaceSessionContext.Provider value={value}>
      {children}
    </WorkspaceSessionContext.Provider>
  );
}

export function useWorkspaceSession() {
  const context = useContext(WorkspaceSessionContext);

  if (!context) {
    throw new Error(
      "useWorkspaceSession must be used within WorkspaceSessionProvider."
    );
  }

  return context;
}
