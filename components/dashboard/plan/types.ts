import type { MealTypeId, RecipeId } from "@/components/dashboard/data";

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

export type MealSlot = {
  id: string;
  type: MealTypeId;
  recipe: MealRecipe | null;
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
