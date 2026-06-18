"use client";

import { cn, recipe } from "@repo/design-system";
import { useId } from "react";
import {
  type AuthAuditLogEntry,
  formatAuthAuditAction,
} from "../auth-audit-log.shared";
import { AuthSection, AuthSectionHeader } from "./auth-section";

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

interface AuthAuditLogPanelProperties {
  readonly entries: AuthAuditLogEntry[];
}

export const AuthAuditLogPanel = ({ entries }: AuthAuditLogPanelProperties) => {
  const titleId = useId();

  return (
    <AuthSection aria-labelledby={titleId}>
      <AuthSectionHeader
        description="Pulled from Supabase Auth audit logs for your account. Session IP is shown for sign-in events when the audit row omits it."
        title="Recent sign-in activity"
        titleId={titleId}
      />
      {entries.length === 0 ? (
        <p className={recipe("captionText")}>No auth events recorded yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-[var(--xforge-radius-md)] border border-border-default">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <caption className="sr-only">Recent sign-in activity</caption>
            <thead>
              <tr className="border-border-default border-b bg-surface-subtle">
                <th
                  className={cn("px-4 py-2 font-medium", recipe("captionText"))}
                  scope="col"
                >
                  When
                </th>
                <th
                  className={cn("px-4 py-2 font-medium", recipe("captionText"))}
                  scope="col"
                >
                  Event
                </th>
                <th
                  className={cn("px-4 py-2 font-medium", recipe("captionText"))}
                  scope="col"
                >
                  IP
                </th>
                <th
                  className={cn("px-4 py-2 font-medium", recipe("captionText"))}
                  scope="col"
                >
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
                  <td className="whitespace-nowrap px-4 py-3 align-top tabular-nums">
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
    </AuthSection>
  );
};
