import { z } from "zod";

import { afendaRecipe } from "./recipes";

const afendaRecipeOwnerSchema = z.enum([
  "typography",
  "primitive",
  "surface",
  "overlay",
  "row",
  "state",
  "motion",
  "icon",
  "spacing",
]);

const afendaRecipeKindSchema = z.enum([
  "composition",
  "interaction",
  "layout",
  "motion",
]);

const afendaRecipeScopeSchema = z.enum(["global", "component-family"]);

const afendaRecipeEntrySchema = z.object({
  owner: afendaRecipeOwnerSchema,
  kind: afendaRecipeKindSchema,
  scope: afendaRecipeScopeSchema,
  description: z.string().min(1),
  className: z.string().min(1),
});

const afendaRecipeContractSchema = z.record(
  z.string(),
  afendaRecipeEntrySchema
);

afendaRecipeContractSchema.parse(afendaRecipe);

export {
  afendaRecipeContractSchema,
  afendaRecipeEntrySchema,
  afendaRecipeKindSchema,
  afendaRecipeOwnerSchema,
  afendaRecipeScopeSchema,
};
