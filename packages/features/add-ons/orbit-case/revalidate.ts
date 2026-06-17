export const ORBIT_CASE_CACHE_TAG_ALL = "orbit-case:all" as const;

export const orbitCaseListTag = (organizationId: string): string =>
  `orbit-case:list:${organizationId}`;

export const orbitCaseBoardTag = (organizationId: string): string =>
  `orbit-case:board:${organizationId}`;

export const orbitCaseDetailTag = (caseId: string): string =>
  `orbit-case:detail:${caseId}`;

export interface OrbitCaseCacheTagInput {
  caseId?: string;
  organizationId: string;
}

export const getOrbitCaseCacheTags = (
  input: OrbitCaseCacheTagInput
): readonly string[] => {
  const tags = [
    ORBIT_CASE_CACHE_TAG_ALL,
    orbitCaseListTag(input.organizationId),
    orbitCaseBoardTag(input.organizationId),
  ];

  if (input.caseId) {
    return [...tags, orbitCaseDetailTag(input.caseId)];
  }

  return tags;
};
