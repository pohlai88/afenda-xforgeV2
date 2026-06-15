import { getDefaultFrontmatter } from "@repo/cms/collections";
import { parseCmsRouteLocale } from "@repo/cms/locale";
import { isCmsCollection } from "@repo/cms/writer";
import { notFound } from "next/navigation";
import { DocumentEditor } from "../../../components/document-editor";

interface NewDocumentPageProperties {
  readonly params: Promise<{ collection: string; locale: string }>;
}

const NewDocumentPage = async ({ params }: NewDocumentPageProperties) => {
  const { collection, locale: localeParam } = await params;
  const locale = parseCmsRouteLocale(localeParam);

  if (!(isCmsCollection(collection) && locale)) {
    notFound();
  }

  return (
    <DocumentEditor
      collection={collection}
      initialBody={"## New document\n\nStart writing MDX content here.\n"}
      initialFrontmatter={getDefaultFrontmatter(collection)}
      locale={locale}
    />
  );
};

export default NewDocumentPage;
