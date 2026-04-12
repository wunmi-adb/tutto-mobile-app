import { getSingleParamValue } from "@/lib/utils/search-params";
import { useRecipeCollectionState } from "@/stores/recipesStore";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";

export default function RecipeAddLayout() {
  const router = useRouter();
  const params = useLocalSearchParams<{ collectionId?: string | string[] }>();
  const collectionId = getSingleParamValue(params.collectionId) ?? "";
  const { collection, openAddRecipe, closeAddRecipe } = useRecipeCollectionState(collectionId);

  useEffect(() => {
    if (!collectionId) {
      return;
    }

    openAddRecipe();

    return () => {
      closeAddRecipe();
    };
  }, [closeAddRecipe, collectionId, openAddRecipe]);

  useEffect(() => {
    if (!collectionId || collection) {
      return;
    }

    router.back();
  }, [collection, collectionId, router]);

  if (!collectionId || !collection) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }} />;
}
