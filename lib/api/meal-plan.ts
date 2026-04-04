import { apiClient } from "@/lib/api/client";
import { ApiResponse, getApiErrorDetails } from "@/lib/api/types";
import { useQuery } from "@tanstack/react-query";

export type NextMealSuggestion = {
  cooking_time: number;
  day: string;
  meal_type: "breakfast" | "lunch" | "dinner";
  name: string;
  number_of_ingredients: number;
  number_of_ingredients_available: number;
  servings: number;
  type: "ingredient" | "cooked_meal";
};

export const NEXT_MEAL_SUGGESTION_QUERY_KEY = ["next-meal-suggestion"] as const;
export const NEXT_MEAL_SUGGESTION_POLL_INTERVAL_MS = 5000;

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
