import { randomUUID } from "node:crypto";
import { e2eEmail } from "./credentials";
import { loadE2eEnv } from "./load-env";
import { getE2eUserHealth } from "./supabase-admin";

interface SeedOrbitNotificationInput {
  readonly body?: string;
  readonly href: string;
  readonly title: string;
}

interface SeededOrbitNotification {
  readonly body?: string;
  readonly href: string;
  readonly id: string;
  readonly title: string;
}

const loadE2eDatabase = async () => {
  loadE2eEnv();
  const { Pool } = await import("pg");
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("Orbit notification E2E helper requires DATABASE_URL.");
  }

  return new Pool({ connectionString, max: 1 });
};

export const seedOrbitNotificationForE2eUser = async ({
  body,
  href,
  title,
}: SeedOrbitNotificationInput): Promise<SeededOrbitNotification> => {
  const health = await getE2eUserHealth(e2eEmail);

  if (!(health.userId && health.organizationId)) {
    throw new Error(
      `E2E user ${e2eEmail} must have a user id and organization membership before seeding notifications.`
    );
  }

  const notification: SeededOrbitNotification = {
    body,
    href,
    id: `e2e-${randomUUID()}`,
    title,
  };

  const pool = await loadE2eDatabase();
  await pool.query(
    `
      insert into next_forge.orbit_in_app_notifications
        ("id", "organizationId", "userId", "kind", "title", "body", "href", "payload")
      values
        ($1, $2, $3, $4, $5, $6, $7, $8::jsonb)
    `,
    [
      notification.id,
      health.organizationId,
      health.userId,
      "orbit.case.assigned",
      title,
      body ?? null,
      href,
      JSON.stringify({ source: "playwright" }),
    ]
  );
  await pool.end();

  return notification;
};

export const getOrbitNotificationReadAt = async (
  notificationId: string
): Promise<string | null> => {
  const pool = await loadE2eDatabase();
  const result = await pool.query<{ readAt: Date | null }>(
    `
      select "readAt"
      from next_forge.orbit_in_app_notifications
      where "id" = $1
      limit 1
    `,
    [notificationId]
  );
  await pool.end();

  return result.rows[0]?.readAt?.toISOString() ?? null;
};
