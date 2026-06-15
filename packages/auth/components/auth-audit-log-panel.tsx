"use client";

import { cn, recipe } from "@repo/design-system/design-system";
import {
  formatAuthAuditAction,
  type AuthAuditLogEntry,
} from "../auth-audit-log.shared";

const formatWhen = (iso: string) => {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return iso;
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const truncateAgent = (value: string | null) => {
  if (!value) {
    return "—";
  }

  return value.length > 72 ? `${value.slice(0, 69)}…` : value;
};

export const AuthAuditLogPanel = ({
  entries,
}: {
  entries: AuthAuditLogEntry[];
}) => (
  <section className={cn("flex flex-col", recipe("sectionGap"))}>
    <div className="flex flex-col gap-1">
      <h2 className="font-medium text-text-primary">Recent sign-in activity</h2>
      <p className={recipe("captionText")}>
        Pulled from Supabase Auth audit logs for your account. Session IP is
        shown for sign-in events when the audit row omits it.
      </p>
    </div>
    {entries.length === 0 ? (
      <p className={recipe("captionText")}>No auth events recorded yet.</p>
    ) : (
      <div className="overflow-x-auto rounded-[var(--xforge-radius-md)] border border-border-default">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <thead>
            <tr className="border-border-default border-b bg-surface-subtle">
              <th className={cn("px-4 py-2 font-medium", recipe("captionText"))}>
                When
              </th>
              <th className={cn("px-4 py-2 font-medium", recipe("captionText"))}>
                Event
              </th>
              <th className={cn("px-4 py-2 font-medium", recipe("captionText"))}>
                IP
              </th>
              <th className={cn("px-4 py-2 font-medium", recipe("captionText"))}>
                Device
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr
                className="border-border-default border-b last:border-b-0"
                key={entry.id}
              >
                <td className="px-4 py-3 align-top whitespace-nowrap">
                  {formatWhen(entry.createdAt)}
                </td>
                <td className="px-4 py-3 align-top">
                  {formatAuthAuditAction(entry.action)}
                </td>
                <td className="px-4 py-3 align-top font-mono text-xs">
                  {entry.ipAddress ?? "—"}
                </td>
                <td
                  className="max-w-[14rem] truncate px-4 py-3 align-top text-xs"
                  title={entry.userAgent ?? undefined}
                >
                  {truncateAgent(entry.userAgent)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </section>
);
