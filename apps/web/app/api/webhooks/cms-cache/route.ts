import {
  CMS_EVENT_PUBLISHED,
  CMS_EVENT_UNPUBLISHED,
  CMS_EVENT_SETTINGS_UPDATED,
  verifyStandardWebhook,
} from "@repo/webhooks";
import {
  cmsDocumentEventSchema,
  cmsSettingsUpdatedEventSchema,
} from "@repo/cms/events";
import { normalizeLocale } from "@repo/cms/locale";
import {
  CMS_CACHE_TAG_ALL,
  CMS_SETTINGS_TAG,
  getCmsCacheTags,
  getCmsRevalidationPaths,
  getSiteSettingsRevalidationPaths,
} from "@repo/cms/revalidate";
import { keys as webhooksKeys } from "@repo/webhooks/keys";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

const documentWebhookPayloadSchema = z.object({
  type: z.enum([CMS_EVENT_PUBLISHED, CMS_EVENT_UNPUBLISHED]),
  timestamp: z.string(),
  organizationId: z.string(),
  data: cmsDocumentEventSchema,
});

const settingsWebhookPayloadSchema = z.object({
  type: z.literal(CMS_EVENT_SETTINGS_UPDATED),
  timestamp: z.string(),
  organizationId: z.string(),
  data: cmsSettingsUpdatedEventSchema,
});

const webhookPayloadSchema = z.discriminatedUnion("type", [
  documentWebhookPayloadSchema,
  settingsWebhookPayloadSchema,
]);

export const POST = async (request: Request): Promise<Response> => {
  const secret = webhooksKeys().WEBHOOK_FIRST_PARTY_WEB_SECRET;

  if (!secret) {
    return NextResponse.json(
      { message: "Webhook receiver is not configured" },
      { status: 503 }
    );
  }

  const rawBody = await request.text();
  const verification = verifyStandardWebhook({
    secret,
    rawBody,
    headers: request.headers,
  });

  if (!verification.ok) {
    return NextResponse.json({ message: verification.error }, { status: 401 });
  }

  let payload: z.infer<typeof webhookPayloadSchema>;

  try {
    payload = webhookPayloadSchema.parse(JSON.parse(rawBody));
  } catch {
    return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
  }

  if (payload.type === CMS_EVENT_SETTINGS_UPDATED) {
    revalidateTag(CMS_CACHE_TAG_ALL, "max");
    revalidateTag(CMS_SETTINGS_TAG, "max");

    const paths = getSiteSettingsRevalidationPaths();

    for (const path of paths) {
      revalidatePath(path);
    }

    return NextResponse.json({
      revalidated: true,
      type: payload.type,
      tags: [CMS_CACHE_TAG_ALL, CMS_SETTINGS_TAG],
      paths,
      now: Date.now(),
    });
  }

  const locale = normalizeLocale(payload.data.locale);
  const collection = payload.data.collection;
  const slug = payload.data.slug;

  for (const tag of getCmsCacheTags(collection, locale, slug)) {
    revalidateTag(tag, "max");
  }

  const paths = getCmsRevalidationPaths({
    collection,
    locale,
    slug,
  });

  for (const path of paths) {
    revalidatePath(path);
  }

  return NextResponse.json({
    revalidated: true,
    type: payload.type,
    tags: getCmsCacheTags(collection, locale, slug),
    paths,
    now: Date.now(),
  });
};
