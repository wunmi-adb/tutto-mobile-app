import type { MealTypeId } from "@/components/dashboard/data";
import RecipeDetailScreen from "@/components/dashboard/plan/RecipeDetailScreen";
import { parseMealRecipe, serializeMealRecipe } from "@/components/dashboard/plan/helpers";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";

export default function PlanMealScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    dayIdx?: string;
    mealId?: string;
    mealType?: MealTypeId;
    recipe?: string;
  }>();

  const recipe = parseMealRecipe(params.recipe);

  useEffect(() => {
    if (!recipe || !params.mealType) {
      router.replace("/dashboard/plan");
    }
  }, [params.mealType, recipe, router]);

  if (!recipe || !params.mealType) {
    return null;
  }

  return (
    <RecipeDetailScreen
      mealType={params.mealType}
      recipe={recipe}
      onBack={() => router.back()}
      onStartCooking={() =>
        router.push({
          pathname: "/dashboard/plan/cook",
          params: {
            dayIdx: params.dayIdx,
            mealId: params.mealId,
            mealType: params.mealType,
            recipe: serializeMealRecipe(recipe),
          },
        })
      }
    />
  );
}
