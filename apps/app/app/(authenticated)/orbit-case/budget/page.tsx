import { requireOrg } from "@repo/auth/server";
import { toOrbitBudgetRequestDto } from "@repo/orbit-case";
import { listBudgetRequestsForOrg } from "@repo/orbit-case/server";
import { Badge, blockRecipe } from "@repo/design-system/design-system";
import { cn } from "@repo/design-system/lib/utils";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "../../components/header";

interface OrbitBudgetListPageProps {
  searchParams: Promise<{ caseId?: string }>;
}

export const metadata: Metadata = {
  title: "Budget Requests",
};

export default async function OrbitBudgetListPage({
  searchParams,
}: OrbitBudgetListPageProps) {
  const { orgId } = await requireOrg();
  const { caseId } = await searchParams;
  const budgets = await listBudgetRequestsForOrg(orgId);
  const filteredBudgets = caseId
    ? budgets.filter((budget) => budget.originCaseId === caseId)
    : budgets;

  return (
    <>
      <Header
        description="Budget requests created from Orbit Case pushes."
        eyebrow="Work / Orbit Case / Budget"
        title="Budget requests"
      />
      <div className="grid gap-3 p-[var(--xforge-space-8)]">
        {filteredBudgets.length === 0 ? (
          <p className="text-muted-foreground text-sm">No budget requests yet.</p>
        ) : (
          filteredBudgets.map((budget) => {
            const dto = toOrbitBudgetRequestDto(budget);

            return (
              <Link href={`/orbit-case/budget/${dto.id}`} key={dto.id}>
                <article
                  className={cn(
                    blockRecipe("blockPanel", "blockPanelPadding"),
                    "grid gap-2 transition-colors hover:bg-muted/30"
                  )}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-medium">{dto.title}</h2>
                    {dto.amount ? (
                      <Badge variant="outline">{dto.amount}</Badge>
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
