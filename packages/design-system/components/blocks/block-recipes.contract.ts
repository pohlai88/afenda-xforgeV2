import { z } from "zod"

import { afendaBlockRecipe } from "./block-recipes"

const afendaBlockRecipeOwnerSchema = z.enum([
  "shell",
  "header",
  "toolbar",
  "panel",
  "section",
  "metric",
  "empty",
  "density",
])

const afendaBlockRecipeKindSchema = z.enum([
  "composition",
  "layout",
  "typography",
])

const afendaBlockRecipeScopeSchema = z.enum(["block", "block-family"])

const afendaBlockRecipeEntrySchema = z.object({
  owner: afendaBlockRecipeOwnerSchema,
  kind: afendaBlockRecipeKindSchema,
  scope: afendaBlockRecipeScopeSchema,
  description: z.string().min(1),
  className: z.string().min(1),
})

const afendaBlockRecipeContractSchema = z.record(
  z.string(),
  afendaBlockRecipeEntrySchema
)

afendaBlockRecipeContractSchema.parse(afendaBlockRecipe)

export {
  afendaBlockRecipeContractSchema,
  afendaBlockRecipeEntrySchema,
  afendaBlockRecipeKindSchema,
  afendaBlockRecipeOwnerSchema,
  afendaBlockRecipeScopeSchema,
}
