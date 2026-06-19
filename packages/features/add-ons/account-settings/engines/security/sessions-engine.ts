import "server-only";

import { currentUser } from "@repo/auth/server";
import type { ActiveSessionRecord } from "../../contract/account-settings.types";

export const listActiveSessions = async (
  userId: string
): Promise<readonly ActiveSessionRecord[]> => {
  const user = await currentUser();

  if (!user || user.id !== userId) {
    return [];
  }

  // Session listing requires Supabase Auth admin API wiring in a follow-up migration.
  return [];
};

export const revokeSession = async (
  userId: string,
  sessionId: string
): Promise<boolean> => {
  const user = await currentUser();

  if (!user || user.id !== userId) {
    return false;
  }

  if (!sessionId.trim()) {
    return false;
  }

  // Session revocation requires Supabase Auth admin API wiring in a follow-up migration.
  return false;
};
