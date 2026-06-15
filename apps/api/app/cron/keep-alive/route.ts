import {
  apiOk,
  methodNotAllowed,
  requireCronSecret,
  withApiRoute,
} from "@repo/api";
import { database } from "@repo/database";
import { page } from "@repo/database/schema";
import { eq } from "drizzle-orm";

export const GET = withApiRoute(async (request) => {
  requireCronSecret(request);

  const [newPage] = await database
    .insert(page)
    .values({
      name: "cron-temp",
    })
    .returning();

  await database.delete(page).where(eq(page.id, newPage.id));

  return apiOk({ status: "ok" });
});

export const POST = (): Response => methodNotAllowed(["GET"]);
