import "server-only";

import { database } from "@repo/database";
import {
  orbitPushDestination,
  orbitPushTemplate,
} from "@repo/database/schema";
import { and, eq, isNull, or } from "drizzle-orm";
import type {
  PushDestinationDefinition,
} from "../../contract/push.schema";
import type { PushTemplateDefinition } from "../../contract/template.schema";
import { pushDestinationSchema } from "../../contract/push.schema";
import { pushTemplateSchema } from "../../contract/template.schema";
import {
  listInMemoryPushDestinations,
  type ResolvePushDestinationsInput,
  resolvePushDestinationsWithList,
} from "./push-destination-registry";
import { ensureSystemPushDefaults } from "./system-defaults";
import { listInMemoryPushTemplates } from "./template-registry";

const parseDestinationRow = (
  row: typeof orbitPushDestination.$inferSelect
): PushDestinationDefinition | null => {
  const parsed = pushDestinationSchema.safeParse({
    id: row.destinationId,
    label: row.label,
    templateId: row.templateId,
    requiredCapabilities: row.requiredCapabilities,
    visibleToRoles: row.visibleToRoles,
  });

  return parsed.success ? parsed.data : null;
};

const parseTemplateRow = (
  row: typeof orbitPushTemplate.$inferSelect
): PushTemplateDefinition | null => {
  const parsed = pushTemplateSchema.safeParse({
    id: row.id,
    destinationId: row.destinationId,
    label: row.label,
    fields: row.fields,
  });

  return parsed.success ? parsed.data : null;
};

export const loadMergedPushDestinations = async (
  organizationId: string
): Promise<PushDestinationDefinition[]> => {
  ensureSystemPushDefaults();

  const rows = await database
    .select()
    .from(orbitPushDestination)
    .where(
      and(
        or(
          eq(orbitPushDestination.organizationId, organizationId),
          isNull(orbitPushDestination.organizationId)
        ),
        eq(orbitPushDestination.enabled, true)
      )
    );

  const merged = new Map<string, PushDestinationDefinition>();

  for (const destination of listInMemoryPushDestinations()) {
    merged.set(destination.id, destination);
  }

  for (const row of rows) {
    const parsed = parseDestinationRow(row);

    if (parsed) {
      merged.set(parsed.id, parsed);
    }
  }

  return [...merged.values()];
};

export const getMergedPushDestination = async (
  organizationId: string,
  destinationId: string
): Promise<PushDestinationDefinition | null> => {
  const destinations = await loadMergedPushDestinations(organizationId);
  return destinations.find((entry) => entry.id === destinationId) ?? null;
};

export const loadMergedPushTemplates = async (
  organizationId: string
): Promise<PushTemplateDefinition[]> => {
  ensureSystemPushDefaults();

  const rows = await database
    .select()
    .from(orbitPushTemplate)
    .where(
      or(
        eq(orbitPushTemplate.organizationId, organizationId),
        isNull(orbitPushTemplate.organizationId)
      )
    );

  const merged = new Map<string, PushTemplateDefinition>();

  for (const template of listInMemoryPushTemplates()) {
    merged.set(template.id, template);
  }

  for (const row of rows) {
    const parsed = parseTemplateRow(row);

    if (parsed) {
      merged.set(parsed.id, parsed);
    }
  }

  return [...merged.values()];
};

export const getMergedPushTemplate = async (
  organizationId: string,
  templateId: string
): Promise<PushTemplateDefinition | null> => {
  const templates = await loadMergedPushTemplates(organizationId);
  return templates.find((entry) => entry.id === templateId) ?? null;
};

export const resolveOrgPushDestinations = async (
  input: ResolvePushDestinationsInput
): Promise<PushDestinationDefinition[]> => {
  const destinations = await loadMergedPushDestinations(input.orgId);
  return resolvePushDestinationsWithList(input, destinations);
};

export const resolveMissingTemplateFieldsForOrg = async (
  organizationId: string,
  templateId: string,
  provided: Record<string, unknown>
): Promise<string[]> => {
  const template = await getMergedPushTemplate(organizationId, templateId);

  if (!template) {
    return [];
  }

  return template.fields
    .filter((field) => field.required)
    .filter((field) => {
      const value = provided[field.key];
      return value === undefined || value === null || value === "";
    })
    .map((field) => field.key);
};
