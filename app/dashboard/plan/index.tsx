import { formatDayLabel } from "@/components/dashboard/data";
import AddMealSheet from "@/components/dashboard/plan/AddMealSheet";
import { generateWeek, pickRandomRecipe, serializeMealRecipe } from "@/components/dashboard/plan/helpers";
import MealCard from "@/components/dashboard/plan/MealCard";
import type { DayPlan, MealSlot } from "@/components/dashboard/plan/types";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PlanTab() {
  const router = useRouter();
  const { language, t } = useI18n();
  const [week, setWeek] = useState<DayPlan[]>(() => generateWeek());
  const todayIdx = (() => {
    const day = new Date().getDay();
    return (day + 6) % 7;
  })();
  const [selectedDay, setSelectedDay] = useState(todayIdx);
  const [addingMealForDay, setAddingMealForDay] = useState<number | null>(null);

  const currentDay = week[selectedDay];

  const updateMeal = (dayIdx: number, mealId: string, updates: Partial<MealSlot>) => {
    setWeek((prev) =>
      prev.map((day, index) =>
        index === dayIdx
          ? { ...day, meals: day.meals.map((meal) => (meal.id === mealId ? { ...meal, ...updates } : meal)) }
          : day,
      ),
    );
  };

  const removeMeal = (dayIdx: number, mealId: string) => {
    setWeek((prev) =>
      prev.map((day, index) =>
        index === dayIdx ? { ...day, meals: day.meals.filter((meal) => meal.id !== mealId) } : day,
      ),
    );
  };

  const addMeal = (dayIdx: number, name: string, type: MealSlot["type"]) => {
    const newMeal: MealSlot = {
      id: `${dayIdx}-custom-${Date.now()}`,
      type,
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
    };

    setWeek((prev) =>
      prev.map((day, index) => (index === dayIdx ? { ...day, meals: [...day.meals, newMeal] } : day)),
    );
    setAddingMealForDay(null);
  };

  const randomiseMeal = (dayIdx: number, mealId: string, type: MealSlot["type"]) => {
    const nextRecipe = pickRandomRecipe(type);

    if (!nextRecipe) {
      return;
    }

    updateMeal(dayIdx, mealId, { recipe: nextRecipe });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>{t("kitchen.plan.title")}</Text>
          <Text style={styles.pageSubtitle}>{t("kitchen.plan.subtitle")}</Text>
        </View>

        <View style={styles.dayStripWrap}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dayStrip}>
            {week.map((day, index) => {
              const currentDate = new Date(day.date);
              const isToday = index === todayIdx;
              const isSelected = index === selectedDay;

              return (
                <TouchableOpacity
                  key={day.date}
                  style={[styles.dayChip, isSelected ? styles.dayChipActive : styles.dayChipInactive]}
                  activeOpacity={0.8}
                  onPress={() => setSelectedDay(index)}
                >
                  <Text style={[styles.dayChipLabel, isSelected && styles.dayChipLabelActive]}>
                    {formatDayLabel(language, currentDate)}
                  </Text>
                  <Text style={[styles.dayChipDate, isSelected && styles.dayChipDateActive]}>
                    {currentDate.getDate()}
                  </Text>
                  {isToday ? <View style={[styles.todayDot, isSelected && styles.todayDotActive]} /> : null}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.mealsList}>
          {currentDay.meals.map((slot) => (
            <MealCard
              key={slot.id}
              slot={slot}
              onView={() => {
                if (!slot.recipe) {
                  return;
                }

                router.push({
                  pathname: "/dashboard/plan/meal",
                  params: {
                    recipe: serializeMealRecipe(slot.recipe),
                    mealType: slot.type,
                    dayIdx: String(selectedDay),
                    mealId: slot.id,
                  },
                });
              }}
              onRandomise={() => randomiseMeal(selectedDay, slot.id, slot.type)}
              onRemove={() => removeMeal(selectedDay, slot.id)}
            />
          ))}

          <TouchableOpacity
            style={styles.addMealGhost}
            activeOpacity={0.82}
            onPress={() => setAddingMealForDay(selectedDay)}
          >
            <Feather name="plus" size={14} color={colors.muted} />
            <Text style={styles.addMealGhostText}>{t("kitchen.plan.addMeal")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {addingMealForDay !== null ? (
        <AddMealSheet
          onAdd={(name, type) => addMeal(addingMealForDay, name, type)}
          onClose={() => setAddingMealForDay(null)}
        />
      ) : null}
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
