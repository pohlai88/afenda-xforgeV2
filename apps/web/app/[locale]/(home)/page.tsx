import { getDictionary } from "@repo/internationalization";
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import { Suspense } from "react";
import { env } from "@/env";
import type { PublicHomeContent } from "@/lib/public-home-content";
import { PublicHomeShell } from "./_components/public-home-shell";

interface HomeProps {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const generateMetadata = async ({
  params,
}: HomeProps): Promise<Metadata> => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);
  const { publicHome } = dictionary.web.home;

  return createMetadata({
    title: publicHome.title,
    description: publicHome.description,
  });
};

function buildContent(
  dictionary: Awaited<ReturnType<typeof getDictionary>>,
): PublicHomeContent {
  const { publicHome } = dictionary.web.home;

  return {
    title: publicHome.title,
    description: publicHome.description,
    signInLabel: publicHome.signInLabel,
    signInHref: `${env.NEXT_PUBLIC_APP_URL}/sign-in`,
  };
}

const Home = async ({ params, searchParams }: HomeProps) => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);
  const content = buildContent(dictionary);

  return (
    <Suspense fallback={<PublicHomeShell content={content} />}>
      <HomeContent content={content} searchParams={searchParams} />
    </Suspense>
  );
};

async function HomeContent({
  content,
  searchParams,
}: {
  content: PublicHomeContent;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const initialSkip = resolvedSearchParams.intro === "0";

  return (
    <PublicHomeShell content={content} initialSkip={initialSkip} />
  );
}

export default Home;
