import "server-only";

import { createId } from "@paralleldrive/cuid2";
import {
  database,
  orbitPushDestination,
  orbitPushTemplate,
} from "@repo/database";
import { and, eq, isNotNull } from "drizzle-orm";
import type { PushDestinationDefinition } from "../../contract/push.schema";
import type { PushTemplateDefinition } from "../../contract/template.schema";
import {
  deletePushDestinationSchema,
  deletePushTemplateSchema,
  upsertPushDestinationSchema,
  upsertPushTemplateSchema,
} from "../../contract/registry.schema";
import { pushDestinationSchema } from "../../contract/push.schema";
import { pushTemplateSchema } from "../../contract/template.schema";
import {
  loadMergedPushDestinations,
  loadMergedPushTemplates,
} from "./push-registry-store";

export type AdminPushDestinationRow = {
  rowId: string;
  organizationId: string | null;
  definition: PushDestinationDefinition;
  enabled: boolean;
  isSystem: boolean;
};

export type AdminPushTemplateRow = {
  rowId: string;
  organizationId: string | null;
  definition: PushTemplateDefinition;
  isSystem: boolean;
};

export const listAdminPushRegistry = async (organizationId: string) => {
  const [destinationRows, templateRows, mergedDestinations, mergedTemplates] =
    await Promise.all([
      database.select().from(orbitPushDestination),
      database.select().from(orbitPushTemplate),
      loadMergedPushDestinations(organizationId),
      loadMergedPushTemplates(organizationId),
    ]);

  const destinations: AdminPushDestinationRow[] = destinationRows
    .filter(
      (row) =>
        row.organizationId === null || row.organizationId === organizationId
    )
    .flatMap((row) => {
      const parsed = pushDestinationSchema.safeParse({
        id: row.destinationId,
        label: row.label,
        templateId: row.templateId,
        requiredCapabilities: row.requiredCapabilities,
        visibleToRoles: row.visibleToRoles,
      });

      if (!parsed.success) {
        return [];
      }

      return [
        {
          rowId: row.id,
          organizationId: row.organizationId,
          definition: parsed.data,
          enabled: row.enabled,
          isSystem: row.organizationId === null,
        },
      ];
    });

  const templates: AdminPushTemplateRow[] = templateRows
    .filter(
      (row) =>
        row.organizationId === null || row.organizationId === organizationId
    )
    .flatMap((row) => {
      const parsed = pushTemplateSchema.safeParse({
        id: row.id,
        destinationId: row.destinationId,
        label: row.label,
        fields: row.fields,
      });

      if (!parsed.success) {
        return [];
      }

      return [
        {
          rowId: row.id,
          organizationId: row.organizationId,
          definition: parsed.data,
          isSystem: row.organizationId === null,
        },
      ];
    });

  return {
    destinations,
    templates,
    mergedDestinations,
    mergedTemplates,
  };
};

export const upsertOrgPushDestination = async (
  organizationId: string,
  input: unknown
) => {
  const parsed = upsertPushDestinationSchema.parse(input);
  const now = new Date();

  const [existing] = await database
    .select({ id: orbitPushDestination.id })
    .from(orbitPushDestination)
    .where(
      and(
        eq(orbitPushDestination.organizationId, organizationId),
        eq(orbitPushDestination.destinationId, parsed.id)
      )
    )
    .limit(1);

  if (existing) {
    await database
      .update(orbitPushDestination)
      .set({
        label: parsed.label,
        templateId: parsed.templateId,
        requiredCapabilities: parsed.requiredCapabilities,
        visibleToRoles: parsed.visibleToRoles,
        enabled: parsed.enabled,
        updatedAt: now,
      })
      .where(eq(orbitPushDestination.id, existing.id));

    return existing.id;
  }

  const rowId = createId();

  await database.insert(orbitPushDestination).values({
    id: rowId,
    organizationId,
    destinationId: parsed.id,
    label: parsed.label,
    templateId: parsed.templateId,
    requiredCapabilities: parsed.requiredCapabilities,
    visibleToRoles: parsed.visibleToRoles,
    enabled: parsed.enabled,
    updatedAt: now,
  });

  return rowId;
};

export const deleteOrgPushDestination = async (
  organizationId: string,
  input: unknown
) => {
  const parsed = deletePushDestinationSchema.parse(input);

  const result = await database
    .delete(orbitPushDestination)
    .where(
      and(
        eq(orbitPushDestination.organizationId, organizationId),
        eq(orbitPushDestination.destinationId, parsed.destinationId),
        isNotNull(orbitPushDestination.organizationId)
      )
    );

  return result.rowCount ?? 0;
};

export const upsertOrgPushTemplate = async (
  organizationId: string,
  input: unknown
) => {
  const parsed = upsertPushTemplateSchema.parse(input);
  const now = new Date();

  const [existing] = await database
    .select({
      id: orbitPushTemplate.id,
      organizationId: orbitPushTemplate.organizationId,
    })
    .from(orbitPushTemplate)
    .where(eq(orbitPushTemplate.id, parsed.id))
    .limit(1);

  if (existing?.organizationId === null) {
    throw new Error("System templates cannot be overwritten");
  }

  if (existing) {
    if (existing.organizationId !== organizationId) {
      throw new Error("Template belongs to another organization");
    }

    await database
      .update(orbitPushTemplate)
      .set({
        destinationId: parsed.destinationId,
        label: parsed.label,
        fields: parsed.fields,
        updatedAt: now,
      })
      .where(eq(orbitPushTemplate.id, parsed.id));

    return parsed.id;
  }

  await database.insert(orbitPushTemplate).values({
    id: parsed.id,
    organizationId,
    destinationId: parsed.destinationId,
    label: parsed.label,
    fields: parsed.fields,
    updatedAt: now,
  });

  return parsed.id;
};

export const deleteOrgPushTemplate = async (
  organizationId: string,
  input: unknown
) => {
  const parsed = deletePushTemplateSchema.parse(input);

  const result = await database
    .delete(orbitPushTemplate)
    .where(
      and(
        eq(orbitPushTemplate.id, parsed.templateId),
        eq(orbitPushTemplate.organizationId, organizationId),
        isNotNull(orbitPushTemplate.organizationId)
      )
    );

  return result.rowCount ?? 0;
};
