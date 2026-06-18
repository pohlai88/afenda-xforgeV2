import "server-only";

import { database, orbitPurchaseRequest } from "@repo/database";
import { and, desc, eq } from "drizzle-orm";
import type { MorphTwoFieldTable } from "./two-field-morph-table";

type MorphRequestCore = {
  createdAt: Date;
  createdBy: string;
  id: string;
  organizationId: string;
  originCaseId: string;
  title: string;
};

export const readMorphRowText = (value: unknown): string | null =>
  typeof value === "string" && value.length > 0 ? value : null;

export const readMorphRowRequiredText = (value: unknown): string =>
  typeof value === "string" ? value : "";

export const readMorphRowDate = (value: unknown): Date => {
  if (value instanceof Date) {
    return value;
  }

  throw new TypeError("Expected morph row createdAt to be a Date");
};

export const defineTwoFieldMorphMapper = <
  TRecord extends MorphRequestCore,
>(
  fieldAKey: string,
  fieldBKey: string
) => {
  return (raw: Record<string, unknown>): TRecord =>
    ({
      createdAt: readMorphRowDate(raw.createdAt),
      createdBy: readMorphRowRequiredText(raw.createdBy),
      id: readMorphRowRequiredText(raw.id),
      organizationId: readMorphRowRequiredText(raw.organizationId),
      originCaseId: readMorphRowRequiredText(raw.originCaseId),
      title: readMorphRowRequiredText(raw.title),
      [fieldAKey]: readMorphRowText(raw[fieldAKey]),
      [fieldBKey]: readMorphRowText(raw[fieldBKey]),
    }) as TRecord;
};

export const createTypedMorphReads = <
  TTable extends MorphTwoFieldTable,
  TRecord extends MorphRequestCore,
>(
  table: TTable,
  mapRow: (row: Record<string, unknown>) => TRecord
) => {
  const queryTable = table as typeof orbitPurchaseRequest;

  return {
    getById: async (
      organizationId: string,
      requestId: string
    ): Promise<TRecord | null> => {
      const [row] = await database
        .select()
        .from(queryTable)
        .where(
          and(
            eq(queryTable.organizationId, organizationId),
            eq(queryTable.id, requestId)
          )
        )
        .limit(1);

      return row ? mapRow(row as Record<string, unknown>) : null;
    },
    listForOrg: async (
      organizationId: string,
      limit = 200
    ): Promise<TRecord[]> => {
      const rows = await database
        .select()
        .from(queryTable)
        .where(eq(queryTable.organizationId, organizationId))
        .orderBy(desc(queryTable.createdAt))
        .limit(limit);

      return rows.map((row) => mapRow(row as Record<string, unknown>));
    },
  };
};
