import {
  apiError,
  apiOk,
  methodNotAllowed,
  withApiRoute,
} from "@repo/api";
import { cmsCollectionSchema } from "@repo/cms";
import { searchDocumentMirror } from "@repo/cms/sync";
import { z } from "zod";

const searchQuerySchema = z.object({
  q: z.string().min(1).max(200),
  collection: cmsCollectionSchema.optional(),
  locale: z.string().min(2).max(5).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
});

export const GET = withApiRoute(async (request) => {
  const { searchParams } = new URL(request.url);
  const parsed = searchQuerySchema.safeParse({
    q: searchParams.get("q") ?? undefined,
    collection: searchParams.get("collection") ?? undefined,
    locale: searchParams.get("locale") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
  });

  if (!parsed.success) {
    return apiError("bad_request", "Invalid search query", 400, parsed.error.flatten());
  }

  const results = await searchDocumentMirror({
    query: parsed.data.q,
    collection: parsed.data.collection,
    locale: parsed.data.locale,
    limit: parsed.data.limit,
    publishedOnly: true,
  });

  return apiOk({ results, count: results.length });
});

export const POST = (): Response => methodNotAllowed(["GET"]);
