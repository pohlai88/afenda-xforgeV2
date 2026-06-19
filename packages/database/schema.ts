import { relations } from "drizzle-orm";
import {
  boolean,
  index,
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
  recentFailures: integer("recentFailures").default(0).notNull(),
  disabledUntil: timestamp("disabledUntil", { precision: 3, mode: "date" }),
  kind: text("kind").default("customer").notNull(),
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

export const webhookDeliveryRelations = relations(
  webhookDelivery,
  ({ one }) => ({
    organization: one(organization, {
      fields: [webhookDelivery.organizationId],
      references: [organization.id],
    }),
    endpoint: one(webhookEndpoint, {
      fields: [webhookDelivery.endpointId],
      references: [webhookEndpoint.id],
    }),
  })
);

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
    status: text("status")
      .$type<CmsDocumentStatus>()
      .notNull()
      .default("draft"),
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

export const orbitCaseStatuses = [
  "backlog",
  "ready",
  "doing",
  "waiting",
  "done",
  "cancelled",
] as const;

export type OrbitCaseStatusDb = (typeof orbitCaseStatuses)[number];

export const orbitCasePriorities = [
  "none",
  "low",
  "medium",
  "high",
  "urgent",
] as const;

export type OrbitCasePriorityDb = (typeof orbitCasePriorities)[number];

export const orbitCase = nextForge.table("orbit_cases", {
  id: text("id").primaryKey(),
  organizationId: text("organizationId")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status")
    .$type<OrbitCaseStatusDb>()
    .notNull()
    .default("backlog"),
  priority: text("priority")
    .$type<OrbitCasePriorityDb>()
    .notNull()
    .default("none"),
  ownerId: text("ownerId"),
  assigneeId: text("assigneeId"),
  dueAt: timestamp("dueAt", { precision: 3, mode: "date" }),
  createdBy: text("createdBy").notNull(),
  softDeletedAt: timestamp("softDeletedAt", { precision: 3, mode: "date" }),
  createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" }).notNull(),
});

export const orbitCaseWatcher = nextForge.table(
  "orbit_case_watchers",
  {
    id: text("id").primaryKey(),
    caseId: text("caseId")
      .notNull()
      .references(() => orbitCase.id, { onDelete: "cascade" }),
    organizationId: text("organizationId")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    userId: text("userId").notNull(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    unique("orbit_case_watchers_case_user_unique").on(
      table.caseId,
      table.userId
    ),
  ]
);

export const orbitCaseComment = nextForge.table("orbit_case_comments", {
  id: text("id").primaryKey(),
  caseId: text("caseId")
    .notNull()
    .references(() => orbitCase.id, { onDelete: "cascade" }),
  organizationId: text("organizationId")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  authorId: text("authorId").notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
    .defaultNow()
    .notNull(),
});

export const orbitCaseTag = nextForge.table(
  "orbit_case_tags",
  {
    id: text("id").primaryKey(),
    caseId: text("caseId")
      .notNull()
      .references(() => orbitCase.id, { onDelete: "cascade" }),
    organizationId: text("organizationId")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    tag: text("tag").notNull(),
  },
  (table) => [
    unique("orbit_case_tags_case_tag_unique").on(table.caseId, table.tag),
  ]
);

export const orbitCaseActivity = nextForge.table("orbit_case_activity", {
  id: text("id").primaryKey(),
  caseId: text("caseId")
    .notNull()
    .references(() => orbitCase.id, { onDelete: "cascade" }),
  organizationId: text("organizationId")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  actorId: text("actorId").notNull(),
  action: text("action").notNull(),
  payload: jsonb("payload").notNull().default({}),
  createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
    .defaultNow()
    .notNull(),
});

export const orbitCaseAttachment = nextForge.table(
  "orbit_case_attachments",
  {
    id: text("id").primaryKey(),
    caseId: text("caseId")
      .notNull()
      .references(() => orbitCase.id, { onDelete: "cascade" }),
    organizationId: text("organizationId")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    uploadedBy: text("uploadedBy").notNull(),
    fileName: text("fileName").notNull(),
    contentType: text("contentType").notNull(),
    sizeBytes: integer("sizeBytes").notNull(),
    blobUrl: text("blobUrl").notNull(),
    blobPathname: text("blobPathname").notNull(),
    blobAccess: text("blobAccess").notNull().default("public"),
    createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("orbit_case_attachments_org_case_created_idx").on(
      table.organizationId,
      table.caseId,
      table.createdAt
    ),
  ]
);

export const orbitCaseRelations = relations(orbitCase, ({ one, many }) => ({
  organization: one(organization, {
    fields: [orbitCase.organizationId],
    references: [organization.id],
  }),
  watchers: many(orbitCaseWatcher),
  comments: many(orbitCaseComment),
  tags: many(orbitCaseTag),
  activity: many(orbitCaseActivity),
  attachments: many(orbitCaseAttachment),
}));

export const orbitPushEventStatuses = [
  "pending",
  "completed",
  "failed",
] as const;

export type OrbitPushEventStatusDb =
  (typeof orbitPushEventStatuses)[number];

export const orbitPushDestination = nextForge.table(
  "orbit_push_destinations",
  {
    id: text("id").primaryKey(),
    organizationId: text("organizationId").references(() => organization.id, {
      onDelete: "cascade",
    }),
    destinationId: text("destinationId").notNull(),
    label: text("label").notNull(),
    templateId: text("templateId").notNull(),
    requiredCapabilities: jsonb("requiredCapabilities")
      .notNull()
      .default([]),
    visibleToRoles: jsonb("visibleToRoles").notNull().default([]),
    enabled: boolean("enabled").notNull().default(true),
    createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" }).notNull(),
  },
  (table) => [
    unique("orbit_push_destinations_org_destination_unique").on(
      table.organizationId,
      table.destinationId
    ),
  ]
);

export const orbitPushTemplate = nextForge.table("orbit_push_templates", {
  id: text("id").primaryKey(),
  organizationId: text("organizationId").references(() => organization.id, {
    onDelete: "cascade",
  }),
  destinationId: text("destinationId").notNull(),
  label: text("label").notNull(),
  fields: jsonb("fields").notNull().default([]),
  createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" }).notNull(),
});

export const orbitPushEvent = nextForge.table(
  "orbit_push_events",
  {
    id: text("id").primaryKey(),
    organizationId: text("organizationId")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    caseId: text("caseId")
      .notNull()
      .references(() => orbitCase.id, { onDelete: "cascade" }),
    destinationId: text("destinationId").notNull(),
    actorId: text("actorId").notNull(),
    idempotencyKey: text("idempotencyKey").notNull(),
    status: text("status")
      .$type<OrbitPushEventStatusDb>()
      .notNull()
      .default("pending"),
    result: jsonb("result"),
    createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" }).notNull(),
  },
  (table) => [
    unique("orbit_push_events_idempotency_key_unique").on(
      table.idempotencyKey
    ),
  ]
);

export const orbitObjectLink = nextForge.table("orbit_object_links", {
  id: text("id").primaryKey(),
  organizationId: text("organizationId")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  originCaseId: text("originCaseId")
    .notNull()
    .references(() => orbitCase.id, { onDelete: "cascade" }),
  pushEventId: text("pushEventId")
    .notNull()
    .references(() => orbitPushEvent.id, { onDelete: "cascade" }),
  targetType: text("targetType").notNull(),
  targetId: text("targetId").notNull(),
  payload: jsonb("payload").notNull().default({}),
  createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
    .defaultNow()
    .notNull(),
});

export const orbitBudgetRequest = nextForge.table("orbit_budget_requests", {
  id: text("id").primaryKey(),
  organizationId: text("organizationId")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  originCaseId: text("originCaseId")
    .notNull()
    .references(() => orbitCase.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  amount: text("amount"),
  currency: text("currency"),
  costCenter: text("costCenter"),
  justification: text("justification"),
  externalRefId: text("externalRefId"),
  status: text("status").notNull().default("submitted"),
  assigneeId: text("assigneeId"),
  createdBy: text("createdBy").notNull(),
  createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
    .defaultNow()
    .notNull(),
});

export const orbitMeetingRequest = nextForge.table("orbit_meeting_requests", {
  id: text("id").primaryKey(),
  organizationId: text("organizationId")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  originCaseId: text("originCaseId")
    .notNull()
    .references(() => orbitCase.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  scheduledAt: text("scheduledAt"),
  location: text("location"),
  status: text("status").notNull().default("submitted"),
  assigneeId: text("assigneeId"),
  createdBy: text("createdBy").notNull(),
  createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
    .defaultNow()
    .notNull(),
});

export const orbitApprovalRequest = nextForge.table("orbit_approval_requests", {
  id: text("id").primaryKey(),
  organizationId: text("organizationId")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  originCaseId: text("originCaseId")
    .notNull()
    .references(() => orbitCase.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  approver: text("approver"),
  amount: text("amount"),
  dueDate: text("dueDate"),
  decisionNotes: text("decisionNotes"),
  externalRefId: text("externalRefId"),
  status: text("status").notNull().default("submitted"),
  assigneeId: text("assigneeId"),
  createdBy: text("createdBy").notNull(),
  createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
    .defaultNow()
    .notNull(),
});

const morphTwoFieldTable = (
  tableName: string,
  fieldA: string,
  fieldB: string
) =>
  nextForge.table(tableName, {
    id: text("id").primaryKey(),
    organizationId: text("organizationId")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    originCaseId: text("originCaseId")
      .notNull()
      .references(() => orbitCase.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    [fieldA]: text(fieldA),
    [fieldB]: text(fieldB),
    status: text("status").notNull().default("submitted"),
    assigneeId: text("assigneeId"),
    createdBy: text("createdBy").notNull(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
      .defaultNow()
      .notNull(),
  });

export const orbitPurchaseRequest = nextForge.table("orbit_purchase_requests", {
  id: text("id").primaryKey(),
  organizationId: text("organizationId")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  originCaseId: text("originCaseId")
    .notNull()
    .references(() => orbitCase.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  vendor: text("vendor"),
  amount: text("amount"),
  poReference: text("poReference"),
  externalRefId: text("externalRefId"),
  status: text("status").notNull().default("submitted"),
  assigneeId: text("assigneeId"),
  createdBy: text("createdBy").notNull(),
  createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
    .defaultNow()
    .notNull(),
});
export const orbitLeadRequest = morphTwoFieldTable(
  "orbit_lead_requests",
  "contact",
  "company"
);
export const orbitComplaintRequest = morphTwoFieldTable(
  "orbit_complaint_requests",
  "category",
  "severity"
);
export const orbitRiskRequest = morphTwoFieldTable(
  "orbit_risk_requests",
  "riskLevel",
  "owner"
);
export const orbitProjectRequest = morphTwoFieldTable(
  "orbit_project_requests",
  "startDate",
  "budget"
);
export const orbitInvestigationRequest = morphTwoFieldTable(
  "orbit_investigation_requests",
  "subject",
  "priority"
);
export const orbitCapaRequest = morphTwoFieldTable(
  "orbit_capa_requests",
  "rootCause",
  "dueDate"
);
export const orbitContractReviewRequest = morphTwoFieldTable(
  "orbit_contract_review_requests",
  "counterparty",
  "expiryDate"
);

export const orbitInAppNotification = nextForge.table(
  "orbit_in_app_notifications",
  {
    id: text("id").primaryKey(),
    organizationId: text("organizationId")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    userId: text("userId").notNull(),
    kind: text("kind").notNull(),
    title: text("title").notNull(),
    body: text("body"),
    href: text("href").notNull(),
    readAt: timestamp("readAt", { precision: 3, mode: "date" }),
    payload: jsonb("payload").notNull().default({}),
    createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
      .defaultNow()
      .notNull(),
  }
);
