import { relations } from "drizzle-orm";
import { pgSchema, serial, text, timestamp } from "drizzle-orm/pg-core";

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
