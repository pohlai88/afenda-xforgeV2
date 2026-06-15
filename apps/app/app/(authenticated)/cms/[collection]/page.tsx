import { DEFAULT_LOCALE } from "@repo/cms/locale";
import { redirect } from "next/navigation";
import { isCmsCollection } from "@repo/cms/writer";
import { notFound } from "next/navigation";

interface CollectionRedirectProperties {
  readonly params: Promise<{ collection: string }>;
}

const CollectionRedirectPage = async ({
  params,
}: CollectionRedirectProperties) => {
  const { collection } = await params;

  if (!isCmsCollection(collection)) {
    notFound();
  }

  redirect(`/cms/${collection}/${DEFAULT_LOCALE}`);
};

export default CollectionRedirectPage;
