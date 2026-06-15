import type { CollectionName } from "./collections";
import type { ReaderOptions } from "./collections/types";
import { normalizeLocale } from "./locale";
import { verifyPreviewToken } from "./preview-token";

type PreviewSearchParams = {
  preview?: string;
  token?: string;
};

export const getPreviewReaderOptions = (
  collection: CollectionName,
  locale: string,
  slug: string,
  searchParams: PreviewSearchParams
): ReaderOptions => {
  const normalizedLocale = normalizeLocale(locale);

  if (
    searchParams.preview === "draft" &&
    searchParams.token &&
    verifyPreviewToken(searchParams.token, collection, normalizedLocale, slug)
  ) {
    return { includeDrafts: true, locale: normalizedLocale };
  }

  return { locale: normalizedLocale };
};
