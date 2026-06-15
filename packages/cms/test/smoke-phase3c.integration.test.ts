import { createId } from "@paralleldrive/cuid2";
import { database } from "@repo/database";
import {
  cmsDocument,
  cmsDocumentRevision,
} from "@repo/database/schema";
import { and, eq } from "drizzle-orm";
import { afterAll, describe, expect, it } from "vitest";
import { deleteDocumentMirror } from "../sync/delete-mirror";
import { searchDocumentMirror } from "../sync/search-mirror";
import { upsertDocumentMirror } from "../sync/upsert-mirror";

const hasDatabase = Boolean(
  process.env.DATABASE_URL ?? process.env.DIRECT_URL
);

const smokeSlug = `phase3c-smoke-${createId()}`;
const smokeToken = `xforgeftstoken${createId().replace(/-/g, "")}`;

describe.skipIf(!hasDatabase)("Phase 3C CMS mirror smoke", () => {
  afterAll(async () => {
    await deleteDocumentMirror({
      collection: "blog",
      slug: smokeSlug,
      locale: "en",
      title: "Phase 3C smoke",
      status: "published",
    });

    await database
      .delete(cmsDocumentRevision)
      .where(
        and(
          eq(cmsDocumentRevision.collection, "blog"),
          eq(cmsDocumentRevision.slug, smokeSlug),
          eq(cmsDocumentRevision.locale, "en")
        )
      );
  });

  it("upserts a published document into the mirror", async () => {
    const documentId = await upsertDocumentMirror({
      collection: "blog",
      slug: smokeSlug,
      locale: "en",
      title: "Phase 3C smoke",
      description: "Integration smoke for Postgres CMS mirror",
      status: "published",
      frontmatter: {
        title: "Phase 3C smoke",
        status: "published",
        date: "2026-06-15",
      },
      bodyMdx: `# Mirror smoke\n\nUnique search token: ${smokeToken}`,
      publishedAt: new Date("2026-06-15"),
      revisionAction: "published",
    });

    expect(documentId).toBeTruthy();

    const [row] = await database
      .select()
      .from(cmsDocument)
      .where(
        and(
          eq(cmsDocument.collection, "blog"),
          eq(cmsDocument.slug, smokeSlug),
          eq(cmsDocument.locale, "en")
        )
      );

    expect(row?.status).toBe("published");
    expect(row?.title).toBe("Phase 3C smoke");
  });

  it("finds mirrored content via full-text search", async () => {
    const hits = await searchDocumentMirror({
      query: smokeToken,
      collection: "blog",
      locale: "en",
      limit: 10,
    });

    expect(hits.length).toBeGreaterThan(0);

    const match = hits.find((hit) => hit.slug === smokeSlug);

    expect(match).toBeDefined();
    expect(match?.title).toBe("Phase 3C smoke");
    expect(match?.rank).toBeGreaterThan(0);
  });

  it("scopes search by collection and locale", async () => {
    const wrongLocale = await searchDocumentMirror({
      query: smokeToken,
      collection: "blog",
      locale: "es",
      limit: 10,
    });

    expect(wrongLocale.find((hit) => hit.slug === smokeSlug)).toBeUndefined();

    const wrongCollection = await searchDocumentMirror({
      query: smokeToken,
      collection: "legal",
      locale: "en",
      limit: 10,
    });

    expect(
      wrongCollection.find((hit) => hit.slug === smokeSlug)
    ).toBeUndefined();
  });

  it("records revisions and removes mirror rows on delete", async () => {
    const revisionsBefore = await database
      .select()
      .from(cmsDocumentRevision)
      .where(
        and(
          eq(cmsDocumentRevision.collection, "blog"),
          eq(cmsDocumentRevision.slug, smokeSlug),
          eq(cmsDocumentRevision.locale, "en")
        )
      );

    expect(revisionsBefore.length).toBeGreaterThan(0);

    const deleted = await deleteDocumentMirror({
      collection: "blog",
      slug: smokeSlug,
      locale: "en",
      title: "Phase 3C smoke",
      status: "published",
    });

    expect(deleted).toBe(true);

    const [row] = await database
      .select({ id: cmsDocument.id })
      .from(cmsDocument)
      .where(
        and(
          eq(cmsDocument.collection, "blog"),
          eq(cmsDocument.slug, smokeSlug),
          eq(cmsDocument.locale, "en")
        )
      );

    expect(row).toBeUndefined();

    const deletedRevision = await database
      .select()
      .from(cmsDocumentRevision)
      .where(
        and(
          eq(cmsDocumentRevision.collection, "blog"),
          eq(cmsDocumentRevision.slug, smokeSlug),
          eq(cmsDocumentRevision.locale, "en"),
          eq(cmsDocumentRevision.action, "deleted")
        )
      );

    expect(deletedRevision.length).toBe(1);
  });

  it("excludes drafts from published-only search", async () => {
    const draftSlug = `${smokeSlug}-draft`;

    await upsertDocumentMirror({
      collection: "blog",
      slug: draftSlug,
      locale: "en",
      title: "Draft smoke",
      description: null,
      status: "draft",
      frontmatter: { title: "Draft smoke", status: "draft" },
      bodyMdx: `# Draft\n\nUnique search token: ${smokeToken}-draft-only`,
      publishedAt: null,
      revisionAction: "updated",
    });

    const publicHits = await searchDocumentMirror({
      query: `${smokeToken}-draft-only`,
      collection: "blog",
      locale: "en",
      publishedOnly: true,
    });

    expect(publicHits.find((hit) => hit.slug === draftSlug)).toBeUndefined();

    const editorHits = await searchDocumentMirror({
      query: `${smokeToken}-draft-only`,
      collection: "blog",
      locale: "en",
    });

    expect(editorHits.find((hit) => hit.slug === draftSlug)).toBeDefined();

    await deleteDocumentMirror({
      collection: "blog",
      slug: draftSlug,
      locale: "en",
      title: "Draft smoke",
      status: "draft",
    });
  });

  it("returns empty results for blank queries", async () => {
    const hits = await searchDocumentMirror({ query: "   " });
    expect(hits).toEqual([]);
  });
});
