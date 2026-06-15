ALTER TABLE "next_forge"."webhook_endpoints"
  ADD COLUMN IF NOT EXISTS "recentFailures" integer DEFAULT 0 NOT NULL;

ALTER TABLE "next_forge"."webhook_endpoints"
  ADD COLUMN IF NOT EXISTS "disabledUntil" timestamp(3);

ALTER TABLE "next_forge"."webhook_endpoints"
  ADD COLUMN IF NOT EXISTS "kind" text DEFAULT 'customer' NOT NULL;
