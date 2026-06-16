import type { PushTemplateDefinition } from "../../contract/template.schema";

const templates = new Map<string, PushTemplateDefinition>();

export const registerPushTemplate = (
  definition: PushTemplateDefinition
): void => {
  templates.set(definition.id, definition);
};

export const clearPushTemplates = (): void => {
  templates.clear();
};

export const getPushTemplate = (
  templateId: string
): PushTemplateDefinition | null => templates.get(templateId) ?? null;

export const listPushTemplatesForDestination = (
  destinationId: string
): PushTemplateDefinition[] =>
  [...templates.values()].filter(
    (template) => template.destinationId === destinationId
  );

export const resolveMissingTemplateFields = (
  templateId: string,
  provided: Record<string, unknown>
): string[] => {
  const template = getPushTemplate(templateId);

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
