import { requireOrg } from "@repo/auth/server";
import {
  resolveRoutedMorphSliceBySegment,
  toOrbitMorphRequestDto,
} from "@repo/orbit-case";
import { resolveOrbitMorphRouteLoader } from "@repo/orbit-case/server";
import { blockRecipe } from "@repo/design-system/design-system";
import { cn } from "@repo/design-system/lib/utils";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCachedOrbitCaseTitle } from "@/lib/orbit-case-cached-reads";
import { Header } from "../../components/header";
import {
  OrbitMorphDetailLayout,
  OrbitMorphOriginAside,
} from "./orbit-morph-origin-aside";

interface OrbitMorphDetailViewProps {
  requestId: string;
  segment: string;
}

export async function generateMorphDetailMetadata(
  segment: string,
  requestId: string
): Promise<Metadata> {
  const slice = resolveRoutedMorphSliceBySegment(segment);
  const loader = slice ? resolveOrbitMorphRouteLoader(segment) : null;

  if (!slice || !loader) {
    return { title: "Morph request" };
  }

  const { orgId } = await requireOrg();
  const record = await loader.getById(orgId, requestId);

  return {
    title: record?.title ?? slice.label,
  };
}

export async function OrbitMorphDetailView({
  requestId,
  segment,
}: OrbitMorphDetailViewProps) {
  const slice = resolveRoutedMorphSliceBySegment(segment);
  const loader = slice ? resolveOrbitMorphRouteLoader(segment) : null;

  if (!slice || !loader) {
    notFound();
  }

  const { orgId } = await requireOrg();
  const record = await loader.getById(orgId, requestId);

  if (!record) {
    notFound();
  }

  const dto = toOrbitMorphRequestDto(record);
  const originCaseTitle = await getCachedOrbitCaseTitle(
    orgId,
    dto.originCaseId
  );

  return (
    <>
      <Header
        description={`Governed ${slice.label.toLowerCase()} created from an Orbit Case push.`}
        eyebrow={`Work / Orbit Case / ${slice.label}`}
        title={dto.title}
      />
      <OrbitMorphDetailLayout
        aside={
          <OrbitMorphOriginAside
            allItemsHref={`/orbit-case/${segment}`}
            allItemsLabel={`All ${slice.label.toLowerCase()}s`}
            originCaseId={dto.originCaseId}
            originCaseTitle={originCaseTitle}
          />
        }
      >
        <section
          className={cn(
            blockRecipe("blockPanel", "blockPanelPadding"),
            "grid gap-4"
          )}
        >
          <h2 className={blockRecipe("blockTitle")}>Request</h2>
          <dl className="grid gap-3 text-sm">
            {slice.templateFields.map((field) => (
              <div key={field.key}>
                <dt className="text-muted-foreground">{field.label}</dt>
                <dd className={field.key === "title" ? "font-medium" : undefined}>
                  {field.key === "title"
                    ? dto.title
                    : (dto.values[field.key] ?? "—")}
                </dd>
              </div>
            ))}
            <div>
              <dt className="text-muted-foreground">Created</dt>
              <dd>{new Date(dto.createdAt).toLocaleString()}</dd>
            </div>
          </dl>
        </section>
      </OrbitMorphDetailLayout>
    </>
  );
}
