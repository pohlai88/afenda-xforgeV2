import { requireOrg } from "@repo/auth/server";
import {
  listMorphLifecycleFilterSchema,
  ORBIT_MORPH_STATUSES,
  ORBIT_MORPH_STATUS_LABELS,
  resolveMorphLifecycleSegmentConfig,
  type MorphLifecycleSegment,
  type OrbitMorphStatus,
} from "@repo/orbit-case";
import { resolveMorphLifecycleLoader } from "@repo/orbit-case/server";
import { Badge, blockRecipe } from "@repo/design-system";
import { cn } from "@repo/design-system/lib/utils";
import type { Metadata } from "next";
import Link from "next/link";
import {
  buildMorphPilotListHref,
  toMorphPilotListItem,
} from "@/lib/morph-pilot-ui";
import { Header } from "../../_components/header";

interface OrbitMorphPilotListViewProps {
  assigneeId?: string;
  caseId?: string;
  segment: MorphLifecycleSegment;
  status?: OrbitMorphStatus;
}

export async function generateMorphPilotListMetadata(
  segment: MorphLifecycleSegment
): Promise<Metadata> {
  const config = resolveMorphLifecycleSegmentConfig(segment);
  return { title: config.eyebrowLabel };
}

export async function OrbitMorphPilotListView({
  assigneeId,
  caseId,
  segment,
  status,
}: OrbitMorphPilotListViewProps) {
  const config = resolveMorphLifecycleSegmentConfig(segment);
  const { orgId } = await requireOrg();
  const filters = listMorphLifecycleFilterSchema.parse({ assigneeId, status });
  const loader = resolveMorphLifecycleLoader(segment);
  const records = await loader.listForOrg(orgId, filters);

  const items = records
    .filter((record) => (caseId ? record.originCaseId === caseId : true))
    .map((record) => toMorphPilotListItem(segment, record));

  return (
    <>
      <Header
        description={config.listDescription}
        eyebrow={`Work / Orbit Case / ${config.eyebrowLabel}`}
        title={config.listTitle}
      />
      <div className="grid gap-4 p-[var(--xforge-space-8)]">
        <div className="flex flex-wrap gap-2">
          <Link href={buildMorphPilotListHref(segment, { assigneeId, caseId })}>
            <Badge variant={status ? "outline" : "solid"}>All</Badge>
          </Link>
          {ORBIT_MORPH_STATUSES.map((value) => (
            <Link
              href={buildMorphPilotListHref(segment, {
                assigneeId,
                caseId,
                status: value,
              })}
              key={value}
            >
              <Badge variant={status === value ? "solid" : "outline"}>
                {ORBIT_MORPH_STATUS_LABELS[value]}
              </Badge>
            </Link>
          ))}
        </div>

        {items.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No {config.singularLabel}s yet.
          </p>
        ) : (
          items.map((item) => (
            <Link href={item.detailHref} key={item.id}>
              <article
                className={cn(
                  blockRecipe("blockPanel", "blockPanelPadding"),
                  "grid gap-2 transition-colors hover:bg-muted/30"
                )}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-medium">{item.title}</h2>
                  <Badge variant="outline">
                    {ORBIT_MORPH_STATUS_LABELS[item.status]}
                  </Badge>
                  {item.fieldBadges.map((badge) => (
                    <Badge key={badge} variant="soft">
                      {badge}
                    </Badge>
                  ))}
                </div>
                <p className="text-muted-foreground text-sm">
                  From case {item.originCaseId}
                </p>
              </article>
            </Link>
          ))
        )}
      </div>
    </>
  );
}
