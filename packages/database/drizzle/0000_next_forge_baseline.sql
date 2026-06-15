-- Baseline: next_forge schema with organizations and organization_members (applied via Supabase MCP prior to Drizzle).
CREATE SCHEMA IF NOT EXISTS "next_forge";

CREATE TABLE IF NOT EXISTS "next_forge"."organizations" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" timestamp(3) NOT NULL
);

CREATE TABLE IF NOT EXISTS "next_forge"."organization_members" (
  "id" text PRIMARY KEY NOT NULL,
  "userId" text NOT NULL,
  "organizationId" text NOT NULL,
  "role" text DEFAULT 'member' NOT NULL,
  "createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" timestamp(3) NOT NULL,
  CONSTRAINT "organization_members_organizationId_fkey"
    FOREIGN KEY ("organizationId")
    REFERENCES "next_forge"."organizations"("id")
    ON DELETE cascade
);
