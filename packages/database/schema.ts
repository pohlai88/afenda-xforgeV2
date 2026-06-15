import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgSchema,
  serial,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

const nextForge = pgSchema("next_forge");

export const page = nextForge.table("pages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const organization = nextForge.table("organizations", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" }).notNull(),
});

export const organizationMember = nextForge.table("organization_members", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull(),
  organizationId: text("organizationId")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  role: text("role").default("member").notNull(),
  createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" }).notNull(),
});

export const organizationRelations = relations(organization, ({ many }) => ({
  members: many(organizationMember),
}));

export const organizationMemberRelations = relations(
  organizationMember,
  ({ one }) => ({
    organization: one(organization, {
      fields: [organizationMember.organizationId],
      references: [organization.id],
    }),
  })
);

export const webhookDeliveryStatuses = [
  "pending",
  "delivered",
  "retrying",
  "failed",
] as const;

export type WebhookDeliveryStatus = (typeof webhookDeliveryStatuses)[number];

export const webhookEndpoint = nextForge.table("webhook_endpoints", {
  id: text("id").primaryKey(),
  organizationId: text("organizationId")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  secret: text("secret").notNull(),
  secretPrevious: text("secretPrevious"),
  secretPreviousExpiresAt: timestamp("secretPreviousExpiresAt", {
    precision: 3,
    mode: "date",
  }),
  enabled: boolean("enabled").default(true).notNull(),
  events: text("events").array().notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" }).notNull(),
});

export const webhookDelivery = nextForge.table("webhook_deliveries", {
  id: text("id").primaryKey(),
  eventId: text("eventId").notNull(),
  organizationId: text("organizationId")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  endpointId: text("endpointId")
    .notNull()
    .references(() => webhookEndpoint.id, { onDelete: "cascade" }),
  eventType: text("eventType").notNull(),
  payload: jsonb("payload").notNull(),
  status: text("status").$type<WebhookDeliveryStatus>().notNull(),
  attempts: integer("attempts").default(0).notNull(),
  nextAttemptAt: timestamp("nextAttemptAt", { precision: 3, mode: "date" })
    .defaultNow()
    .notNull(),
  lastError: text("lastError"),
  responseStatus: integer("responseStatus"),
  responseBody: text("responseBody"),
  createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
    .defaultNow()
    .notNull(),
  deliveredAt: timestamp("deliveredAt", { precision: 3, mode: "date" }),
});

export const webhookEndpointRelations = relations(
  webhookEndpoint,
  ({ one, many }) => ({
    organization: one(organization, {
      fields: [webhookEndpoint.organizationId],
      references: [organization.id],
    }),
    deliveries: many(webhookDelivery),
  })
);

export const webhookDeliveryRelations = relations(webhookDelivery, ({ one }) => ({
  organization: one(organization, {
    fields: [webhookDelivery.organizationId],
    references: [organization.id],
  }),
  endpoint: one(webhookEndpoint, {
    fields: [webhookDelivery.endpointId],
    references: [webhookEndpoint.id],
  }),
}));

export const cmsDocumentStatuses = ["draft", "published"] as const;

export type CmsDocumentStatus = (typeof cmsDocumentStatuses)[number];

export const cmsDocumentRevisionActions = [
  "published",
  "updated",
  "unpublished",
  "deleted",
] as const;

export type CmsDocumentRevisionAction =
  (typeof cmsDocumentRevisionActions)[number];

export const cmsDocument = nextForge.table(
  "cms_documents",
  {
    id: text("id").primaryKey(),
    collection: text("collection").notNull(),
    slug: text("slug").notNull(),
    locale: text("locale").notNull().default("en"),
    title: text("title").notNull(),
    description: text("description"),
    status: text("status").$type<CmsDocumentStatus>().notNull().default("draft"),
    frontmatter: jsonb("frontmatter").notNull().default({}),
    bodyMdx: text("bodyMdx").notNull(),
    publishedAt: timestamp("publishedAt", { precision: 3, mode: "date" }),
    createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" }).notNull(),
  },
  (table) => [
    unique("cms_documents_collection_slug_locale_unique").on(
      table.collection,
      table.slug,
      table.locale
    ),
  ]
);

export const cmsDocumentRevision = nextForge.table("cms_document_revisions", {
  id: text("id").primaryKey(),
  documentId: text("documentId").references(() => cmsDocument.id, {
    onDelete: "set null",
  }),
  collection: text("collection").notNull(),
  slug: text("slug").notNull(),
  locale: text("locale").notNull(),
  action: text("action").$type<CmsDocumentRevisionAction>().notNull(),
  title: text("title"),
  status: text("status"),
  occurredAt: timestamp("occurredAt", { precision: 3, mode: "date" })
    .defaultNow()
    .notNull(),
});

export const cmsDocumentRelations = relations(cmsDocument, ({ many }) => ({
  revisions: many(cmsDocumentRevision),
}));

export const cmsDocumentRevisionRelations = relations(
  cmsDocumentRevision,
  ({ one }) => ({
    document: one(cmsDocument, {
      fields: [cmsDocumentRevision.documentId],
      references: [cmsDocument.id],
    }),
  })
);
