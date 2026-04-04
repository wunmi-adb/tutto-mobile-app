import { getMealTypeLabel, type MealTypeId } from "@/components/dashboard/data";
import { ADDABLE_MEAL_TYPES } from "@/components/dashboard/plan/helpers";
import type { PantryItem } from "@/components/dashboard/kitchen/types";
import BackButton from "@/components/ui/BackButton";
import Button from "@/components/ui/Button";
import HapticPressable from "@/components/ui/HapticPressable";
import Input from "@/components/ui/Input";
import KeyboardAvoidingContainer from "@/components/ui/KeyboardAvoidingContainer";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import { useAddMealState } from "@/stores/addMealStore";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  onAddCookedMeal: (item: PantryItem, type: MealTypeId) => Promise<void> | void;
  onAddRecipeMeal: (name: string, type: MealTypeId) => Promise<void> | void;
  onBack: () => void;
  submitting?: boolean;
};

export default function AddMealScreen({
  onAddCookedMeal,
  onAddRecipeMeal,
  onBack,
  submitting = false,
}: Props) {
  const { t } = useI18n();
  const {
    mealKind,
    selectedType,
    name,
    searchValue,
    cookedItems,
    isLoading,
    canSubmit,
    getEmptyStateText,
    selectRecipeMode,
    selectCookedMealMode,
    setSelectedType,
    setName,
    setSearchValue,
    selectCookedItem,
    submit,
  } = useAddMealState({
    onAddCookedMeal,
    onAddRecipeMeal,
    submitting,
  });

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingContainer style={styles.keyboard}>
        <View style={styles.header}>
          <BackButton onPress={onBack} />
          <Text style={styles.headerTitle}>{t("kitchen.plan.addScreen.title")}</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.kindToggle}>
            <HapticPressable
              style={[styles.kindOption, mealKind === "recipe" && styles.kindOptionActive]}
              pressedOpacity={0.85}
              onPress={selectRecipeMode}
            >
              <Text style={[styles.kindOptionText, mealKind === "recipe" && styles.kindOptionTextActive]}>
                {t("kitchen.plan.addScreen.recipeToggle")}
              </Text>
            </HapticPressable>
            <HapticPressable
              style={[styles.kindOption, mealKind === "cooked_meal" && styles.kindOptionActive]}
              pressedOpacity={0.85}
              onPress={selectCookedMealMode}
            >
              <Text
                style={[styles.kindOptionText, mealKind === "cooked_meal" && styles.kindOptionTextActive]}
              >
                {t("kitchen.plan.addScreen.cookedMealToggle")}
              </Text>
            </HapticPressable>
          </View>

          <Text style={styles.fieldLabel}>{t("kitchen.plan.modal.mealTypeLabel")}</Text>
          <View style={styles.typeGrid}>
            {ADDABLE_MEAL_TYPES.map((mealType) => {
              const active = selectedType === mealType;

              return (
                <HapticPressable
                  key={mealType}
                  style={[styles.typeChip, active && styles.typeChipActive]}
                  pressedOpacity={0.8}
                  onPress={() => setSelectedType(mealType)}
                >
                  <Text style={[styles.typeChipText, active && styles.typeChipTextActive]}>
                    {getMealTypeLabel(t, mealType)}
                  </Text>
                </HapticPressable>
              );
            })}
          </View>

          {mealKind === "recipe" ? (
            <>
              <Text style={styles.fieldLabel}>{t("kitchen.plan.modal.mealNameLabel")}</Text>
              <Text style={styles.helpText}>{t("kitchen.plan.modal.help")}</Text>
              <Input
                value={name}
                onChangeText={setName}
                placeholder={t("kitchen.plan.modal.placeholder")}
              />
            </>
          ) : (
            <>
              <Text style={styles.fieldLabel}>{t("kitchen.plan.addScreen.selectFromKitchenLabel")}</Text>
              <Text style={styles.helpText}>{t("kitchen.plan.addScreen.selectFromKitchenHelp")}</Text>
              <Input
                value={searchValue}
                onChangeText={setSearchValue}
                placeholder={t("kitchen.plan.addScreen.searchKitchenPlaceholder")}
                containerStyle={styles.searchInput}
              />

              {isLoading ? (
                <View style={styles.loadingState}>
                  <ActivityIndicator size="small" color={colors.text} />
                  <Text style={styles.loadingText}>{t("dashboard.kitchen.loading")}</Text>
                </View>
              ) : cookedItems.length === 0 ? (
                <View style={styles.emptyState}>
                  <MaterialCommunityIcons name="fridge-outline" size={28} color={colors.muted + "66"} />
                  <Text style={styles.emptyText}>{getEmptyStateText()}</Text>
                </View>
              ) : (
                <View style={styles.cookedList}>
                  {cookedItems.map((item) => {
                    const selected = item.id === name;

                    return (
                      <HapticPressable
                        key={item.id}
                        style={[styles.cookedItemRow, selected && styles.cookedItemRowSelected]}
                        pressedOpacity={0.82}
                        onPress={() => selectCookedItem(item.id)}
                      >
                        <View style={styles.cookedItemIcon}>
                          <MaterialCommunityIcons name="fridge-outline" size={16} color={colors.muted} />
                        </View>
                        <View style={styles.cookedItemCopy}>
                          <Text style={styles.cookedItemName}>{item.name}</Text>
                          <Text style={styles.cookedItemMeta}>{item.location}</Text>
                        </View>
                        {selected ? <Feather name="check" size={16} color={colors.text} /> : null}
                      </HapticPressable>
                    );
                  })}
                </View>
              )}
            </>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title={t("kitchen.plan.modal.cta")}
            disabled={!canSubmit}
            loading={submitting}
            onPress={() => {
              void submit();
            }}
            style={styles.submitButton}
          />
        </View>
      </KeyboardAvoidingContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboard: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 14,
  },
  headerTitle: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.text,
  },
  headerSpacer: {
    width: 36,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  kindToggle: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: colors.secondary,
    borderRadius: 16,
    padding: 4,
    marginBottom: 24,
  },
  kindOption: {
    flex: 1,
    minHeight: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  kindOptionActive: {
    backgroundColor: colors.background,
  },
  kindOptionText: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.muted,
  },
  kindOptionTextActive: {
    color: colors.text,
  },
  fieldLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    letterSpacing: 0.6,
    color: colors.muted,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  typeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
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
    lineHeight: 18,
    color: colors.muted,
    marginBottom: 10,
  },
  searchInput: {
    marginBottom: 14,
  },
  loadingState: {
    paddingVertical: 32,
    alignItems: "center",
    gap: 10,
  },
  loadingText: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
  },
  emptyState: {
    paddingVertical: 36,
    alignItems: "center",
    gap: 10,
  },
  emptyText: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.muted,
    textAlign: "center",
  },
  cookedList: {
    gap: 8,
  },
  cookedItemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cookedItemRowSelected: {
    borderColor: colors.text,
    backgroundColor: colors.secondary,
  },
  cookedItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  cookedItemCopy: {
    flex: 1,
  },
  cookedItemName: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.text,
  },
  cookedItemMeta: {
    marginTop: 3,
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.muted,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  submitButton: {
    marginTop: 0,
  },
});
