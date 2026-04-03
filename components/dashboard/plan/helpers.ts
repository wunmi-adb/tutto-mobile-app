import {
  RECIPE_DEFINITIONS,
  getRecipeIngredients,
  getRecipeName,
  getRecipeSteps,
  type MealTypeId,
  type RecipeId,
} from "@/components/dashboard/data";
import type { TranslationKey } from "@/i18n/messages";
import type { DayPlan, MealRecipe, ResolvedMealRecipe } from "./types";

type TranslationFn = (key: TranslationKey, params?: Record<string, number | string>) => string;

const RECIPE_POOLS: Record<MealTypeId, RecipeId[]> = {
  breakfast: ["avocadoEggsToast", "oatPorridgeBerries"],
  brunch: [],
  lunch: ["jollofRiceChicken", "mediterraneanWrap"],
  snack: [],
  dinner: ["spaghettiBolognese", "grilledSalmonGreens"],
  supper: [],
};

export const ADDABLE_MEAL_TYPES: MealTypeId[] = [
  "breakfast",
  "brunch",
  "lunch",
  "snack",
  "dinner",
  "supper",
];

export function pickRandomRecipe(type: MealTypeId): MealRecipe | null {
  const pool = RECIPE_POOLS[type];

  if (!pool.length) {
    return null;
  }

  return {
    kind: "preset",
    recipeId: pool[Math.floor(Math.random() * pool.length)],
  };
}

export function generateWeek(): DayPlan[] {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

  return Array.from({ length: 7 }, (_, index) => {
    const currentDate = new Date(monday);
    currentDate.setDate(monday.getDate() + index);

    return {
      date: currentDate.toISOString(),
      meals: [
        { id: `${index}-b`, type: "breakfast", recipe: pickRandomRecipe("breakfast") },
        { id: `${index}-l`, type: "lunch", recipe: pickRandomRecipe("lunch") },
        { id: `${index}-d`, type: "dinner", recipe: pickRandomRecipe("dinner") },
      ],
    };
  });
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
    const parsed = JSON.parse(value) as Partial<MealRecipe>;

    if (parsed.kind === "preset" && typeof parsed.recipeId === "string") {
      return { kind: "preset", recipeId: parsed.recipeId as RecipeId };
    }

    if (
      parsed.kind === "custom" &&
      typeof parsed.name === "string" &&
      typeof parsed.timeMinutes === "number" &&
      typeof parsed.servings === "number" &&
      typeof parsed.calories === "number" &&
      typeof parsed.protein === "string" &&
      typeof parsed.carbs === "string" &&
      typeof parsed.fat === "string" &&
      Array.isArray(parsed.ingredients) &&
      Array.isArray(parsed.steps)
    ) {
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
