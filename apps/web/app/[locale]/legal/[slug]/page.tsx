import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { legal } from "@repo/cms";
import { Body } from "@repo/cms/components/body";
import { TableOfContents } from "@repo/cms/components/toc";
import { getPreviewReaderOptions } from "@repo/cms/reader-options";
import { buildLocaleSlugParams } from "@repo/cms/static-params";
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Sidebar } from "@/components/sidebar";

interface LegalPageProperties {
  readonly params: Promise<{
    locale: string;
    slug: string;
  }>;
  readonly searchParams: Promise<{
    preview?: string;
    token?: string;
  }>;
}

export const generateMetadata = async ({
  params,
  searchParams,
}: LegalPageProperties): Promise<Metadata> => {
  const { locale, slug } = await params;
  const query = await searchParams;
  const post = await legal.getPost(
    slug,
    getPreviewReaderOptions("legal", locale, slug, query)
  );

  if (!post) {
    return {};
  }

  return createMetadata({
    title: post._title,
    description: post.description,
  });
};

export const generateStaticParams = (): Promise<
  { locale: string; slug: string }[]
> =>
  buildLocaleSlugParams(async (locale) => {
    const posts = await legal.getPostsMeta({ locale });
    return posts.map((post) => post._slug);
  });

const LegalPage = async ({ params, searchParams }: LegalPageProperties) => {
  const { locale, slug } = await params;
  const query = await searchParams;
  const page = await legal.getPost(
    slug,
    getPreviewReaderOptions("legal", locale, slug, query)
  );

  if (!page) {
    notFound();
  }

  return (
    <div className="container max-w-5xl py-16">
      <Link
        className="mb-4 inline-flex items-center gap-1 text-muted-foreground text-sm focus:underline focus:outline-none"
        href="/"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to Home
      </Link>
      <h1 className="scroll-m-20 text-balance font-extrabold text-4xl tracking-tight lg:text-5xl">
        {page._title}
      </h1>
      <p className="text-balance leading-7 [&:not(:first-child)]:mt-6">
        {page.description}
      </p>
      <div className="mt-16 flex flex-col items-start gap-8 sm:flex-row">
        <div className="sm:flex-1">
          <Body code={page.body.code} />
        </div>
        <div className="sticky top-24 hidden shrink-0 md:block">
          <Sidebar
            readingTime={`${page.body.readingTime} min read`}
            toc={<TableOfContents items={page.body.toc} />}
          />
        </div>
      </div>
    </div>
  );
};

export default LegalPage;
