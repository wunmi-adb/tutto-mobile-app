import { RecipeAddGeneratingScreen } from "@/components/dashboard/recipes/RecipeAddFlowScreen";
import { getSingleParamValue } from "@/lib/utils/search-params";
import { useRecipeCollectionState } from "@/stores/recipesStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";

export default function RecipeAddGeneratingRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ collectionId?: string | string[] }>();
  const collectionId = getSingleParamValue(params.collectionId) ?? "";
  const { currentRecipeDraft, saveRecipe } = useRecipeCollectionState(collectionId);

  useEffect(() => {
    if (currentRecipeDraft.source === "ai") {
      return;
    }

    router.replace({
      pathname: "/dashboard/recipes/add/ai",
      params: { collectionId },
    });
  }, [collectionId, currentRecipeDraft.source, router]);

  return (
    <RecipeAddGeneratingScreen
      onBack={() => router.back()}
      onFinish={() => {
        saveRecipe();
        router.replace(`/dashboard/recipes/${collectionId}`);
      }}
    />
  );
}
