import { requireOrg } from "@repo/auth/server";
import { Badge } from "@repo/design-system/design-system";
import { database } from "@repo/database";
import { page } from "@repo/database/schema";
import { ilike } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { Header } from "../components/header";

interface SearchPageProperties {
  searchParams: Promise<{
    q: string;
  }>;
}

export const generateMetadata = async ({
  searchParams,
}: SearchPageProperties) => {
  const { q } = await searchParams;

  return {
    title: `${q} - Search results`,
    description: `Search results for ${q}`,
  };
};

const SearchPage = async ({ searchParams }: SearchPageProperties) => {
  const { q } = await searchParams;
  const pages = await database
    .select()
    .from(page)
    .where(ilike(page.name, `%${q}%`));
  try {
    await requireOrg();
  } catch {
    notFound();
  }

  if (!q) {
    redirect("/");
  }

  return (
    <>
      <Header
        badge={
          <Badge tone="info" variant="outline">
            {pages.length} matches
          </Badge>
        }
        description="Search records, routes, and workspace artifacts within the active tenant."
        eyebrow="Workspace / Search"
        title={`Results for “${q}”`}
      />
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        {pages.map((result) => (
          <div
            className="aspect-video rounded-[var(--card-radius)] border border-border-default bg-surface-muted/40 p-4 text-sm"
            key={result.id}
          >
            {result.name}
          </div>
        ))}
      </div>
    </>
  );
};

export default SearchPage;
