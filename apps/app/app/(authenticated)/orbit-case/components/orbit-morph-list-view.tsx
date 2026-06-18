import { requireOrg } from "@repo/auth/server";
import {
  listRoutedMorphSlices,
  readMorphRequestFieldValue,
  resolveRoutedMorphSliceBySegment,
  toOrbitMorphRequestDto,
} from "@repo/orbit-case";
import { Badge, blockRecipe } from "@repo/design-system/design-system";
import { cn } from "@repo/design-system/lib/utils";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCachedMorphRequestsForOrg } from "@/lib/orbit-case-cached-reads";
import { Header } from "../../components/header";

interface OrbitMorphListViewProps {
  caseId?: string;
  segment: string;
}

export async function generateMorphListMetadata(
  segment: string
): Promise<Metadata> {
  const slice = resolveRoutedMorphSliceBySegment(segment);

  return {
    title: slice?.label ?? "Morph request",
  };
}

export async function OrbitMorphListView({
  caseId,
  segment,
}: OrbitMorphListViewProps) {
  const slice = resolveRoutedMorphSliceBySegment(segment);

  if (!slice) {
    notFound();
  }

  const { orgId } = await requireOrg();
  const records = await getCachedMorphRequestsForOrg(segment, orgId);
  const filtered = caseId
    ? records.filter((record) => record.originCaseId === caseId)
    : records;

  const badgeField = slice.templateFields.find(
    (field) => field.key !== "title"
  )?.key;

  return (
    <>
      <Header
        description={`${slice.label}s created from Orbit Case pushes.`}
        eyebrow={`Work / Orbit Case / ${slice.label}`}
        title={`${slice.label}s`}
      />
      <div className="grid gap-3 p-[var(--xforge-space-8)]">
        {filtered.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No {slice.label.toLowerCase()}s yet.
          </p>
        ) : (
          filtered.map((record) => {
            const dto = toOrbitMorphRequestDto(record);
            const badgeValue = badgeField
              ? readMorphRequestFieldValue(dto, badgeField)
              : null;

            return (
              <Link href={`/orbit-case/${segment}/${dto.id}`} key={dto.id}>
                <article
                  className={cn(
                    blockRecipe("blockPanel", "blockPanelPadding"),
                    "grid gap-2 transition-colors hover:bg-muted/30"
                  )}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-medium">{dto.title}</h2>
                    {badgeValue ? (
                      <Badge variant="outline">{badgeValue}</Badge>
                    ) : null}
                  </div>
                  <p className="text-muted-foreground text-sm">
                    From case {dto.originCaseId}
                  </p>
                </article>
              </Link>
            );
          })
        )}
      </div>
    </>
  );
}

export const listMorphNavLinks = () =>
  listRoutedMorphSlices().map((slice) => ({
    href: `/orbit-case/${slice.segment}`,
    label: `${slice.label}s`,
  }));
