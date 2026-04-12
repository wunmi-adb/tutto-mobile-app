import { RecipeAddSourceScreen } from "@/components/dashboard/recipes/RecipeAddFlowScreen";
import { getSingleParamValue } from "@/lib/utils/search-params";
import { useRecipeCollectionState } from "@/stores/recipesStore";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function RecipeAddSourceRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ collectionId?: string | string[] }>();
  const collectionId = getSingleParamValue(params.collectionId) ?? "";
  const { setRecipeDraftField } = useRecipeCollectionState(collectionId);

  const handleSelectSource = (source: "link" | "document" | "video" | "ai") => {
    setRecipeDraftField("source", source);
    router.push({
      pathname: `/dashboard/recipes/add/${source}`,
      params: { collectionId },
    });
  };

  return (
    <RecipeAddSourceScreen
      onBack={() => router.back()}
      onSelectSource={handleSelectSource}
    />
  );
}
