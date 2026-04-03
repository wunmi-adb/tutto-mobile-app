import { ADDABLE_MEAL_TYPES } from "@/components/dashboard/plan/helpers";
import type { MealTypeId } from "@/components/dashboard/data";
import { getMealTypeLabel } from "@/components/dashboard/data";
import BottomSheet from "@/components/ui/BottomSheet";
import Input from "@/components/ui/Input";
import HapticPressable from "@/components/ui/HapticPressable";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  onAdd: (name: string, type: MealTypeId) => void;
  onClose: () => void;
};

export default function AddMealSheet({ onAdd, onClose }: Props) {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [selectedType, setSelectedType] = useState<MealTypeId | null>(null);

  const canAdd = name.trim().length > 0 && selectedType !== null;

  return (
    <BottomSheet
      visible
      onClose={onClose}
      contentStyle={styles.sheet}
      keyboardAvoiding
      header={
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>{t("kitchen.plan.modal.title")}</Text>
          <TouchableOpacity activeOpacity={0.75} onPress={onClose}>
            <Feather name="x" size={18} color={colors.muted} />
          </TouchableOpacity>
        </View>
      }
    >
      <Text style={styles.fieldLabel}>{t("kitchen.plan.modal.mealTypeLabel")}</Text>
      <View style={styles.typeGrid}>
        {ADDABLE_MEAL_TYPES.map((mealType) => {
          const active = selectedType === mealType;

          return (
            <HapticPressable
              key={mealType}
              style={[styles.typeChip, active && styles.typeChipActive]}
              pressedOpacity={0.75}
              onPress={() => setSelectedType(mealType)}
            >
              <Text style={[styles.typeChipText, active && styles.typeChipTextActive]}>
                {getMealTypeLabel(t, mealType)}
              </Text>
            </HapticPressable>
          );
        })}
      </View>

      <Text style={styles.fieldLabel}>{t("kitchen.plan.modal.mealNameLabel")}</Text>
      <Text style={styles.helpText}>{t("kitchen.plan.modal.help")}</Text>
      <Input
        value={name}
        onChangeText={setName}
        placeholder={t("kitchen.plan.modal.placeholder")}
        containerStyle={styles.inputWrap}
      />

      <TouchableOpacity
        style={[styles.addButton, !canAdd && styles.addButtonDisabled]}
        disabled={!canAdd}
        activeOpacity={0.82}
        onPress={() => {
          if (!canAdd || !selectedType) {
            return;
          }

          onAdd(name.trim(), selectedType);
        }}
      >
        <Text style={styles.addButtonText}>{t("kitchen.plan.modal.cta")}</Text>
      </TouchableOpacity>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheet: {
    paddingHorizontal: 24,
    paddingTop: 4,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  sheetTitle: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.text,
  },
  fieldLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    letterSpacing: 0.5,
    color: colors.muted,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  typeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  typeChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typeChipActive: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  typeChipText: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.muted,
  },
  typeChipTextActive: {
    color: colors.background,
  },
  helpText: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.muted,
    marginBottom: 10,
  },
  inputWrap: {
    marginBottom: 18,
  },
  addButton: {
    borderRadius: 12,
    backgroundColor: colors.brand,
    alignItems: "center",
    paddingVertical: 15,
  },
  addButtonDisabled: {
    opacity: 0.3,
  },
  addButtonText: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.background,
  },
});
