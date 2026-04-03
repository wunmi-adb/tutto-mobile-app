import type { MealTypeId } from "@/components/dashboard/data";
import CookingStoryScreen from "@/components/dashboard/plan/CookingStoryScreen";
import { parseMealRecipe } from "@/components/dashboard/plan/helpers";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";

export default function PlanCookScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
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
    <CookingStoryScreen
      mealType={params.mealType}
      recipe={recipe}
      onBack={() => router.back()}
      onFinish={() => router.back()}
    />
  );
}
