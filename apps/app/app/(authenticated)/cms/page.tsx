import { collectionLabels, type CmsCollectionName } from "@repo/cms/writer";
import Link from "next/link";
import { getCollectionSummaries } from "@/app/actions/cms/documents";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Badge } from "@repo/design-system/components/ui/badge";

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
              <Badge variant="secondary">{collection.total} documents</Badge>
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
