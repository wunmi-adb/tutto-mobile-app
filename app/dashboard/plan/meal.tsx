import type { MealTypeId } from "@/components/dashboard/data";
import RecipeDetailScreen from "@/components/dashboard/plan/RecipeDetailScreen";
import { parseMealRecipe, serializeMealRecipe } from "@/components/dashboard/plan/helpers";
import type { MealRecipe } from "@/components/dashboard/plan/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";

export default function PlanMealScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    mealType?: MealTypeId;
    recipe?: string;
  }>();
  const recipe = parseMealRecipe(params.recipe);

  useEffect(() => {
    if (!recipe || !params.mealType) {
      router.back();
    }
  }, [params.mealType, recipe, router]);

  if (!params.mealType) {
    return null;
  }

  if (!recipe) {
    return null;
  }

  return (
    <RecipeDetailScreen
      mealType={params.mealType}
      recipe={recipe}
      onBack={() => router.back()}
      onSave={(nextRecipe: MealRecipe) =>
        router.replace({
          pathname: "/dashboard/plan/meal",
          params: {
            mealType: params.mealType,
            recipe: serializeMealRecipe(nextRecipe),
          },
        })
      }
      onCookedThis={() => {}}
      onStartCooking={(nextRecipe) =>
        router.push({
          pathname: "/dashboard/plan/cook",
          params: {
            mealType: params.mealType,
            origin: "plan",
            recipe: serializeMealRecipe(nextRecipe),
          },
        })
      }
    />
  );
}
