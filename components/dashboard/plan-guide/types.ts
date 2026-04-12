export type SuggestionType = "meal" | "snack";
export type MealTime = "breakfast" | "lunch" | "dinner";

export type Suggestion = {
  id: string;
  name: string;
  time: string;
  servings: number;
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
  type: SuggestionType;
  mealTime?: MealTime;
  available: number;
  total: number;
  ingredients: string[];
  steps: string[];
  inPantry?: boolean;
};
