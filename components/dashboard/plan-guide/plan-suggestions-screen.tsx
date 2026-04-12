import { serializeMealRecipe } from "@/components/dashboard/plan/helpers";
import type { MealRecipe } from "@/components/dashboard/plan/types";
import HapticPressable from "@/components/ui/HapticPressable";
import { fonts } from "@/constants/fonts";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  getFilteredSuggestions,
  getSuggestionPool,
  pickSuggestions,
  RESULT_COUNT,
  SUGGESTION_POOL,
} from "./plan-data";
import PlanFilterControls from "./plan-filter-controls";
import PlanSuggestionCard from "./plan-suggestion-card";
import { planTheme } from "./plan-theme";
import type { MealTime, Suggestion, SuggestionType } from "./types";

function mapSuggestionToRecipe(suggestion: Suggestion): MealRecipe {
  return {
    kind: "custom",
    name: suggestion.name,
    timeMinutes: Number.parseInt(suggestion.time, 10) || 0,
    servings: suggestion.servings,
    calories: suggestion.calories,
    protein: suggestion.protein,
    carbs: suggestion.carbs,
    fat: suggestion.fat,
    ingredients: suggestion.ingredients,
    steps: suggestion.steps,
  };
}

export default function PlanSuggestionsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [typeFilter, setTypeFilter] = useState<SuggestionType | null>(null);
  const [mealTimeFilter, setMealTimeFilter] = useState<MealTime | null>(null);
  const [suggestions, setSuggestions] = useState(() => pickSuggestions(SUGGESTION_POOL, RESULT_COUNT));

  const filteredSuggestions = useMemo(
    () => getFilteredSuggestions(suggestions, typeFilter, mealTimeFilter),
    [mealTimeFilter, suggestions, typeFilter],
  );

  const handleShuffle = useCallback(() => {
    const nextPool = getSuggestionPool(typeFilter, mealTimeFilter);
    setSuggestions(pickSuggestions(nextPool.length ? nextPool : SUGGESTION_POOL, RESULT_COUNT));
  }, [mealTimeFilter, typeFilter]);

  return (
    <View style={styles.screen}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: Math.max(insets.bottom, 20) + 44,
          },
        ]}
      >
        <View style={styles.content}>
          <>
            <View style={styles.headerRow}>
              <View style={styles.headerCopy}>
                <Text style={styles.title}>Suggestions</Text>
                <Text style={styles.subtitle}>Based on what&apos;s in your kitchen</Text>
              </View>
              <HapticPressable
                style={styles.refreshButton}
                pressedOpacity={0.82}
                onPress={handleShuffle}
              >
                <Feather name="shuffle" size={14} color={planTheme.foreground} />
                <Text style={styles.refreshText}>Refresh</Text>
              </HapticPressable>
            </View>

            <PlanFilterControls
              mealTimeFilter={mealTimeFilter}
              typeFilter={typeFilter}
              onMealTimeChange={setMealTimeFilter}
              onTypeChange={(value) => {
                setTypeFilter(value);
                setMealTimeFilter(null);
              }}
            />

            <View style={styles.results}>
              {filteredSuggestions.length > 0 ? (
                filteredSuggestions.map((suggestion) => (
                  <PlanSuggestionCard
                    key={suggestion.id}
                    suggestion={suggestion}
                    onPress={() =>
                      router.push({
                        pathname: "/dashboard/plan/meal",
                        params: {
                          mealType:
                            suggestion.mealTime === "breakfast" ||
                            suggestion.mealTime === "lunch" ||
                            suggestion.mealTime === "dinner"
                              ? suggestion.mealTime
                              : "dinner",
                          recipe: serializeMealRecipe(mapSuggestionToRecipe(suggestion)),
                        },
                      })
                    }
                  />
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyTitle}>No suggestions match this filter. Try refreshing!</Text>
                </View>
              )}
            </View>
          </>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: planTheme.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  content: {
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
    gap: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  headerCopy: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 32,
    lineHeight: 36,
    color: planTheme.foreground,
  },
  subtitle: {
    marginTop: 4,
    fontFamily: fonts.sans,
    fontSize: 13,
    lineHeight: 18,
    color: planTheme.mutedForeground,
  },
  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  refreshText: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: planTheme.foreground,
  },
  results: {
    gap: 12,
  },
  emptyState: {
    paddingVertical: 32,
  },
  emptyTitle: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    color: planTheme.mutedForeground,
    textAlign: "center",
  },
});
