import "server-only";

import type { User } from "@supabase/supabase-js";
import { createAdminClient } from "./server";

export type AdminUserSummary = {
  id: string;
  email: string | null;
  displayName: string | null;
  createdAt: string | null;
  lastSignInAt: string | null;
  emailConfirmed: boolean;
};

const mapAdminUser = (user: User): AdminUserSummary => ({
  id: user.id,
  email: user.email ?? null,
  displayName:
    typeof user.user_metadata?.name === "string"
      ? user.user_metadata.name
      : null,
  createdAt: user.created_at ?? null,
  lastSignInAt: user.last_sign_in_at ?? null,
  emailConfirmed: Boolean(user.email_confirmed_at),
});

/** Paginate through all Auth users (server-only — requires secret key). */
export const listAllAuthUsers = async (): Promise<AdminUserSummary[]> => {
  const admin = createAdminClient();
  const users: AdminUserSummary[] = [];
  let page = 1;
  const perPage = 200;

  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });

    if (error) {
      throw new Error(error.message);
    }

    for (const user of data.users) {
      users.push(mapAdminUser(user));
    }

    if (data.users.length < perPage) {
      break;
    }

    page += 1;
  }

  return users;
};

/** Delete an Auth user by id. JWTs remain valid until expiry — sign out client sessions separately. */
export const deleteAuthUser = async (userId: string) => {
  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(userId);

  if (error) {
    throw new Error(error.message);
  }
};

export const usersToCsv = (users: AdminUserSummary[]): string => {
  const header = [
    "id",
    "email",
    "display_name",
    "created_at",
    "last_sign_in_at",
    "email_confirmed",
  ];

  const escape = (value: string) =>
    `"${value.replaceAll('"', '""')}"`;

  const rows = users.map((user) =>
    [
      user.id,
      user.email ?? "",
      user.displayName ?? "",
      user.createdAt ?? "",
      user.lastSignInAt ?? "",
      user.emailConfirmed ? "true" : "false",
    ]
      .map(escape)
      .join(",")
  );

  return [header.join(","), ...rows].join("\n");
};
