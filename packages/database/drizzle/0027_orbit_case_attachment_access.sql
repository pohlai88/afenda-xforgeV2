-- Orbit Case attachment blob access (public link vs org-authenticated private)

ALTER TABLE "next_forge"."orbit_case_attachments"
  ADD COLUMN IF NOT EXISTS "blobAccess" text NOT NULL DEFAULT 'public';
