import ProcessingOverlay, { ProcessingWordStage } from "@/components/items/ProcessingOverlay";
import Button from "@/components/ui/Button";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import type { TranslationKey } from "@/i18n/messages";
import { useNextMealSuggestion } from "@/lib/api/meal-plan";
import { prefetchStorageLocations } from "@/lib/api/storage-locations";
import { Feather } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COMPLETE_LOADING_WORD_STAGES: readonly ProcessingWordStage[] = [
  {
    maxElapsedMs: 4500,
    keys: [
      "complete.loading.words.peekingInside",
      "complete.loading.words.checkingWhatYouveGot",
      "complete.loading.words.riceTomatoesCheck",
      "complete.loading.words.scanningShelves",
    ] satisfies readonly TranslationKey[],
  },
  {
    maxElapsedMs: 10500,
    keys: [
      "complete.loading.words.matchingIngredients",
      "complete.loading.words.findingDelicious",
      "complete.loading.words.kitchenPotential",
      "complete.loading.words.goingToBeGood",
      "complete.loading.words.calculatingFlavours",
      "complete.loading.words.fridgeIdeas",
      "complete.loading.words.puttingItTogether",
    ] satisfies readonly TranslationKey[],
  },
  {
    maxElapsedMs: Number.POSITIVE_INFINITY,
    keys: [
      "complete.loading.words.almostReadyToCook",
      "complete.loading.words.perfectMealComing",
      "complete.loading.words.justMomentMore",
      "complete.loading.words.puttingItTogether",
    ] satisfies readonly TranslationKey[],
  },
] as const;

const SUCCESS_PHASE_MS = 5000;

type CompletionPhase = "loading" | "success" | "content";

function getMealTypeKey(mealType: "breakfast" | "lunch" | "dinner") {
  switch (mealType) {
    case "breakfast":
      return "complete.mealType.breakfast" as const;
    case "lunch":
      return "complete.mealType.lunch" as const;
    case "dinner":
    default:
      return "complete.mealType.dinner" as const;
  }
}

export default function OnboardingComplete() {
  const router = useRouter();
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const { location, source } = useLocalSearchParams<{ location: string; source?: string }>();
  const storageName = location ?? t("addItems.defaultStorage");
  const [phase, setPhase] = useState<CompletionPhase>("loading");
  const mealSuggestionQuery = useNextMealSuggestion();

  useEffect(() => {
    if (mealSuggestionQuery.isError) {
      router.replace("/dashboard");
    }
  }, [mealSuggestionQuery.isError, router]);

  useEffect(() => {
    if (phase === "loading" && mealSuggestionQuery.data) {
      setPhase("success");
    }
  }, [mealSuggestionQuery.data, phase]);

  useEffect(() => {
    if (phase !== "success") {
      return;
    }

    const timer = setTimeout(() => {
      setPhase("content");
    }, SUCCESS_PHASE_MS);

    return () => clearTimeout(timer);
  }, [phase]);

  const mealTypeLabel = useMemo(() => {
    if (!mealSuggestionQuery.data?.meal_type) {
      return null;
    }

    return t(getMealTypeKey(mealSuggestionQuery.data.meal_type));
  }, [mealSuggestionQuery.data?.meal_type, t]);

  if (phase === "loading") {
    return (
      <ProcessingOverlay
        subtitle={null}
        wordStages={COMPLETE_LOADING_WORD_STAGES}
      />
    );
  }

  if (phase === "success") {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centeredContent}>
          <View style={styles.checkCircle}>
            <Feather name="check" size={40} color={colors.success} />
          </View>
          <Text style={styles.readyTitle}>{t("complete.ready")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {mealSuggestionQuery.data && mealTypeLabel ? (
          <>
            <View style={styles.headingBlock}>
              <Text style={styles.title}>{t("complete.suggestionTitle", { mealType: mealTypeLabel })}</Text>
              <Text style={styles.subtitle}>{t("complete.suggestionSubtitle", { storageName })}</Text>
            </View>

            <View style={styles.recipeCard}>
              <Text style={styles.recipeName}>{mealSuggestionQuery.data.name}</Text>
              <View style={styles.recipeMetaRow}>
                <View style={styles.recipeMetaItem}>
                  <Feather name="clock" size={13} color={colors.muted} />
                  <Text style={styles.recipeMetaText}>
                    {t("kitchen.common.minutes", { count: mealSuggestionQuery.data.cooking_time })}
                  </Text>
                </View>
                <View style={styles.recipeMetaItem}>
                  <Feather name="users" size={13} color={colors.muted} />
                  <Text style={styles.recipeMetaText}>
                    {t("kitchen.common.servings", { count: mealSuggestionQuery.data.servings })}
                  </Text>
                </View>
              </View>

              <View style={styles.matchRow}>
                <Feather name="check-circle" size={14} color={colors.brand} />
                <Text style={styles.matchText}>
                  {t("complete.ingredientsMatched", {
                    matched: mealSuggestionQuery.data.number_of_ingredients_available,
                    total: mealSuggestionQuery.data.number_of_ingredients,
                  })}
                </Text>
              </View>
            </View>

            <Text style={styles.hint}>{t("complete.moreSuggestions")}</Text>
          </>
        ) : (
          <View style={styles.fallbackBlock}>
            <Text style={styles.title}>{t("complete.ready")}</Text>
            <Text style={styles.subtitle}>{t("complete.suggestionUnavailable")}</Text>
          </View>
        )}

        <View style={styles.actions}>
          <Button
            title={t("complete.goToKitchen")}
            rightIcon={<Feather name="arrow-right" size={16} color={colors.background} />}
            style={styles.primaryButton}
            onPress={() => router.replace("/dashboard")}
          />
          <Button
            variant="secondary"
            title={t("complete.addLocation")}
            leftIcon={<Feather name="plus" size={16} color={colors.text} />}
            style={styles.secondaryButton}
            onPress={async () => {
              await prefetchStorageLocations(queryClient);
              router.replace({
                pathname: "/onboarding/storage",
                params: source ? { source } : undefined,
              });
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centeredContent: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
  },
  checkCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.success + "1a",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  readyTitle: {
    fontFamily: fonts.sansMedium,
    fontSize: 16,
    color: colors.text,
    textAlign: "center",
  },
  headingBlock: {
    marginBottom: 28,
  },
  fallbackBlock: {
    marginTop: 120,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 32,
    lineHeight: 35,
    color: colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 21,
    color: colors.muted,
    maxWidth: 300,
  },
  recipeCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    backgroundColor: colors.background,
  },
  recipeName: {
    fontFamily: fonts.sansMedium,
    fontSize: 20,
    lineHeight: 26,
    color: colors.text,
    marginBottom: 10,
  },
  recipeMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 18,
  },
  recipeMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  recipeMetaText: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
  },
  matchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  matchText: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.text,
  },
  hint: {
    marginTop: 16,
    fontFamily: fonts.sans,
    fontSize: 13,
    lineHeight: 19,
    color: colors.muted,
    textAlign: "center",
    paddingHorizontal: 12,
  },
  actions: {
    marginTop: "auto",
  },
  primaryButton: {
    marginTop: 0,
  },
  secondaryButton: {
    marginTop: 12,
  },
});
