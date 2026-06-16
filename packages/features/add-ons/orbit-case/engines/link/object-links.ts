/**
 * Phase 2+: origin ↔ ERP object links.
 */
export interface OrbitObjectLink {
  id: string;
  organizationId: string;
  originCaseId: string;
  targetId: string;
  targetType: string;
}
