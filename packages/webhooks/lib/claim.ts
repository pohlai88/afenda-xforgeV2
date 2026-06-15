import "server-only";

import { database } from "@repo/database";
import { webhookDelivery } from "@repo/database/schema";
import { and, eq, lte, or } from "drizzle-orm";

/** Prevents concurrent workers from delivering the same row. */
export const CLAIM_LEASE_MS = 120_000;

export const tryClaimDelivery = async (
  deliveryId: string,
  now: Date
): Promise<typeof webhookDelivery.$inferSelect | null> => {
  const leaseUntil = new Date(now.getTime() + CLAIM_LEASE_MS);

  const [claimed] = await database
    .update(webhookDelivery)
    .set({ nextAttemptAt: leaseUntil })
    .where(
      and(
        eq(webhookDelivery.id, deliveryId),
        or(
          eq(webhookDelivery.status, "pending"),
          eq(webhookDelivery.status, "retrying")
        ),
        lte(webhookDelivery.nextAttemptAt, now)
      )
    )
    .returning();

  return claimed ?? null;
};
