import "server-only";

import { database } from "@repo/database";
import { sql } from "drizzle-orm";
import type { AuthAuditLogEntry } from "./auth-audit-log.shared";

export type { AuthAuditLogEntry } from "./auth-audit-log.shared";
export { formatAuthAuditAction } from "./auth-audit-log.shared";

type AuditLogRow = {
  id: string;
  created_at: string;
  action: string | null;
  audit_ip: string | null;
  session_ip: string | null;
  session_user_agent: string | null;
};

/**
 * Recent Supabase Auth audit events for the signed-in user.
 * IP/user-agent are joined from auth.sessions when audit rows omit them (known GoTrue gap).
 */
export const getUserAuthAuditLogs = async (
  userId: string,
  limit = 25
): Promise<AuthAuditLogEntry[]> => {
  const result = await database.execute<AuditLogRow>(sql`
    SELECT
      ale.id::text AS id,
      ale.created_at::text AS created_at,
      ale.payload->>'action' AS action,
      NULLIF(TRIM(ale.ip_address), '') AS audit_ip,
      s.ip AS session_ip,
      s.user_agent AS session_user_agent
    FROM auth.audit_log_entries ale
    LEFT JOIN LATERAL (
      SELECT ses.ip, ses.user_agent
      FROM auth.sessions ses
      WHERE ses.user_id = ${userId}::uuid
        AND ses.created_at BETWEEN ale.created_at - interval '10 seconds'
          AND ale.created_at + interval '60 seconds'
      ORDER BY abs(extract(epoch FROM (ses.created_at - ale.created_at)))
      LIMIT 1
    ) s ON ale.payload->>'action' IN (
      'login',
      'token_refreshed',
      'mfa_code_login',
      'logout'
    )
    WHERE ale.payload->>'actor_id' = ${userId}
    ORDER BY ale.created_at DESC
    LIMIT ${limit}
  `);

  return result.rows.map((row) => ({
    id: row.id,
    createdAt: row.created_at,
    action: row.action ?? "unknown",
    ipAddress: row.session_ip ?? row.audit_ip,
    userAgent: row.session_user_agent,
  }));
};
