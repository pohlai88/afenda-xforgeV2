import type { CmsDocumentListItem } from "@repo/cms/document-list";
import type { CmsLocale } from "@repo/cms/locale";
import type { CmsCollectionName } from "@repo/cms/writer";
import {
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/design-system/design-system";
import Link from "next/link";

type DocumentListProperties = {
  collection: CmsCollectionName;
  locale: CmsLocale;
  documents: CmsDocumentListItem[];
};

export const DocumentList = ({
  collection,
  locale,
  documents,
}: DocumentListProperties) => {
  if (documents.length === 0) {
    return (
      <p className="rounded-lg border border-dashed p-8 text-center text-muted-foreground text-sm">
        No documents yet. Create your first one.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Updated</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map((document) => (
          <TableRow key={document.slug}>
            <TableCell>
              <Link
                className="font-medium hover:underline"
                href={`/cms/${collection}/${locale}/${document.slug}`}
              >
                {document.title}
              </Link>
              <p className="text-muted-foreground text-xs">
                {document.description}
              </p>
            </TableCell>
            <TableCell>
              <Badge
                tone={document.status === "published" ? "positive" : "neutral"}
                variant="soft"
              >
                {document.status}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground text-sm">
              {document.date
                ? new Date(document.date).toLocaleDateString()
                : "—"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
