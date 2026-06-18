import { type CmsCollectionName, collectionLabels } from "@repo/cms/writer";
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system";
import Link from "next/link";
import { getCollectionSummaries } from "@/app/actions/cms/documents";

const CmsDashboardPage = async () => {
  const result = await getCollectionSummaries();

  if (!result.ok) {
    return (
      <p className="text-destructive text-sm" role="alert">
        {result.error}
      </p>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Link href="/cms/settings">
        <Card className="transition-colors hover:bg-muted/40">
          <CardHeader>
            <CardTitle>Site settings</CardTitle>
            <CardDescription>Global site name and tagline</CardDescription>
          </CardHeader>
        </Card>
      </Link>
      {result.data.map((collection) => (
        <Link href={`/cms/${collection.name}`} key={collection.name}>
          <Card className="transition-colors hover:bg-muted/40">
            <CardHeader>
              <CardTitle>{collection.label}</CardTitle>
              <CardDescription>
                {collectionLabels[collection.name as CmsCollectionName]} content
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-3">
              <Badge variant="soft">{collection.total} documents</Badge>
              {collection.drafts > 0 ? (
                <Badge variant="outline">{collection.drafts} drafts</Badge>
              ) : null}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default CmsDashboardPage;
