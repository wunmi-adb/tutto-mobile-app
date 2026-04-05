import { getSavedRecipeMealType, mapSavedRecipeToMealRecipe } from "@/components/dashboard/recipes/helpers";
import RecipeDetailScreen from "@/components/dashboard/plan/RecipeDetailScreen";
import { serializeMealRecipe } from "@/components/dashboard/plan/helpers";
import { getSingleParamValue } from "@/lib/utils/add-items";
import { useRecipeDetailState } from "@/stores/recipesStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { StyleSheet, Text, View } from "react-native";

export default function RecipeDetailRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ recipeId?: string | string[] }>();
  const recipeId = getSingleParamValue(params.recipeId) ?? "";
  const {
    recipe,
    getRecipeImage,
    updateRecipe,
  } = useRecipeDetailState(recipeId);

  if (!recipe) {
    return (
      <View style={styles.stateScreen}>
        <Text style={styles.stateText}>Recipe not found.</Text>
      </View>
    );
  }

  const mealType = getSavedRecipeMealType(recipe);
  const mealRecipe = mapSavedRecipeToMealRecipe(recipe);

  return (
    <RecipeDetailScreen
      heroImage={getRecipeImage(recipe)}
      mealType={mealType}
      onBack={() => router.back()}
      onSave={updateRecipe}
      onCookedThis={(nextRecipe) => {
        updateRecipe(nextRecipe);
        router.push({
          pathname: "/dashboard/plan/update-usage",
          params: {
            origin: "recipes",
            mealType,
            recipe: serializeMealRecipe(nextRecipe),
            recipeName: nextRecipe.kind === "custom" ? nextRecipe.name : undefined,
          },
        });
      }}
      onStartCooking={(nextRecipe) =>
        router.push({
          pathname: "/dashboard/plan/cook",
          params: {
            origin: "recipes",
            mealType,
            recipe: serializeMealRecipe(nextRecipe),
          },
        })
      }
      recipe={mealRecipe}
      source={recipe.source}
    />
  );
}

const styles = StyleSheet.create({
  stateScreen: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  stateText: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.muted,
  },
});
