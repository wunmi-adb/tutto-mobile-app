import type { MealTypeId } from "@/components/dashboard/data";
import { useI18n } from "@/i18n";
import { isTranslationKey } from "@/i18n/messages";
import { apiClient } from "@/lib/api/client";
import { ApiResponse, getApiErrorDetails } from "@/lib/api/types";
import type { MealRecipe } from "@/components/dashboard/plan/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner-native";

export type MealPlanEntryResponse = {
  calories_kcal?: number | null;
  key: string;
  linked_item_key?: string | null;
  meal_type: MealPlanMealType;
  source_item_type?: "ingredient" | "cooked_meal" | null;
  source_type?: string | null;
  title: string;
  total_minutes?: number | null;
};

export type MealPlanDayResponse = {
  date: string;
  meals: MealPlanEntryResponse[];
};

export type UpcomingMealPlanResponse = {
  days: MealPlanDayResponse[];
  end_date: string;
  start_date: string;
};

export type DeleteMealPlanEntryResponse = {
  key: string;
};

export type CreateMealPlanEntryInput = {
  date: string;
  item_key?: string;
  meal_type: MealPlanMealType;
  name: string;
  type: "recipe" | "cooked_meal";
};

export type MealPlanRecipeIngredientResponse = {
  amount?: string | null;
  amount_text?: string | null;
  inventory_match_name?: string | null;
  is_available: boolean;
  key: string;
  matched_batch_key?: string | null;
  matched_item_key?: string | null;
  name: string;
};

export type MealPlanRecipeInstructionResponse = {
  key: string;
  step: number;
  text: string;
  timer_seconds?: number | null;
};

export type MealPlanRecipeDetailResponse = {
  calories_kcal?: number | null;
  carbs_g?: number | null;
  date: string;
  fat_g?: number | null;
  inventory_match_score?: number | null;
  key: string;
  meal_type: MealPlanMealType;
  protein_g?: number | null;
  recipe: {
    allergen_tags?: string[] | null;
    appliance_tags?: string[] | null;
    calories_kcal?: number | null;
    dietary_tags?: string[] | null;
    ingredients?: MealPlanRecipeIngredientResponse[] | null;
    instructions?: MealPlanRecipeInstructionResponse[] | null;
    linked_item_key?: string | null;
    macros?: {
      carbs_g?: number | null;
      fat_g?: number | null;
      protein_g?: number | null;
    } | null;
    meal_type: MealPlanMealType;
    prioritized_available_items?: string[] | null;
    servings?: number | null;
    source_type?: string | null;
    summary?: string | null;
    title: string;
    total_minutes?: number | null;
  };
  servings?: number | null;
  title: string;
  total_minutes?: number | null;
};

export const MEAL_PLAN_QUERY_KEY = ["meal-plan"] as const;
export const MEAL_PLAN_RECIPE_DETAIL_QUERY_KEY = ["meal-plan-recipe-detail"] as const;
export type MealPlanMealType = Extract<MealTypeId, "breakfast" | "lunch" | "dinner">;
export type NextMealSuggestion = {
  cooking_time: number;
  day: string;
  meal_type: MealPlanMealType;
  name: string;
  number_of_ingredients: number;
  number_of_ingredients_available: number;
  servings: number;
  type: "ingredient" | "cooked_meal";
};

export const NEXT_MEAL_SUGGESTION_QUERY_KEY = ["next-meal-suggestion"] as const;
export const NEXT_MEAL_SUGGESTION_POLL_INTERVAL_MS = 5000;

export function isMealPlanEntryKey(value: string | undefined): value is string {
  if (!value) {
    return false;
  }

  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

export function toMealPlanMealType(type: MealTypeId): MealPlanMealType {
  if (type === "breakfast" || type === "lunch" || type === "dinner") {
    return type;
  }

  throw new Error(`Unsupported meal plan type: ${type}`);
}

export async function getUpcomingMealPlan() {
  const response = await apiClient.get<ApiResponse<UpcomingMealPlanResponse>>("/api/v1/meal-plan");

  return response.data.data;
}

export function useUpcomingMealPlan(enabled = true) {
  return useQuery({
    queryKey: MEAL_PLAN_QUERY_KEY,
    queryFn: getUpcomingMealPlan,
    enabled,
    staleTime: 60_000,
  });
}

export async function deleteMealPlanEntry(entryKey: string) {
  const response = await apiClient.delete<ApiResponse<DeleteMealPlanEntryResponse>>(
    `/api/v1/meal-plan/${entryKey}`,
  );

  return response.data.data;
}

export function useDeleteMealPlanEntry() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMealPlanEntry,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: MEAL_PLAN_QUERY_KEY });
      toast.success(t("kitchen.plan.deleteSuccess"));
    },
    onError: (error) => {
      console.log(
        "Error deleting meal plan entry:",
        JSON.stringify(getApiErrorDetails(error)),
        JSON.stringify(error),
      );
      const errorDetails = getApiErrorDetails(error);
      const errorMessage =
        typeof errorDetails.message === "string" && isTranslationKey(errorDetails.message)
          ? t(errorDetails.message)
          : t("kitchen.plan.deleteError");

      toast.error(errorMessage);
    },
  });
}

export async function createMealPlanEntry(payload: CreateMealPlanEntryInput) {
  const response = await apiClient.post<ApiResponse<MealPlanRecipeDetailResponse>>(
    "/api/v1/meal-plan",
    payload,
  );

  return response.data.data;
}

export function useCreateMealPlanEntry() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMealPlanEntry,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: MEAL_PLAN_QUERY_KEY });
      toast.success(t("kitchen.plan.addSuccess"));
    },
    onError: (error) => {
      console.log(
        "Error adding meal plan entry:",
        JSON.stringify(getApiErrorDetails(error)),
        JSON.stringify(error),
      );
      const errorDetails = getApiErrorDetails(error);
      const errorMessage =
        typeof errorDetails.message === "string" && isTranslationKey(errorDetails.message)
          ? t(errorDetails.message)
          : t("kitchen.plan.addError");

      toast.error(errorMessage);
    },
  });
}

export async function shuffleMealPlanEntry(entryKey: string) {
  const response = await apiClient.post<ApiResponse<MealPlanRecipeDetailResponse>>(
    `/api/v1/meal-plan/${entryKey}/shuffle`,
  );

  return response.data.data;
}

export function useShuffleMealPlanEntry() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: shuffleMealPlanEntry,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: MEAL_PLAN_QUERY_KEY });
      toast.success(t("kitchen.plan.shuffleSuccess"));
    },
    onError: (error) => {
      console.log(
        "Error shuffling meal plan entry:",
        JSON.stringify(getApiErrorDetails(error)),
        JSON.stringify(error),
      );
      const errorDetails = getApiErrorDetails(error);
      const errorMessage =
        typeof errorDetails.message === "string" && isTranslationKey(errorDetails.message)
          ? t(errorDetails.message)
          : t("kitchen.plan.shuffleError");

      toast.error(errorMessage);
    },
  });
}

function formatMacro(value?: number | null) {
  const safeValue = typeof value === "number" && Number.isFinite(value) ? value : 0;

  return `${safeValue}g`;
}

function formatInstructionTimer(timerSeconds?: number | null) {
  if (!timerSeconds || timerSeconds <= 0) {
    return "";
  }

  const hours = Math.floor(timerSeconds / 3600);
  const minutes = Math.floor((timerSeconds % 3600) / 60);
  const seconds = timerSeconds % 60;
  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours} hr`);
  }

  if (minutes > 0) {
    parts.push(`${minutes} min`);
  }

  if (seconds > 0) {
    parts.push(`${seconds} sec`);
  }

  return parts.length ? ` (${parts.join(" ")})` : "";
}

function mapRecipeIngredient(ingredient: MealPlanRecipeIngredientResponse) {
  const amountText = ingredient.amount_text?.trim();

  if (!amountText) {
    return ingredient.name;
  }

  return `${amountText} ${ingredient.name}`.trim();
}

function mapRecipeInstruction(instruction: MealPlanRecipeInstructionResponse) {
  return `${instruction.text}${formatInstructionTimer(instruction.timer_seconds)}`.trim();
}

export function mapMealPlanRecipeDetailToMealRecipe(
  detail: MealPlanRecipeDetailResponse,
): MealRecipe {
  const recipe = detail.recipe;

  return {
    kind: "custom",
    name: recipe.title,
    timeMinutes:
      typeof recipe.total_minutes === "number" && Number.isFinite(recipe.total_minutes)
        ? recipe.total_minutes
        : typeof detail.total_minutes === "number" && Number.isFinite(detail.total_minutes)
          ? detail.total_minutes
          : 0,
    servings:
      typeof recipe.servings === "number" && Number.isFinite(recipe.servings)
        ? recipe.servings
        : typeof detail.servings === "number" && Number.isFinite(detail.servings)
          ? detail.servings
          : 1,
    calories:
      typeof recipe.calories_kcal === "number" && Number.isFinite(recipe.calories_kcal)
        ? recipe.calories_kcal
        : typeof detail.calories_kcal === "number" && Number.isFinite(detail.calories_kcal)
          ? detail.calories_kcal
          : 0,
    protein: formatMacro(recipe.macros?.protein_g ?? detail.protein_g),
    carbs: formatMacro(recipe.macros?.carbs_g ?? detail.carbs_g),
    fat: formatMacro(recipe.macros?.fat_g ?? detail.fat_g),
    ingredients: (recipe.ingredients ?? []).map(mapRecipeIngredient),
    steps: (recipe.instructions ?? [])
      .sort((left, right) => left.step - right.step)
      .map(mapRecipeInstruction),
  };
}

export async function getMealPlanRecipeDetail(entryKey: string) {
  const response = await apiClient.get<ApiResponse<MealPlanRecipeDetailResponse>>(
    `/api/v1/meal-plan/${entryKey}`,
  );

  return response.data.data;
}

export function useMealPlanRecipeDetail(entryKey?: string, enabled = true) {
  return useQuery({
    queryKey: [...MEAL_PLAN_RECIPE_DETAIL_QUERY_KEY, entryKey ?? ""],
    queryFn: () => getMealPlanRecipeDetail(entryKey ?? ""),
    enabled: enabled && Boolean(entryKey),
    staleTime: 60_000,
  });
}

export async function getNextMealSuggestion() {
  try {
    const response = await apiClient.get<ApiResponse<NextMealSuggestion | null>>("/api/v1/meal-plan/next");
    const suggestion = response.data.data ?? null;

    console.log("Next meal poll response", {
      hasData: Boolean(suggestion),
      suggestion,
    });

    return suggestion;
  } catch (error) {
    const errorDetails = getApiErrorDetails(error);

    if (errorDetails.status === 404 && errorDetails.message === "meal_plan.not_found") {
      console.log("Next meal poll pending", {
        errorDetails,
      });
      return null;
    }

    console.error("Next meal poll failed", {
      error,
      errorDetails,
    });
    throw error;
  }
}

export function useNextMealSuggestion(enabled = true) {
  return useQuery({
    queryKey: NEXT_MEAL_SUGGESTION_QUERY_KEY,
    queryFn: getNextMealSuggestion,
    enabled,
    retry: false,
    staleTime: 0,
    refetchInterval: (query) => (query.state.data ? false : NEXT_MEAL_SUGGESTION_POLL_INTERVAL_MS),
    refetchIntervalInBackground: false,
  });
}
