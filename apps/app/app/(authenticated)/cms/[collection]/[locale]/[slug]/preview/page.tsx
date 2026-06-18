import { Body } from "@repo/cms/components/body";
import { TableOfContents } from "@repo/cms/components/toc";
import { parseCmsRouteLocale } from "@repo/cms/locale";
import { cmsReaders, isCmsCollection } from "@repo/cms/writer";
import { Button } from "@repo/design-system";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PreviewDocumentPageProperties {
  readonly params: Promise<{
    collection: string;
    locale: string;
    slug: string;
  }>;
}

const PreviewDocumentPage = async ({
  params,
}: PreviewDocumentPageProperties) => {
  const { collection, locale: localeParam, slug } = await params;
  const locale = parseCmsRouteLocale(localeParam);

  if (!(isCmsCollection(collection) && locale)) {
    notFound();
  }

  const document = await cmsReaders[collection].getPost(slug, {
    includeDrafts: true,
    locale,
  });

  if (!document) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm">
            Preview ({locale.toUpperCase()})
          </p>
          <h2 className="font-semibold text-xl">{document._title}</h2>
        </div>
        <Button asChild variant="secondary">
          <Link href={`/cms/${collection}/${locale}/${slug}`}>
            Back to editor
          </Link>
        </Button>
      </div>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_240px]">
        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <Body code={document.body.code} />
        </article>
        <aside className="hidden lg:block">
          <TableOfContents items={document.body.toc} />
        </aside>
      </div>
    </div>
  );
};

export default PreviewDocumentPage;
