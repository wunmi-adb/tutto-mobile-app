import { formatDayLabel } from "@/components/dashboard/data";
import {
  isCookedMealEntry,
  pickRandomRecipe,
  serializeMealRecipe,
} from "@/components/dashboard/plan/helpers";
import MealCard from "@/components/dashboard/plan/MealCard";
import HapticPressable from "@/components/ui/HapticPressable";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import { handleCaughtApiError } from "@/lib/api/handle-caught-api-error";
import { useInfiniteInventoryItems } from "@/lib/api/inventory";
import {
  isMealPlanEntryKey,
  mapMealPlanRecipeDetailToMealRecipe,
  useShuffleMealPlanEntry,
} from "@/lib/api/meal-plan";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePlanState } from "@/stores/planStore";

export default function PlanTab() {
  const router = useRouter();
  const { language, t } = useI18n();
  const {
    currentDay,
    loadError,
    removeMeal,
    replaceMeal,
    refetch,
    isLoading,
    selectedDay,
    setSelectedDay,
    todayIdx,
    week,
  } = usePlanState();
  const [isPullRefreshing, setIsPullRefreshing] = useState(false);
  const [pendingShuffleMealId, setPendingShuffleMealId] = useState<string | null>(null);
  const [pendingRemoveMealId, setPendingRemoveMealId] = useState<string | null>(null);
  const inventoryQuery = useInfiniteInventoryItems();
  const shuffleMealPlanEntryMutation = useShuffleMealPlanEntry();

  const cookedMealCandidates = useMemo(
    () =>
      (inventoryQuery.data?.pages ?? [])
        .flatMap((page) => page.items)
        .filter((item) => item.type === "cooked_meal"),
    [inventoryQuery.data?.pages],
  );

  const getMealSlot = (dayIdx: number, mealId: string) => {
    return week[dayIdx]?.meals.find((meal) => meal.id === mealId);
  };

  const randomiseMeal = async (dayIdx: number, mealId: string) => {
    const mealSlot = getMealSlot(dayIdx, mealId);
    const currentMeal = mealSlot?.meal;

    if (!currentMeal) {
      return;
    }

    if (!isCookedMealEntry(currentMeal) && isMealPlanEntryKey(mealId)) {
      const detail = await shuffleMealPlanEntryMutation.mutateAsync(mealId);

      replaceMeal(dayIdx, mealId, {
        kind: "recipe",
        recipe: mapMealPlanRecipeDetailToMealRecipe(detail),
      });
      return;
    }

    if (!isCookedMealEntry(currentMeal)) {
      const nextRecipe = pickRandomRecipe(mealSlot?.type ?? "dinner");

      if (!nextRecipe) {
        return;
      }

      replaceMeal(dayIdx, mealId, {
        kind: "recipe",
        recipe: nextRecipe,
      });
      return;
    }

    let candidates = cookedMealCandidates.filter((item) => item.id !== currentMeal.itemKey);

    while (!candidates.length && inventoryQuery.hasNextPage && !inventoryQuery.isFetchingNextPage) {
      const nextPage = await inventoryQuery.fetchNextPage();
      const nextCandidates =
        nextPage.data?.pages.flatMap((page) => page.items).filter((item) => item.type === "cooked_meal") ?? [];
      candidates = nextCandidates.filter((item) => item.id !== currentMeal.itemKey);
    }

    const nextCookedMeal = candidates[Math.floor(Math.random() * candidates.length)];

    if (!nextCookedMeal) {
      return;
    }

    replaceMeal(dayIdx, mealId, {
      kind: "cooked_meal",
      itemKey: nextCookedMeal.id,
      location: nextCookedMeal.location,
      storageLocationKey: nextCookedMeal.storageLocationKey,
      name: nextCookedMeal.name,
      fillLevel: nextCookedMeal.batches[0]?.fillLevel,
    });
  };

  const handleSelectDay = (index: number) => {
    setSelectedDay(index);
  };

  const handleOpenAddMeal = () => {
    router.push({
      pathname: "/dashboard/plan/add-meal",
      params: { dayIdx: String(selectedDay) },
    });
  };

  const handleOpenMeal = (slot: (typeof currentDay.meals)[number]) => {
    if (isCookedMealEntry(slot.meal)) {
      router.push({
        pathname: "/dashboard/plan/cooked-meal",
        params: {
          dayIdx: String(selectedDay),
          fillLevel: slot.meal.fillLevel,
          itemKey: slot.meal.itemKey,
          mealId: slot.id,
          mealName: slot.meal.name,
          mealType: slot.type,
          location: slot.meal.location,
          storageLocationKey: slot.meal.storageLocationKey,
        },
      });
      return;
    }

    router.push({
      pathname: "/dashboard/plan/meal",
      params: {
        recipe: serializeMealRecipe(slot.meal.recipe),
        mealType: slot.type,
        dayIdx: String(selectedDay),
        mealId: slot.id,
      },
    });
  };

  const handleRandomiseMeal = async (mealId: string) => {
    if (pendingShuffleMealId === mealId) {
      return;
    }

    setPendingShuffleMealId(mealId);

    try {
      await randomiseMeal(selectedDay, mealId);
    } catch (error) {
      handleCaughtApiError(error);
    } finally {
      setPendingShuffleMealId((currentMealId) => (currentMealId === mealId ? null : currentMealId));
    }
  };

  const handleRemoveMeal = async (mealId: string) => {
    if (pendingRemoveMealId === mealId) {
      return;
    }

    setPendingRemoveMealId(mealId);

    try {
      await removeMeal(selectedDay, mealId);
    } catch (error) {
      handleCaughtApiError(error);
    } finally {
      setPendingRemoveMealId((currentMealId) => (currentMealId === mealId ? null : currentMealId));
    }
  };

  const handleRefresh = async () => {
    setIsPullRefreshing(true);

    try {
      await refetch();
    } catch (error) {
      handleCaughtApiError(error);
    } finally {
      setIsPullRefreshing(false);
    }
  };

  const renderPlanBody = () => {
    if (isLoading) {
      return (
        <View style={styles.stateCard}>
          <ActivityIndicator size="small" color={colors.text} />
          <Text style={styles.stateTitle}>{t("kitchen.plan.loading")}</Text>
        </View>
      );
    }

    if (loadError) {
      return (
        <View style={styles.stateCard}>
          <Text style={styles.stateTitle}>{t("kitchen.plan.loadError")}</Text>
          <HapticPressable style={styles.retryButton} pressedOpacity={0.8} onPress={() => void refetch()}>
            <Text style={styles.retryButtonText}>{t("storage.retry")}</Text>
          </HapticPressable>
        </View>
      );
    }

    return (
      <>
        <View style={styles.dayStripWrap}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dayStrip}>
            {week.map((day, index) => {
              const currentDate = new Date(day.date);
              const isToday = index === todayIdx;
              const isSelected = index === selectedDay;

              return (
                <HapticPressable
                  key={day.date}
                  style={[styles.dayChip, isSelected ? styles.dayChipActive : styles.dayChipInactive]}
                  pressedOpacity={0.8}
                  onPress={() => handleSelectDay(index)}
                >
                  <Text style={[styles.dayChipLabel, isSelected && styles.dayChipLabelActive]}>
                    {formatDayLabel(language, currentDate)}
                  </Text>
                  <Text style={[styles.dayChipDate, isSelected && styles.dayChipDateActive]}>
                    {currentDate.getDate()}
                  </Text>
                  {isToday ? <View style={[styles.todayDot, isSelected && styles.todayDotActive]} /> : null}
                </HapticPressable>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.mealsList}>
          {currentDay.meals.map((slot) => (
            <MealCard
              key={slot.id}
              slot={slot}
              onView={() => handleOpenMeal(slot)}
              onRandomise={() => {
                void handleRandomiseMeal(slot.id);
              }}
              onRemove={() => {
                void handleRemoveMeal(slot.id);
              }}
              randomiseDisabled={pendingShuffleMealId === slot.id}
              removeDisabled={pendingRemoveMealId === slot.id}
              randomiseLabel={
                pendingShuffleMealId === slot.id ? t("kitchen.plan.shuffling") : undefined
              }
              removeLabel={pendingRemoveMealId === slot.id ? t("kitchen.plan.removing") : undefined}
            />
          ))}

          <HapticPressable
            style={styles.addMealGhost}
            pressedOpacity={0.82}
            onPress={handleOpenAddMeal}
          >
            <Feather name="plus" size={14} color={colors.muted} />
            <Text style={styles.addMealGhostText}>{t("kitchen.plan.addMeal")}</Text>
          </HapticPressable>
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isPullRefreshing}
            onRefresh={() => {
              void handleRefresh();
            }}
            tintColor={colors.text}
          />
        }
      >
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>{t("kitchen.plan.title")}</Text>
          <Text style={styles.pageSubtitle}>{t("kitchen.plan.subtitle")}</Text>
        </View>
        {renderPlanBody()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: 16, paddingBottom: 32 },
  pageHeader: { paddingHorizontal: 24, marginBottom: 20 },
  pageTitle: { fontFamily: fonts.serif, fontSize: 32, lineHeight: 36, color: colors.text },
  pageSubtitle: { marginTop: 4, fontFamily: fonts.sans, fontSize: 14, color: colors.muted },
  dayStripWrap: { marginBottom: 18 },
  dayStrip: { paddingHorizontal: 24, gap: 8, paddingBottom: 2 },
  dayChip: {
    width: 52,
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  dayChipActive: { backgroundColor: colors.text },
  dayChipInactive: { backgroundColor: colors.secondary },
  dayChipLabel: { fontFamily: fonts.sansMedium, fontSize: 11, color: colors.muted },
  dayChipLabelActive: { color: colors.background },
  dayChipDate: { fontFamily: fonts.sansMedium, fontSize: 17, color: colors.text, marginTop: 2 },
  dayChipDateActive: { color: colors.background },
  todayDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.brand, marginTop: 4 },
  todayDotActive: { backgroundColor: colors.background },
  mealsList: { paddingHorizontal: 24, gap: 12 },
  stateCard: {
    marginHorizontal: 24,
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
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
  addMealGhost: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.border,
    paddingVertical: 14,
    marginTop: 2,
  },
  addMealGhostText: { fontFamily: fonts.sans, fontSize: 14, color: colors.muted },
});
