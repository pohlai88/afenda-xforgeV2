import type { OrbitMorphRequestRecord } from "../../contract/morph-request-shared";

export interface OrbitMorphRouteLoader {
  getById: (
    organizationId: string,
    requestId: string
  ) => Promise<OrbitMorphRequestRecord | null>;
  listForOrg: (organizationId: string) => Promise<OrbitMorphRequestRecord[]>;
}
