import type { MealTypeId } from "@/components/dashboard/data";
import AddMealScreen from "@/components/dashboard/plan/AddMealScreen";
import type { PantryItem } from "@/components/dashboard/kitchen/types";
import { handleCaughtApiError } from "@/lib/api/handle-caught-api-error";
import { toMealPlanMealType, useCreateMealPlanEntry } from "@/lib/api/meal-plan";
import { usePlanState } from "@/stores/planStore";
import { useLocalSearchParams, useRouter } from "expo-router";

function parseDayIndex(value: string | undefined, fallback: number) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export default function PlanAddMealRoute() {
  const router = useRouter();
  const { selectedDay, week } = usePlanState();
  const createMealPlanEntryMutation = useCreateMealPlanEntry();
  const { dayIdx } = useLocalSearchParams<{ dayIdx?: string }>();
  const targetDayIndex = parseDayIndex(dayIdx, selectedDay);
  const targetDate = week[targetDayIndex]?.date;

  const handleAddRecipeMeal = async (name: string, type: MealTypeId) => {
    if (!targetDate) {
      return;
    }

    try {
      await createMealPlanEntryMutation.mutateAsync({
        date: targetDate,
        meal_type: toMealPlanMealType(type),
        name,
        type: "recipe",
      });
      router.back();
    } catch (error) {
      handleCaughtApiError(error);
    }
  };

  const handleAddCookedMeal = async (item: PantryItem, type: MealTypeId) => {
    if (!targetDate) {
      return;
    }

    try {
      await createMealPlanEntryMutation.mutateAsync({
        date: targetDate,
        item_key: item.id,
        meal_type: toMealPlanMealType(type),
        name: item.name,
        type: "cooked_meal",
      });
      router.back();
    } catch (error) {
      handleCaughtApiError(error);
    }
  };

  return (
    <AddMealScreen
      onAddCookedMeal={handleAddCookedMeal}
      onAddRecipeMeal={handleAddRecipeMeal}
      onBack={() => router.back()}
      submitting={createMealPlanEntryMutation.isPending}
    />
  );
}
