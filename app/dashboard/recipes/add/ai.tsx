import { RecipeAddDetailsScreen } from "@/components/dashboard/recipes/RecipeAddFlowScreen";
import { getSingleParamValue } from "@/lib/utils/search-params";
import { useRecipeCollectionState } from "@/stores/recipesStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";

export default function RecipeAddAiRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ collectionId?: string | string[] }>();
  const collectionId = getSingleParamValue(params.collectionId) ?? "";
  const { currentRecipeDraft, setRecipeDraftField } = useRecipeCollectionState(collectionId);

  useEffect(() => {
    if (currentRecipeDraft.source === "ai") {
      return;
    }

    router.replace({
      pathname: "/dashboard/recipes/add",
      params: { collectionId },
    });
  }, [collectionId, currentRecipeDraft.source, router]);

  return (
    <RecipeAddDetailsScreen
      source="ai"
      draft={currentRecipeDraft}
      onBack={() => router.back()}
      onChangeTitle={(value) => setRecipeDraftField("title", value)}
      onSubmit={() =>
        router.push({
          pathname: "/dashboard/recipes/add/generating",
          params: { collectionId },
        })
      }
    />
  );
}
