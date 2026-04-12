import type { MealTypeId, RecipeId } from "@/components/dashboard/data";
import type { FillLevel } from "@/lib/inventory/types";

export type CustomMealRecipe = {
  kind: "custom";
  name: string;
  timeMinutes: number;
  servings: number;
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
  ingredients: string[];
  steps: string[];
};

export type MealRecipe =
  | { kind: "preset"; recipeId: RecipeId }
  | CustomMealRecipe;

export type CookedMealPlanEntry = {
  kind: "cooked_meal";
  fillLevel?: FillLevel;
  itemKey: string;
  location: string;
  storageLocationKey?: string;
  name: string;
};

export type PlannedMeal =
  | {
      kind: "recipe";
      recipe: MealRecipe;
    }
  | CookedMealPlanEntry;

export type MealSlot = {
  id: string;
  type: MealTypeId;
  meal: PlannedMeal;
};

export type DayPlan = {
  date: string;
  meals: MealSlot[];
};

export type ResolvedMealRecipe = {
  name: string;
  timeMinutes: number;
  servings: number;
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
  ingredients: string[];
  steps: string[];
};
