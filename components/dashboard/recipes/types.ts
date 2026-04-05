import type { RecipeId } from "@/components/dashboard/data";

export type RecipeSource = "manual" | "link" | "document" | "video" | "ai";
export type RecipeTone = "tomato" | "sage" | "butter" | "berry";

export type PresetSavedRecipe = {
  id: string;
  kind: "preset";
  presetId: RecipeId;
  source: RecipeSource;
  tone: RecipeTone;
  image?: string;
};

export type CustomSavedRecipe = {
  id: string;
  kind: "custom";
  title: string;
  totalMinutes: number;
  servings: number;
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
  ingredients: string[];
  steps: string[];
  source: RecipeSource;
  tone: RecipeTone;
  image?: string;
};

export type SavedRecipe = PresetSavedRecipe | CustomSavedRecipe;

export type RecipeCollection = {
  id: string;
  name: string;
  tone: RecipeTone;
  recipeIds: string[];
  image?: string;
};

export type RecipeDraft = {
  title: string;
  source: RecipeSource;
  totalMinutes: string;
  servings: string;
};
