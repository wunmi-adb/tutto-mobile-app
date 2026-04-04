import type { MealTypeId } from "@/components/dashboard/data";
import { generateWeek } from "@/components/dashboard/plan/helpers";
import type { CookedMealPlanEntry, DayPlan, MealSlot } from "@/components/dashboard/plan/types";
import type { PantryItem } from "@/components/dashboard/kitchen/types";
import { useI18n } from "@/i18n";
import { handleCaughtApiError } from "@/lib/api/handle-caught-api-error";
import type { MealPlanDayResponse, MealPlanEntryResponse } from "@/lib/api/meal-plan";
import {
  isMealPlanEntryKey,
  useDeleteMealPlanEntry,
  useUpcomingMealPlan,
} from "@/lib/api/meal-plan";
import { atom, computed } from "nanostores";
import { useStore } from "@nanostores/react";
import { useEffect } from "react";

function getTodayIndex() {
  const day = new Date().getDay();
  return (day + 6) % 7;
}

function mapPantryItemToCookedMealEntry(item: PantryItem): CookedMealPlanEntry {
  return {
    kind: "cooked_meal",
    itemKey: item.id,
    location: item.location,
    storageLocationKey: item.storageLocationKey,
    name: item.name,
    fillLevel: item.batches[0]?.fillLevel,
  };
}

function updateDayAtIndex(
  days: DayPlan[],
  dayIdx: number,
  updater: (day: DayPlan) => DayPlan,
) {
  return days.map((day, index) => {
    if (index !== dayIdx) {
      return day;
    }

    return updater(day);
  });
}

function createCustomRecipeMealSlot(
  dayIdx: number,
  name: string,
  type: MealTypeId,
  t: ReturnType<typeof useI18n>["t"],
): MealSlot {
  return {
    id: `${dayIdx}-custom-${Date.now()}`,
    type,
    meal: {
      kind: "recipe",
      recipe: {
        kind: "custom",
        name,
        timeMinutes: 30,
        servings: 2,
        calories: 400,
        protein: "20g",
        carbs: "45g",
        fat: "15g",
        ingredients: [t("kitchen.plan.generated.ingredientsPlaceholder")],
        steps: [t("kitchen.plan.generated.stepsPlaceholder")],
      },
    },
  };
}

function createCookedMealSlot(dayIdx: number, item: PantryItem, type: MealTypeId): MealSlot {
  return {
    id: `${dayIdx}-cooked-${item.id}-${Date.now()}`,
    type,
    meal: mapPantryItemToCookedMealEntry(item),
  };
}

function getTodayDateKey() {
  return new Date().toISOString().slice(0, 10);
}

function getDayIndexForToday(days: DayPlan[]) {
  const todayKey = getTodayDateKey();
  const index = days.findIndex((day) => day.date.slice(0, 10) === todayKey);

  return index >= 0 ? index : 0;
}

function isCookedMealPlanEntry(entry: MealPlanEntryResponse) {
  return entry.source_item_type === "cooked_meal";
}

function createApiRecipeMealSlot(entry: MealPlanEntryResponse, t: ReturnType<typeof useI18n>["t"]): MealSlot {
  return {
    id: entry.key,
    type: entry.meal_type,
    meal: {
      kind: "recipe",
      recipe: {
        kind: "custom",
        name: entry.title,
        timeMinutes:
          typeof entry.total_minutes === "number" && Number.isFinite(entry.total_minutes)
            ? entry.total_minutes
            : 30,
        servings: 2,
        calories:
          typeof entry.calories_kcal === "number" && Number.isFinite(entry.calories_kcal)
            ? entry.calories_kcal
            : 0,
        protein: "0g",
        carbs: "0g",
        fat: "0g",
        ingredients: [t("kitchen.plan.generated.ingredientsPlaceholder")],
        steps: [t("kitchen.plan.generated.stepsPlaceholder")],
      },
    },
  };
}

function createApiCookedMealSlot(entry: MealPlanEntryResponse): MealSlot {
  return {
    id: entry.key,
    type: entry.meal_type,
    meal: {
      kind: "cooked_meal",
      itemKey: entry.linked_item_key ?? entry.key,
      location: "",
      name: entry.title,
    },
  };
}

function compareMealTypeOrder(left: MealSlot, right: MealSlot) {
  const order: Record<MealTypeId, number> = {
    breakfast: 0,
    brunch: 1,
    lunch: 2,
    snack: 3,
    dinner: 4,
    supper: 5,
  };

  return order[left.type] - order[right.type];
}

function mapMealPlanEntryToSlot(
  entry: MealPlanEntryResponse,
  t: ReturnType<typeof useI18n>["t"],
): MealSlot {
  if (isCookedMealPlanEntry(entry)) {
    return createApiCookedMealSlot(entry);
  }

  return createApiRecipeMealSlot(entry, t);
}

function mapMealPlanDayToDayPlan(
  day: MealPlanDayResponse,
  t: ReturnType<typeof useI18n>["t"],
): DayPlan {
  return {
    date: day.date,
    meals: day.meals.map((meal) => mapMealPlanEntryToSlot(meal, t)).sort(compareMealTypeOrder),
  };
}

function hydratePlanWeek(days: MealPlanDayResponse[], t: ReturnType<typeof useI18n>["t"]) {
  const nextWeek = days.map((day) => mapMealPlanDayToDayPlan(day, t));

  $planWeek.set(nextWeek);
  const currentSelectedDay = $selectedPlanDay.get();
  const safeSelectedDay =
    currentSelectedDay >= 0 && currentSelectedDay < nextWeek.length
      ? currentSelectedDay
      : getDayIndexForToday(nextWeek);

  $selectedPlanDay.set(safeSelectedDay);
  $planHydratedFromApi.set(true);
}

export const $planWeek = atom<DayPlan[]>(generateWeek());
export const $selectedPlanDay = atom(getTodayIndex());
export const $planHydratedFromApi = atom(false);
export const $todayPlanDay = computed([$planWeek], (week) => getDayIndexForToday(week));
export const $currentPlanDay = computed([$planWeek, $selectedPlanDay], (week, selectedDay) => {
  return week[selectedDay] ?? week[0];
});

export function setSelectedPlanDay(dayIdx: number) {
  $selectedPlanDay.set(dayIdx);
}

export function removePlanMeal(dayIdx: number, mealId: string) {
  $planWeek.set(
    updateDayAtIndex($planWeek.get(), dayIdx, (day) => ({
      ...day,
      meals: day.meals.filter((meal) => meal.id !== mealId),
    })),
  );
}

export function addPlanRecipeMeal(
  dayIdx: number,
  name: string,
  type: MealTypeId,
  t: ReturnType<typeof useI18n>["t"],
) {
  const newMeal = createCustomRecipeMealSlot(dayIdx, name, type, t);

  $planWeek.set(
    updateDayAtIndex($planWeek.get(), dayIdx, (day) => ({
      ...day,
      meals: [...day.meals, newMeal],
    })),
  );
}

export function addPlanCookedMeal(dayIdx: number, item: PantryItem, type: MealTypeId) {
  const newMeal = createCookedMealSlot(dayIdx, item, type);

  $planWeek.set(
    updateDayAtIndex($planWeek.get(), dayIdx, (day) => ({
      ...day,
      meals: [...day.meals, newMeal],
    })),
  );
}

export function replacePlanMeal(dayIdx: number, mealId: string, nextMeal: MealSlot["meal"]) {
  $planWeek.set(
    updateDayAtIndex($planWeek.get(), dayIdx, (day) => ({
      ...day,
      meals: day.meals.map((meal) => {
        if (meal.id !== mealId) {
          return meal;
        }

        return { ...meal, meal: nextMeal };
      }),
    })),
  );
}

export function usePlanState() {
  const { t } = useI18n();
  const mealPlanQuery = useUpcomingMealPlan();
  const deleteMealPlanEntryMutation = useDeleteMealPlanEntry();
  const week = useStore($planWeek);
  const selectedDay = useStore($selectedPlanDay);
  const todayIdx = useStore($todayPlanDay);
  const currentDay = useStore($currentPlanDay);
  const hasRemotePlanData = useStore($planHydratedFromApi);

  useEffect(() => {
    if (!mealPlanQuery.data?.days?.length) {
      return;
    }

    hydratePlanWeek(mealPlanQuery.data.days, t);
  }, [mealPlanQuery.data?.days, t]);

  const removeMeal = async (dayIdx: number, mealId: string) => {
    if (isMealPlanEntryKey(mealId)) {
      try {
        await deleteMealPlanEntryMutation.mutateAsync(mealId);
      } catch (error) {
        handleCaughtApiError(error);
        return;
      }
    }

    removePlanMeal(dayIdx, mealId);
  };

  return {
    currentDay,
    hasRemotePlanData,
    isLoading: mealPlanQuery.isLoading && !hasRemotePlanData,
    loadError: mealPlanQuery.error,
    selectedDay,
    todayIdx,
    week,
    refetch: mealPlanQuery.refetch,
    setSelectedDay: setSelectedPlanDay,
    removeMeal,
    replaceMeal: replacePlanMeal,
    addCookedMeal: addPlanCookedMeal,
    addRecipeMeal: (dayIdx: number, name: string, type: MealTypeId) =>
      addPlanRecipeMeal(dayIdx, name, type, t),
  };
}
