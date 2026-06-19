import "server-only";

import { database } from "@repo/database";
import { and, desc, eq } from "drizzle-orm";
import type { ListMorphLifecycleFilter } from "../../contract/morph-lifecycle.schema";
import type {
  MorphLifecycleCoreRecord,
  MorphLifecycleSegment,
} from "../../contract/morph-lifecycle.types";
import type { OrbitMorphStatus } from "../../contract/morph-status";
import {
  applyMorphLifecyclePatch,
  readMorphLifecycleCoreFields,
  type MorphLifecycleRowShape,
} from "./read-morph-lifecycle-row";
import { recordMorphPilotActivity } from "./record-morph-pilot-activity";
import type { MorphTwoFieldTable } from "./two-field-morph-table";

export interface TwoFieldMorphUpdatePatch {
  assigneeId?: string | null;
  status?: OrbitMorphStatus;
  title?: string;
  values?: Record<string, string | null>;
}

const readOptionalText = (value: unknown): string | null =>
  typeof value === "string" && value.length > 0 ? value : null;

export const createTwoFieldMorphLifecycleEngine = <
  TFieldA extends string,
  TFieldB extends string,
>({
  activitySegment,
  fieldAKey,
  fieldBKey,
  table,
}: {
  activitySegment: MorphLifecycleSegment;
  fieldAKey: TFieldA;
  fieldBKey: TFieldB;
  table: MorphTwoFieldTable;
}) => {
  type TwoFieldMorphRecord = MorphLifecycleCoreRecord & {
    [K in TFieldA | TFieldB]: string | null;
  };

  const mapRow = (row: MorphLifecycleRowShape): TwoFieldMorphRecord | null => {
    const core = readMorphLifecycleCoreFields(row);

    if (!core) {
      return null;
    }

    const typedRow = row as MorphLifecycleRowShape & Record<string, unknown>;

    return {
      ...core,
      [fieldAKey]: readOptionalText(typedRow[fieldAKey]),
      [fieldBKey]: readOptionalText(typedRow[fieldBKey]),
    } as TwoFieldMorphRecord;
  };

  const getById = async (organizationId: string, requestId: string) => {
    const [row] = await database
      .select()
      .from(table)
      .where(
        and(
          eq(table.organizationId, organizationId),
          eq(table.id, requestId)
        )
      )
      .limit(1);

    return row ? mapRow(row as unknown as MorphLifecycleRowShape) : null;
  };

  const listForOrg = async (
    organizationId: string,
    filters: ListMorphLifecycleFilter = {}
  ) => {
    const conditions = [eq(table.organizationId, organizationId)];

    if (filters.status) {
      conditions.push(eq(table.status, filters.status));
    }

    if (filters.assigneeId) {
      conditions.push(eq(table.assigneeId, filters.assigneeId));
    }

    const rows = await database
      .select()
      .from(table)
      .where(and(...conditions))
      .orderBy(desc(table.updatedAt))
      .limit(filters.limit ?? 200);

    return rows
      .map((row) => mapRow(row as unknown as MorphLifecycleRowShape))
      .filter((record): record is NonNullable<ReturnType<typeof mapRow>> => record !== null);
  };

  const updateFields = async (
    organizationId: string,
    actorId: string,
    requestId: string,
    patch: TwoFieldMorphUpdatePatch
  ) => {
    const existing = await getById(organizationId, requestId);

    if (!existing) {
      return null;
    }

    const now = new Date();
    const updates: Partial<(typeof table)["$inferInsert"]> = {
      updatedAt: now,
    };

    applyMorphLifecyclePatch(updates, patch);

    if (patch.values?.[fieldAKey] !== undefined) {
      updates[fieldAKey as keyof (typeof table)["$inferInsert"]] =
        patch.values[fieldAKey] as never;
    }

    if (patch.values?.[fieldBKey] !== undefined) {
      updates[fieldBKey as keyof (typeof table)["$inferInsert"]] =
        patch.values[fieldBKey] as never;
    }

    await database
      .update(table)
      .set(updates)
      .where(
        and(eq(table.id, requestId), eq(table.organizationId, organizationId))
      );

    await recordMorphPilotActivity({
      activitySegment,
      actorId,
      organizationId,
      originCaseId: existing.originCaseId,
      payload: patch,
      requestId,
    });

    return getById(organizationId, requestId);
  };

  return {
    getById,
    listForOrg,
    updateFields,
  };
};

export type TwoFieldMorphLifecycleRecord = NonNullable<
  Awaited<
    ReturnType<ReturnType<typeof createTwoFieldMorphLifecycleEngine>["getById"]>
  >
>;
