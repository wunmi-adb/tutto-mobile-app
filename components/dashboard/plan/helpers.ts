import {
  RECIPE_DEFINITIONS,
  getRecipeIngredients,
  getRecipeName,
  getRecipeSteps,
  type MealTypeId,
  type RecipeId,
} from "@/components/dashboard/data";
import type { TranslationKey } from "@/i18n/messages";
import type {
  CookedMealPlanEntry,
  CustomMealRecipe,
  DayPlan,
  MealRecipe,
  ResolvedMealRecipe,
} from "./types";

type TranslationFn = (key: TranslationKey, params?: Record<string, number | string>) => string;

const PLAN_MEAL_TYPES = ["breakfast", "lunch", "dinner"] as const satisfies readonly MealTypeId[];

type PlannedMealType = (typeof PLAN_MEAL_TYPES)[number];

const FALLBACK_CUSTOM_RECIPE: MealRecipe = {
  kind: "custom",
  name: "Meal",
  timeMinutes: 30,
  servings: 2,
  calories: 400,
  protein: "20g",
  carbs: "45g",
  fat: "15g",
  ingredients: [],
  steps: [],
};

const RECIPE_POOLS: Record<PlannedMealType, RecipeId[]> = {
  breakfast: ["avocadoEggsToast", "oatPorridgeBerries"],
  lunch: ["jollofRiceChicken", "mediterraneanWrap"],
  dinner: ["spaghettiBolognese", "grilledSalmonGreens"],
};

export const ADDABLE_MEAL_TYPES: MealTypeId[] = [...PLAN_MEAL_TYPES];

function isPlannedMealType(type: MealTypeId): type is PlannedMealType {
  return PLAN_MEAL_TYPES.includes(type as PlannedMealType);
}

function createRecipeMeal(type: PlannedMealType): MealRecipe {
  const recipe = pickRandomRecipe(type);

  if (recipe) {
    return recipe;
  }

  return FALLBACK_CUSTOM_RECIPE;
}

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

export function pickRandomRecipe(type: MealTypeId): MealRecipe | null {
  if (!isPlannedMealType(type)) {
    return null;
  }

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
        {
          id: `${index}-b`,
          type: "breakfast",
          meal: { kind: "recipe", recipe: createRecipeMeal("breakfast") },
        },
        {
          id: `${index}-l`,
          type: "lunch",
          meal: { kind: "recipe", recipe: createRecipeMeal("lunch") },
        },
        {
          id: `${index}-d`,
          type: "dinner",
          meal: { kind: "recipe", recipe: createRecipeMeal("dinner") },
        },
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

export function isCookedMealEntry(meal: DayPlan["meals"][number]["meal"]): meal is CookedMealPlanEntry {
  return meal.kind === "cooked_meal";
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
