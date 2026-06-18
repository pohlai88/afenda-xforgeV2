import { fetchDocumentListItems } from "@repo/cms/document-list";
import { parseCmsRouteLocale } from "@repo/cms/locale";
import { isCmsCollection } from "@repo/cms/writer";
import { Button } from "@repo/design-system";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DocumentList } from "../../components/document-list";
import { DocumentSearch } from "../../components/document-search";
import { LocaleNav } from "../../components/locale-nav";

interface CollectionLocalePageProperties {
  readonly params: Promise<{ collection: string; locale: string }>;
}

const CollectionLocalePage = async ({
  params,
}: CollectionLocalePageProperties) => {
  const { collection, locale: localeParam } = await params;
  const locale = parseCmsRouteLocale(localeParam);

  if (!(isCmsCollection(collection) && locale)) {
    notFound();
  }

  const rows = await fetchDocumentListItems(collection, locale);

  return (
    <div className="flex flex-col gap-4">
      <LocaleNav collection={collection} currentLocale={locale} />
      <div className="flex items-center justify-between">
        <h2 className="font-medium text-lg capitalize">
          {collection} ({locale.toUpperCase()})
        </h2>
        <Button asChild>
          <Link href={`/cms/${collection}/${locale}/new`}>New document</Link>
        </Button>
      </div>
      <DocumentSearch collection={collection} locale={locale} />
      <DocumentList collection={collection} documents={rows} locale={locale} />
    </div>
  );
};

export default CollectionLocalePage;
