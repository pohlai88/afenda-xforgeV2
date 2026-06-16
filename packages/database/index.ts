import "server-only";

import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { keys } from "./keys";
import {
  cmsDocument,
  cmsDocumentRelations,
  cmsDocumentRevision,
  cmsDocumentRevisionActions,
  cmsDocumentRevisionRelations,
  cmsDocumentStatuses,
  orbitCase,
  orbitCaseActivity,
  orbitCaseComment,
  orbitCasePriorities,
  orbitCaseRelations,
  orbitCaseStatuses,
  orbitCaseTag,
  orbitCaseWatcher,
  organization,
  organizationMember,
  organizationMemberRelations,
  organizationRelations,
  page,
  webhookDelivery,
  webhookDeliveryRelations,
  webhookDeliveryStatuses,
  webhookEndpoint,
  webhookEndpointRelations,
} from "./schema";

const schema = {
  cmsDocument,
  cmsDocumentRelations,
  cmsDocumentRevision,
  cmsDocumentRevisionActions,
  cmsDocumentRevisionRelations,
  cmsDocumentStatuses,
  orbitCase,
  orbitCaseActivity,
  orbitCaseComment,
  orbitCasePriorities,
  orbitCaseRelations,
  orbitCaseStatuses,
  orbitCaseTag,
  orbitCaseWatcher,
  organization,
  organizationMember,
  organizationMemberRelations,
  organizationRelations,
  page,
  webhookDelivery,
  webhookDeliveryRelations,
  webhookDeliveryStatuses,
  webhookEndpoint,
  webhookEndpointRelations,
};

const globalForDrizzle = global as unknown as { pool: pg.Pool | undefined };

const pool =
  globalForDrizzle.pool ??
  new pg.Pool({
    connectionString: keys().DATABASE_URL,
    max: process.env.NODE_ENV === "production" ? 10 : 1,
  });

export const database = drizzle(pool, { schema });

if (process.env.NODE_ENV !== "production") {
  globalForDrizzle.pool = pool;
}

export * from "./schema";
