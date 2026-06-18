import { parseCmsRouteLocale } from "@repo/cms/locale";
import { isCmsCollection, readRawDocument } from "@repo/cms/writer";
import { notFound } from "next/navigation";
import { DocumentEditor } from "../../../_components/document-editor";

interface EditDocumentPageProperties {
  readonly params: Promise<{
    collection: string;
    locale: string;
    slug: string;
  }>;
}

const EditDocumentPage = async ({ params }: EditDocumentPageProperties) => {
  const { collection, locale: localeParam, slug } = await params;
  const locale = parseCmsRouteLocale(localeParam);

  if (!(isCmsCollection(collection) && locale)) {
    notFound();
  }

  const document = await readRawDocument(collection, slug, locale);

  if (!document) {
    notFound();
  }

  return (
    <DocumentEditor
      collection={collection}
      initialBody={document.body}
      initialFrontmatter={document.frontmatter}
      initialSlug={document.slug}
      locale={locale}
    />
  );
};

export default EditDocumentPage;
