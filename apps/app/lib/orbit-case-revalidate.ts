import {
  getOrbitCaseBudgetCacheTags,
  getOrbitCaseCacheTags,
  getOrbitCaseMorphCacheTags,
} from "@repo/orbit-case/revalidate";
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

export const revalidateOrbitCaseMorphMutation = (
  segment: string,
  organizationId: string,
  targetId: string
): void => {
  revalidatePath(`/orbit-case/${segment}`);
  revalidatePath(`/orbit-case/${segment}/${targetId}`);

  for (const tag of getOrbitCaseMorphCacheTags(segment, organizationId)) {
    revalidateTag(tag, "max");
  }
};

export const revalidateOrbitCaseBudgetMutation = (
  organizationId: string,
  budgetId: string
): void => {
  revalidateOrbitCaseMorphMutation("budget", organizationId, budgetId);
};

export const revalidateOrbitCaseMeetingMutation = (
  organizationId: string,
  meetingId: string
): void => {
  revalidateOrbitCaseMorphMutation("meeting", organizationId, meetingId);
};
