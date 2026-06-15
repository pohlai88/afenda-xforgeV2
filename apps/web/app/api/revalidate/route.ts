import { keys } from "@repo/cms/keys";
import { normalizeLocale } from "@repo/cms/locale";
import {
  type CmsRevalidateInput,
  getCmsCacheTags,
  getCmsRevalidationPaths,
} from "@repo/cms/revalidate";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

const revalidateBodySchema = z.object({
  collection: z.enum(["blog", "legal"]),
  locale: z.string().optional(),
  slug: z.string().optional(),
});

const getBearerToken = (authorization: string | null): string | null => {
  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice("Bearer ".length).trim();
};

export const POST = async (request: Request): Promise<Response> => {
  const secret = keys().CMS_REVALIDATE_SECRET;
  const token = getBearerToken(request.headers.get("authorization"));

  if (!secret || token !== secret) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let body: CmsRevalidateInput;

  try {
    const parsed = revalidateBodySchema.parse(await request.json());
    body = {
      collection: parsed.collection,
      locale: parsed.locale ? normalizeLocale(parsed.locale) : undefined,
      slug: parsed.slug,
    };
  } catch {
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 400 }
    );
  }

  const locale = body.locale;

  for (const tag of getCmsCacheTags(body.collection, locale, body.slug)) {
    revalidateTag(tag, "max");
  }

  const paths = getCmsRevalidationPaths(body);

  for (const path of paths) {
    revalidatePath(path);
  }

  return NextResponse.json({
    revalidated: true,
    tags: getCmsCacheTags(body.collection, locale, body.slug),
    paths,
    now: Date.now(),
  });
};
