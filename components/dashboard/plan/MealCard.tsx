import {
  RECIPE_DEFINITIONS,
  getMealTypeLabel,
  getRecipeName,
} from "@/components/dashboard/data";
import { isCookedMealEntry } from "@/components/dashboard/plan/helpers";
import HapticPressable from "@/components/ui/HapticPressable";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import type { MealSlot } from "./types";

type Props = {
  slot: MealSlot;
  onView: () => void;
  onRandomise: () => void;
  onRemove: () => void;
  randomiseDisabled?: boolean;
  removeDisabled?: boolean;
  randomiseLabel?: string;
  removeLabel?: string;
};

type MealCardContent = {
  calories: number | null;
  isCookedMeal: boolean;
  recipeName: string;
  timeMinutes: number | null;
};

function getMealCardContent(
  slot: MealSlot,
  t: ReturnType<typeof useI18n>["t"],
): MealCardContent {
  if (isCookedMealEntry(slot.meal)) {
    return {
      calories: null,
      isCookedMeal: true,
      recipeName: slot.meal.name,
      timeMinutes: null,
    };
  }

  if (slot.meal.recipe.kind === "preset") {
    const definition = RECIPE_DEFINITIONS[slot.meal.recipe.recipeId];

    return {
      calories: definition.calories,
      isCookedMeal: false,
      recipeName: getRecipeName(t, slot.meal.recipe.recipeId),
      timeMinutes: definition.timeMinutes,
    };
  }

  return {
    calories: slot.meal.recipe.calories,
    isCookedMeal: false,
    recipeName: slot.meal.recipe.name,
    timeMinutes: slot.meal.recipe.timeMinutes,
  };
}

export default function MealCard({
  slot,
  onView,
  onRandomise,
  onRemove,
  randomiseDisabled = false,
  removeDisabled = false,
  randomiseLabel,
  removeLabel,
}: Props) {
  const { t } = useI18n();
  const { calories, isCookedMeal, recipeName, timeMinutes } = getMealCardContent(slot, t);

  return (
    <View style={styles.mealCard}>
      <HapticPressable style={styles.mealMain} pressedOpacity={0.75} hapticType="medium" onPress={onView}>
        {isCookedMeal ? (
          <View style={styles.cookedBadge}>
            <MaterialCommunityIcons name="fridge-outline" size={16} color={colors.muted} />
          </View>
        ) : null}
        <View style={styles.mealCopy}>
          <Text style={styles.mealType}>{getMealTypeLabel(t, slot.type)}</Text>
          <Text style={styles.mealName}>{recipeName}</Text>
          <View style={styles.mealMetaRow}>
            {isCookedMeal ? (
              <Text style={styles.mealMeta}>{t("kitchen.plan.cookedMeal")}</Text>
            ) : (
              <>
                <Text style={styles.mealMeta}>{t("kitchen.common.minutes", { count: timeMinutes ?? 0 })}</Text>
                <Text style={styles.mealMeta}>{t("kitchen.common.calories", { count: calories ?? 0 })}</Text>
              </>
            )}
          </View>
        </View>
        <Feather name="chevron-right" size={14} color={colors.muted + "66"} />
      </HapticPressable>

      <View style={styles.mealActions}>
        <HapticPressable
          style={[
            styles.mealAction,
            styles.mealActionDivider,
            randomiseDisabled && styles.mealActionDisabled,
          ]}
          pressedOpacity={0.75}
          hapticType="selection"
          disabled={randomiseDisabled}
          onPress={onRandomise}
        >
          <Feather name="shuffle" size={12} color={colors.muted} />
          <Text style={styles.mealActionText}>{randomiseLabel ?? t("kitchen.plan.shuffle")}</Text>
        </HapticPressable>
        <HapticPressable
          style={[styles.mealAction, removeDisabled && styles.mealActionDisabled]}
          pressedOpacity={0.75}
          hapticType="light"
          disabled={removeDisabled}
          onPress={onRemove}
        >
          <Feather name="x" size={12} color={colors.muted} />
          <Text style={styles.mealActionText}>{removeLabel ?? t("kitchen.plan.remove")}</Text>
        </HapticPressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mealCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    backgroundColor: colors.background,
  },
  mealMain: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  mealCopy: {
    flex: 1,
    minWidth: 0,
  },
  cookedBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  mealType: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    color: colors.muted,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  mealName: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.text,
  },
  mealMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 6,
  },
  mealMeta: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.muted,
  },
  mealActions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  mealAction: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 11,
  },
  mealActionDisabled: {
    opacity: 0.45,
  },
  mealActionDivider: {
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  mealActionText: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.muted,
  },
});
