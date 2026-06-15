import { getUserAuthAuditLogs } from "../auth-audit-log.server";
import { currentUser } from "../server";
import { AuthAuditLogPanel } from "./auth-audit-log-panel";

export const AuthAuditLogSection = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const entries = await getUserAuthAuditLogs(user.id);

  return <AuthAuditLogPanel entries={entries} />;
};
