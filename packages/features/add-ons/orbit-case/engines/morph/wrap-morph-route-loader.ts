import type { OrbitMorphRequestRecord } from "../../contract/morph-request-shared";
import type { OrbitMorphRouteLoader } from "./morph-route-loader.types";

export const wrapMorphRouteLoader = <TRecord extends MorphRecordCore>(
  reads: {
    getById: (
      organizationId: string,
      requestId: string
    ) => Promise<TRecord | null>;
    listForOrg: (organizationId: string) => Promise<TRecord[]>;
  },
  mapRecord: (record: TRecord) => OrbitMorphRequestRecord
): OrbitMorphRouteLoader => ({
  getById: async (organizationId, requestId) => {
    const record = await reads.getById(organizationId, requestId);
    return record ? mapRecord(record) : null;
  },
  listForOrg: async (organizationId) => {
    const records = await reads.listForOrg(organizationId);
    return records.map(mapRecord);
  },
});

type MorphRecordCore = Pick<
  OrbitMorphRequestRecord,
  | "createdAt"
  | "createdBy"
  | "id"
  | "organizationId"
  | "originCaseId"
  | "title"
>;
