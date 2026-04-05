import type { MealTypeId } from "@/components/dashboard/data";
import RecipeDetailScreen from "@/components/dashboard/plan/RecipeDetailScreen";
import { parseMealRecipe, serializeMealRecipe } from "@/components/dashboard/plan/helpers";
import type { MealRecipe } from "@/components/dashboard/plan/types";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import {
  isMealPlanEntryKey,
  mapMealPlanRecipeDetailToMealRecipe,
  useMealPlanRecipeDetail,
} from "@/lib/api/meal-plan";
import { usePlanState } from "@/stores/planStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PlanMealScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const { replaceMeal } = usePlanState();
  const params = useLocalSearchParams<{
    dayIdx?: string;
    mealId?: string;
    mealType?: MealTypeId;
    recipe?: string;
  }>();
  const fallbackRecipe = parseMealRecipe(params.recipe);
  const entryKey = isMealPlanEntryKey(params.mealId) ? params.mealId : undefined;
  const recipeDetailQuery = useMealPlanRecipeDetail(entryKey, Boolean(entryKey));
  const recipe = recipeDetailQuery.data
    ? mapMealPlanRecipeDetailToMealRecipe(recipeDetailQuery.data)
    : fallbackRecipe;

  useEffect(() => {
    if (!recipe || !params.mealType) {
      router.replace("/dashboard/plan");
    }
  }, [params.mealType, recipe, router]);

  if (!params.mealType) {
    return null;
  }

  if (entryKey && recipeDetailQuery.isLoading) {
    return (
      <SafeAreaView style={styles.stateScreen}>
        <View style={styles.stateCard}>
          <ActivityIndicator size="small" color={colors.text} />
          <Text style={styles.stateTitle}>{t("kitchen.plan.recipeLoading")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (entryKey && recipeDetailQuery.error && !recipe) {
    return (
      <SafeAreaView style={styles.stateScreen}>
        <View style={styles.stateCard}>
          <Text style={styles.stateTitle}>{t("kitchen.plan.recipeLoadError")}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            activeOpacity={0.8}
            onPress={() => void recipeDetailQuery.refetch()}
          >
            <Text style={styles.retryButtonText}>{t("storage.retry")}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!recipe) {
    return null;
  }

  const dayIdx = Number.parseInt(params.dayIdx ?? "", 10);
  const saveRecipe = (nextRecipe: MealRecipe) => {
    if (Number.isFinite(dayIdx) && params.mealId) {
      replaceMeal(dayIdx, params.mealId, { kind: "recipe", recipe: nextRecipe });
    }
  };

  return (
    <RecipeDetailScreen
      mealType={params.mealType}
      recipe={recipe}
      onBack={() => router.back()}
      onSave={saveRecipe}
      onCookedThis={(nextRecipe) => {
        saveRecipe(nextRecipe);
        router.push({
          pathname: "/dashboard/plan/update-usage",
          params: {
            origin: "plan",
            recipe: serializeMealRecipe(nextRecipe),
            mealType: params.mealType,
            recipeName: nextRecipe.kind === "preset" ? undefined : nextRecipe.name,
          },
        });
      }}
      onStartCooking={(nextRecipe) =>
        router.push({
          pathname: "/dashboard/plan/cook",
          params: {
            dayIdx: params.dayIdx,
            mealId: params.mealId,
            mealType: params.mealType,
            origin: "plan",
            recipe: serializeMealRecipe(nextRecipe),
          },
        })
      }
    />
  );
}

const styles = StyleSheet.create({
  stateScreen: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  stateCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: "center",
    gap: 12,
  },
  stateTitle: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.muted,
    textAlign: "center",
  },
  retryButton: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  retryButtonText: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.text,
  },
});
