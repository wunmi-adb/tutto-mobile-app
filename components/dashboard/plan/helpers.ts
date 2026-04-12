import {
  RECIPE_DEFINITIONS,
  getRecipeIngredients,
  getRecipeName,
  getRecipeSteps,
  type RecipeId,
} from "@/components/dashboard/data";
import type { TranslationKey } from "@/i18n/messages";
import type { CustomMealRecipe, MealRecipe, ResolvedMealRecipe } from "./types";

type TranslationFn = (key: TranslationKey, params?: Record<string, number | string>) => string;

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === "string");
}

function isPresetMealRecipe(value: unknown): value is Extract<MealRecipe, { kind: "preset" }> {
  if (!value || typeof value !== "object") {
    return false;
  }

  const parsed = value as Record<string, unknown>;

  return parsed.kind === "preset" && typeof parsed.recipeId === "string";
}

function isCustomMealRecipe(value: unknown): value is CustomMealRecipe {
  if (!value || typeof value !== "object") {
    return false;
  }

  const parsed = value as Record<string, unknown>;

  return (
    parsed.kind === "custom" &&
    typeof parsed.name === "string" &&
    typeof parsed.timeMinutes === "number" &&
    typeof parsed.servings === "number" &&
    typeof parsed.calories === "number" &&
    typeof parsed.protein === "string" &&
    typeof parsed.carbs === "string" &&
    typeof parsed.fat === "string" &&
    isStringArray(parsed.ingredients) &&
    isStringArray(parsed.steps)
  );
}

export function resolveMealRecipe(recipe: MealRecipe, t: TranslationFn): ResolvedMealRecipe {
  if (recipe.kind === "preset") {
    const definition = RECIPE_DEFINITIONS[recipe.recipeId];

    return {
      name: getRecipeName(t, recipe.recipeId),
      timeMinutes: definition.timeMinutes,
      servings: definition.servings,
      calories: definition.calories,
      protein: definition.protein,
      carbs: definition.carbs,
      fat: definition.fat,
      ingredients: getRecipeIngredients(t, recipe.recipeId),
      steps: getRecipeSteps(t, recipe.recipeId),
    };
  }

  return recipe;
}

export function serializeMealRecipe(recipe: MealRecipe): string {
  return JSON.stringify(recipe);
}

export function parseMealRecipe(value: string | string[] | undefined): MealRecipe | null {
  if (!value || Array.isArray(value)) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as unknown;

    if (isPresetMealRecipe(parsed)) {
      return { kind: "preset", recipeId: parsed.recipeId as RecipeId };
    }

    if (isCustomMealRecipe(parsed)) {
      return {
        kind: "custom",
        name: parsed.name,
        timeMinutes: parsed.timeMinutes,
        servings: parsed.servings,
        calories: parsed.calories,
        protein: parsed.protein,
        carbs: parsed.carbs,
        fat: parsed.fat,
        ingredients: parsed.ingredients,
        steps: parsed.steps,
      };
    }
  } catch {
    return null;
  }

  return null;
}
