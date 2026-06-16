import { afendaRecipe } from "../components/afenda-ui/recipes";
import { afendaBlockRecipe } from "../components/blocks/block-recipes";

export const AFENDA_RECIPE_IDENTITY_REGISTRY = Object.keys(afendaRecipe);

export const AFENDA_BLOCK_RECIPE_IDENTITY_REGISTRY =
  Object.keys(afendaBlockRecipe);

export type AfendaRecipeIdentity = keyof typeof afendaRecipe;
export type AfendaBlockRecipeIdentity = keyof typeof afendaBlockRecipe;

