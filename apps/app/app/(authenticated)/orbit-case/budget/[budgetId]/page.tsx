import { requireOrg } from "@repo/auth/server";
import { toOrbitBudgetRequestDto, toOrbitCaseDto } from "@repo/orbit-case";
import {
  getBudgetRequestById,
  getOrbitCaseById,
} from "@repo/orbit-case/server";
import { Badge, blockRecipe } from "@repo/design-system/design-system";
import { cn } from "@repo/design-system/lib/utils";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "../../../components/header";

interface OrbitBudgetDetailPageProps {
  params: Promise<{ budgetId: string }>;
}

export async function generateMetadata({
  params,
}: OrbitBudgetDetailPageProps): Promise<Metadata> {
  const { budgetId } = await params;
  const { orgId } = await requireOrg();
  const record = await getBudgetRequestById(orgId, budgetId);

  return {
    title: record?.title ?? "Budget Request",
  };
}

export default async function OrbitBudgetDetailPage({
  params,
}: OrbitBudgetDetailPageProps) {
  const { budgetId } = await params;
  const { orgId } = await requireOrg();
  const record = await getBudgetRequestById(orgId, budgetId);

  if (!record) {
    notFound();
  }

  const budget = toOrbitBudgetRequestDto(record);
  const originCase = await getOrbitCaseById(orgId, budget.originCaseId);
  const originCaseDto = originCase ? toOrbitCaseDto(originCase) : null;

  return (
    <>
      <Header
        description="Governed budget request created from an Orbit Case push."
        eyebrow="Work / Orbit Case / Budget"
        title={budget.title}
      />
      <div className="grid gap-6 p-[var(--xforge-space-8)] lg:grid-cols-[1fr_320px]">
        <section
          className={cn(
            blockRecipe("blockPanel", "blockPanelPadding"),
            "grid gap-4"
          )}
        >
          <h2 className={blockRecipe("blockTitle")}>Request</h2>
          <dl className="grid gap-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Title</dt>
              <dd className="font-medium">{budget.title}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Amount</dt>
              <dd>{budget.amount ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Created</dt>
              <dd>{new Date(budget.createdAt).toLocaleString()}</dd>
            </div>
          </dl>
        </section>

        <aside
          className={cn(
            blockRecipe("blockPanel", "blockPanelPadding"),
            "grid h-fit gap-4"
          )}
        >
          <div className="grid gap-2">
            <Badge variant="soft">From Orbit Case</Badge>
            {originCaseDto ? (
              <Link
                className="font-medium text-sm hover:underline"
                href={`/orbit-case/${originCaseDto.id}`}
              >
                {originCaseDto.title}
              </Link>
            ) : (
              <p className="text-muted-foreground text-sm">
                Origin case unavailable
              </p>
            )}
          </div>
          <Link
            className="text-muted-foreground text-sm hover:text-foreground"
            href="/orbit-case/budget"
          >
            All budget requests
          </Link>
        </aside>
      </div>
    </>
  );
}
