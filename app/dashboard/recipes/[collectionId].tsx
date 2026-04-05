import RecipeCollectionScreen from "@/components/dashboard/recipes/RecipeCollectionScreen";
import { getSingleParamValue } from "@/lib/utils/add-items";
import { useLocalSearchParams } from "expo-router";

export default function RecipeCollectionRoute() {
  const params = useLocalSearchParams<{ collectionId?: string | string[] }>();
  const collectionId = getSingleParamValue(params.collectionId) ?? "";

  return <RecipeCollectionScreen collectionId={collectionId} />;
}
