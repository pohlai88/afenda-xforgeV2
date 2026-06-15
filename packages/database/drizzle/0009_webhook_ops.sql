ALTER TABLE "next_forge"."webhook_endpoints"
  ADD COLUMN IF NOT EXISTS "secretPrevious" text,
  ADD COLUMN IF NOT EXISTS "secretPreviousExpiresAt" timestamp(3);

ALTER TABLE "next_forge"."webhook_deliveries"
  ADD COLUMN IF NOT EXISTS "responseBody" text;
