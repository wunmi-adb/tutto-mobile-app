import {
  RECIPE_DEFINITIONS,
  getMealTypeLabel,
  getRecipeName,
} from "@/components/dashboard/data";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { MealSlot } from "./types";

type Props = {
  slot: MealSlot;
  onView: () => void;
  onRandomise: () => void;
  onRemove: () => void;
};

export default function MealCard({ slot, onView, onRandomise, onRemove }: Props) {
  const { t } = useI18n();

  if (!slot.recipe) {
    return null;
  }

  const recipeName =
    slot.recipe.kind === "preset" ? getRecipeName(t, slot.recipe.recipeId) : slot.recipe.name;
  const timeMinutes =
    slot.recipe.kind === "preset"
      ? RECIPE_DEFINITIONS[slot.recipe.recipeId].timeMinutes
      : slot.recipe.timeMinutes;
  const calories =
    slot.recipe.kind === "preset"
      ? RECIPE_DEFINITIONS[slot.recipe.recipeId].calories
      : slot.recipe.calories;

  return (
    <View style={styles.mealCard}>
      <TouchableOpacity style={styles.mealMain} activeOpacity={0.75} onPress={onView}>
        <View style={styles.mealCopy}>
          <Text style={styles.mealType}>{getMealTypeLabel(t, slot.type)}</Text>
          <Text style={styles.mealName}>{recipeName}</Text>
          <View style={styles.mealMetaRow}>
            <Text style={styles.mealMeta}>{t("kitchen.common.minutes", { count: timeMinutes })}</Text>
            <Text style={styles.mealMeta}>{t("kitchen.common.calories", { count: calories })}</Text>
          </View>
        </View>
        <Feather name="chevron-right" size={14} color={colors.muted + "66"} />
      </TouchableOpacity>

      <View style={styles.mealActions}>
        <TouchableOpacity
          style={[styles.mealAction, styles.mealActionDivider]}
          activeOpacity={0.75}
          onPress={onRandomise}
        >
          <Feather name="shuffle" size={12} color={colors.muted} />
          <Text style={styles.mealActionText}>{t("kitchen.plan.shuffle")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.mealAction} activeOpacity={0.75} onPress={onRemove}>
          <Feather name="x" size={12} color={colors.muted} />
          <Text style={styles.mealActionText}>{t("kitchen.plan.remove")}</Text>
        </TouchableOpacity>
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
