import { requireOrg } from "@repo/auth/server";
import { Badge, blockRecipe, cn } from "@repo/design-system";
import {
  listMorphLifecycleFilterSchema,
  type MorphLifecycleSegment,
  ORBIT_MORPH_STATUS_LABELS,
  ORBIT_MORPH_STATUSES,
  type OrbitMorphStatus,
  resolveMorphLifecycleSegmentConfig,
} from "@repo/orbit-case";
import { resolveMorphLifecycleLoader } from "@repo/orbit-case/server";
import type { Metadata } from "next";
import Link from "next/link";
import {
  buildMorphPilotListHref,
  toMorphPilotListItem,
} from "@/lib/morph-pilot-ui";
import { Header } from "../../_components/header";

interface OrbitMorphPilotListViewProps {
  readonly assigneeId?: string;
  readonly caseId?: string;
  readonly segment: MorphLifecycleSegment;
  readonly status?: OrbitMorphStatus;
}

export function generateMorphPilotListMetadata(
  segment: MorphLifecycleSegment
): Metadata {
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
          <p className="text-sm text-text-secondary">
            No {config.singularLabel}s yet.
          </p>
        ) : (
          items.map((item) => (
            <Link href={item.detailHref} key={item.id}>
              <article
                className={cn(
                  blockRecipe("blockPanel", "blockPanelPadding"),
                  "grid gap-2 transition-colors hover:bg-surface-muted/30"
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
                <p className="text-sm text-text-secondary">
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
