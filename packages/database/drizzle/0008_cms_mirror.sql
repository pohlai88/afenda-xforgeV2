CREATE TABLE IF NOT EXISTS "next_forge"."cms_documents" (
  "id" text PRIMARY KEY NOT NULL,
  "collection" text NOT NULL,
  "slug" text NOT NULL,
  "locale" text DEFAULT 'en' NOT NULL,
  "title" text NOT NULL,
  "description" text,
  "status" text DEFAULT 'draft' NOT NULL,
  "frontmatter" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "bodyMdx" text NOT NULL,
  "publishedAt" timestamp(3),
  "createdAt" timestamp(3) DEFAULT now() NOT NULL,
  "updatedAt" timestamp(3) NOT NULL,
  CONSTRAINT "cms_documents_collection_slug_locale_unique"
    UNIQUE ("collection", "slug", "locale")
);

CREATE INDEX IF NOT EXISTS "cms_documents_collection_status_idx"
  ON "next_forge"."cms_documents" ("collection", "status");

CREATE INDEX IF NOT EXISTS "cms_documents_locale_idx"
  ON "next_forge"."cms_documents" ("locale");

ALTER TABLE "next_forge"."cms_documents"
  ADD COLUMN IF NOT EXISTS "search_vector" tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce("title", '')), 'A') ||
    setweight(to_tsvector('english', coalesce("description", '')), 'B') ||
    setweight(to_tsvector('english', coalesce("bodyMdx", '')), 'C')
  ) STORED;

CREATE INDEX IF NOT EXISTS "cms_documents_search_vector_idx"
  ON "next_forge"."cms_documents" USING GIN ("search_vector");

CREATE TABLE IF NOT EXISTS "next_forge"."cms_document_revisions" (
  "id" text PRIMARY KEY NOT NULL,
  "documentId" text REFERENCES "next_forge"."cms_documents"("id") ON DELETE SET NULL,
  "collection" text NOT NULL,
  "slug" text NOT NULL,
  "locale" text NOT NULL,
  "action" text NOT NULL,
  "title" text,
  "status" text,
  "occurredAt" timestamp(3) DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "cms_document_revisions_document_occurred_idx"
  ON "next_forge"."cms_document_revisions" ("documentId", "occurredAt" DESC);

CREATE INDEX IF NOT EXISTS "cms_document_revisions_collection_slug_locale_idx"
  ON "next_forge"."cms_document_revisions" ("collection", "slug", "locale", "occurredAt" DESC);

ALTER TABLE "next_forge"."cms_documents" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "next_forge"."cms_document_revisions" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cms_documents_select_authenticated" ON "next_forge"."cms_documents";
CREATE POLICY "cms_documents_select_authenticated"
  ON "next_forge"."cms_documents"
  FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "cms_document_revisions_select_authenticated" ON "next_forge"."cms_document_revisions";
CREATE POLICY "cms_document_revisions_select_authenticated"
  ON "next_forge"."cms_document_revisions"
  FOR SELECT TO authenticated
  USING (true);
