import { getOrbitCaseCacheTags } from "@repo/orbit-case/revalidate";
import { revalidatePath, revalidateTag } from "next/cache";

export interface RevalidateOrbitCaseInput {
  caseId?: string;
  organizationId: string;
}

export const revalidateOrbitCaseMutation = (
  input: RevalidateOrbitCaseInput
): void => {
  revalidatePath("/orbit-case");

  if (input.caseId) {
    revalidatePath(`/orbit-case/${input.caseId}`);
  }

  for (const tag of getOrbitCaseCacheTags(input)) {
    revalidateTag(tag, "max");
  }
};

export const revalidateOrbitCaseBudgetMutation = (budgetId: string): void => {
  revalidatePath("/orbit-case/budget");
  revalidatePath(`/orbit-case/budget/${budgetId}`);
};
