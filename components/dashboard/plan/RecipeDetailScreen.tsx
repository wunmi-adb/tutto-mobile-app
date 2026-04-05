import { getMealTypeLabel, type MealTypeId } from "@/components/dashboard/data";
import { resolveMealRecipe } from "@/components/dashboard/plan/helpers";
import RecipeSourceBadge from "@/components/dashboard/recipes/RecipeSourceBadge";
import type { RecipeSource } from "@/components/dashboard/recipes/types";
import type { MealRecipe } from "@/components/dashboard/plan/types";
import type { EditableStep } from "@/stores/recipeDetailStore";
import { serializeEditableStep, useRecipeDetailState } from "@/stores/recipeDetailStore";
import BackButton from "@/components/ui/BackButton";
import Button from "@/components/ui/Button";
import HapticPressable from "@/components/ui/HapticPressable";
import Input from "@/components/ui/Input";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import { Feather } from "@expo/vector-icons";
import { useMemo } from "react";
import {
  KeyboardAvoidingView,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  heroImage?: string;
  mealType: MealTypeId;
  onBack: () => void;
  onCookedThis: (recipe: MealRecipe) => void;
  onSave: (recipe: MealRecipe) => void;
  onStartCooking: (recipe: MealRecipe) => void;
  recipe: MealRecipe;
  source?: RecipeSource;
};

function getNutritionItems(
  recipeDetails: ReturnType<typeof resolveMealRecipe>,
  t: ReturnType<typeof useI18n>["t"],
) {
  return [
    { label: t("kitchen.nutrition.protein"), value: recipeDetails.protein },
    { label: t("kitchen.nutrition.carbs"), value: recipeDetails.carbs },
    { label: t("kitchen.nutrition.fat"), value: recipeDetails.fat },
  ];
}

function getKeyboardBehavior() {
  if (Platform.OS === "ios") {
    return "padding" as const;
  }

  return "height" as const;
}

export default function RecipeDetailScreen({
  heroImage,
  mealType,
  onBack,
  onCookedThis,
  onSave,
  onStartCooking,
  recipe,
  source,
}: Props) {
  const { t } = useI18n();
  const recipeDetails = useMemo(() => resolveMealRecipe(recipe, t), [recipe, t]);
  const nutritionItems = useMemo(() => getNutritionItems(recipeDetails, t), [recipeDetails, t]);
  const {
    addIngredient,
    addStep,
    editing,
    finishEditing,
    ingredients,
    name,
    newIngredient,
    removeIngredient,
    removeStep,
    serializedRecipe,
    setName,
    setNewIngredient,
    startEditing,
    steps,
    updateIngredient,
    updateStepMinutes,
    updateStepText,
  } = useRecipeDetailState(recipeDetails);

  const handleSave = () => {
    onSave(serializedRecipe);
    finishEditing();
  };

  const handleCookedThis = () => {
    onCookedThis(serializedRecipe);
  };

  const handleStartCooking = () => {
    onStartCooking(serializedRecipe);
  };

  const createIngredientChangeHandler = (index: number) => {
    return (value: string) => updateIngredient(index, value);
  };

  const createIngredientRemoveHandler = (index: number) => {
    return () => removeIngredient(index);
  };

  const createStepTextChangeHandler = (index: number) => {
    return (value: string) => updateStepText(index, value);
  };

  const createStepMinutesChangeHandler = (index: number) => {
    return (value: string) => updateStepMinutes(index, value);
  };

  const createStepRemoveHandler = (index: number) => {
    return () => removeStep(index);
  };

  const renderHeaderAction = () => {
    const actionStyle = heroImage ? styles.heroHeaderAction : styles.headerAction;
    const actionActiveStyle = heroImage ? styles.heroHeaderActionActive : styles.headerActionActive;
    const iconColor = heroImage ? colors.text : colors.text;
    const activeIconColor = heroImage ? colors.text : colors.background;

    if (editing) {
      return (
        <HapticPressable style={actionActiveStyle} onPress={handleSave} pressedOpacity={0.82}>
          <Feather name="check" size={16} color={activeIconColor} />
        </HapticPressable>
      );
    }

    return (
      <HapticPressable style={actionStyle} onPress={startEditing} pressedOpacity={0.82}>
        <Feather name="edit-2" size={14} color={iconColor} />
      </HapticPressable>
    );
  };

  const renderHero = () => {
    if (!heroImage) {
      return null;
    }

    return (
      <View style={styles.heroWrap}>
        <Image source={{ uri: heroImage }} style={styles.heroImage} resizeMode="cover" />
        <View style={styles.heroOverlay} />
        <View style={styles.heroTopRow}>
          <BackButton style={styles.heroBackButton} onPress={onBack} />
          {renderHeaderAction()}
        </View>
        {source ? (
          <View style={styles.heroBadgeWrap}>
            <RecipeSourceBadge source={source} />
          </View>
        ) : null}
      </View>
    );
  };

  const renderHeader = () => {
    if (heroImage) {
      return (
        <View style={styles.headerNoHeroSpacer}>
          <Text style={styles.eyebrow}>{getMealTypeLabel(t, mealType)}</Text>
        </View>
      );
    }

    return (
      <View style={styles.header}>
        <BackButton onPress={onBack} />
        <Text style={styles.eyebrow}>{getMealTypeLabel(t, mealType)}</Text>
        {renderHeaderAction()}
      </View>
    );
  };

  const renderTitle = () => {
    if (editing) {
      return (
        <Input
          value={name}
          onChangeText={setName}
          placeholder={recipeDetails.name}
          containerStyle={styles.titleInput}
        />
      );
    }

    return <Text style={styles.title}>{name.trim() || recipeDetails.name}</Text>;
  };

  const renderCookedThisAction = () => {
    if (editing) {
      return null;
    }

    return (
      <HapticPressable onPress={handleCookedThis} pressedOpacity={0.8}>
        <Text style={styles.inlineAction}>{t("kitchen.plan.cookedThis")}</Text>
      </HapticPressable>
    );
  };

  const renderIngredientRow = (ingredient: string, index: number) => {
    if (editing) {
      return (
        <View key={`ingredient-edit-${index}`} style={styles.editorRow}>
          <Input
            value={ingredient}
            onChangeText={createIngredientChangeHandler(index)}
            containerStyle={styles.editorInput}
          />
          <HapticPressable
            style={styles.removeButton}
            onPress={createIngredientRemoveHandler(index)}
            pressedOpacity={0.8}
          >
            <Feather name="trash-2" size={15} color={colors.muted} />
          </HapticPressable>
        </View>
      );
    }

    return (
      <View key={`${ingredient}-${index}`} style={styles.ingredientRow}>
        <View style={styles.bullet} />
        <Text style={styles.bodyText}>{ingredient}</Text>
      </View>
    );
  };

  const renderNewIngredientRow = () => {
    if (!editing) {
      return null;
    }

    return (
      <View style={styles.editorRow}>
        <Input
          value={newIngredient}
          onChangeText={setNewIngredient}
          placeholder={t("kitchen.plan.ingredientPlaceholder")}
          containerStyle={styles.editorInput}
        />
        <HapticPressable style={styles.addButtonSmall} onPress={addIngredient} pressedOpacity={0.8}>
          <Feather name="plus" size={15} color={colors.text} />
        </HapticPressable>
      </View>
    );
  };

  const renderStepRow = (step: EditableStep, index: number) => {
    if (editing) {
      return (
        <View key={`step-edit-${index}`} style={styles.stepEditorCard}>
          <View style={styles.stepEditorHeader}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{index + 1}</Text>
            </View>
            <HapticPressable onPress={createStepRemoveHandler(index)} pressedOpacity={0.8}>
              <Feather name="trash-2" size={15} color={colors.muted} />
            </HapticPressable>
          </View>
          <Input
            value={step.text}
            onChangeText={createStepTextChangeHandler(index)}
            multiline
            containerStyle={styles.stepInput}
          />
          <View style={styles.minutesRow}>
            <Feather name="clock" size={12} color={colors.muted} />
            <Input
              value={step.minutes ? String(step.minutes) : ""}
              onChangeText={createStepMinutesChangeHandler(index)}
              placeholder={t("kitchen.plan.minutesPlaceholder")}
              keyboardType="number-pad"
              containerStyle={styles.minutesInputWrap}
              style={styles.minutesInput}
            />
            <Text style={styles.minutesLabel}>{t("kitchen.plan.minutesShort")}</Text>
          </View>
        </View>
      );
    }

    return (
      <View key={`${serializeEditableStep(step)}-${index}`} style={styles.stepRow}>
        <View style={styles.stepNumber}>
          <Text style={styles.stepNumberText}>{index + 1}</Text>
        </View>
        <Text style={styles.bodyText}>{serializeEditableStep(step)}</Text>
      </View>
    );
  };

  const renderAddStepButton = () => {
    if (!editing) {
      return null;
    }

    return (
      <HapticPressable style={styles.addStepButton} onPress={addStep} pressedOpacity={0.82}>
        <Feather name="plus" size={14} color={colors.muted} />
        <Text style={styles.addStepText}>{t("kitchen.plan.addStep")}</Text>
      </HapticPressable>
    );
  };

  const renderFooterAction = () => {
    if (editing) {
      return <Button title={t("kitchen.plan.saveChanges")} onPress={handleSave} style={styles.primaryButton} />;
    }

    return (
      <Button
        title={t("kitchen.plan.startCooking")}
        onPress={handleStartCooking}
        leftIcon={<Feather name="play" size={16} color={colors.background} />}
        style={styles.primaryButton}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={heroImage ? ["bottom"] : ["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoider}
        behavior={getKeyboardBehavior()}
      >
        {renderHero()}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {renderHeader()}

          {renderTitle()}

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Feather name="clock" size={14} color={colors.muted} />
              <Text style={styles.metaText}>{t("kitchen.common.minutes", { count: recipeDetails.timeMinutes })}</Text>
            </View>
            <View style={styles.metaItem}>
              <Feather name="users" size={14} color={colors.muted} />
              <Text style={styles.metaText}>{t("kitchen.common.servings", { count: recipeDetails.servings })}</Text>
            </View>
            <View style={styles.metaItem}>
              <Feather name="zap" size={14} color={colors.muted} />
              <Text style={styles.metaText}>{t("kitchen.common.calories", { count: recipeDetails.calories })}</Text>
            </View>
          </View>

          <View style={styles.nutritionRow}>
            {nutritionItems.map((item) => (
              <View key={item.label} style={styles.nutritionCard}>
                <Text style={styles.nutritionValue}>{item.value}</Text>
                <Text style={styles.nutritionLabel}>{item.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t("kitchen.common.ingredients")}</Text>
            {renderCookedThisAction()}
          </View>

          <View style={styles.ingredientsList}>
            {ingredients.map(renderIngredientRow)}
            {renderNewIngredientRow()}
          </View>

          <Text style={styles.sectionTitle}>{t("kitchen.common.instructions")}</Text>
          <View style={styles.stepsList}>
            {steps.map(renderStepRow)}
            {renderAddStepButton()}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          {renderFooterAction()}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoider: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 128,
  },
  heroWrap: {
    height: 276,
    position: "relative",
    marginBottom: 10,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(26, 18, 8, 0.14)",
  },
  heroTopRow: {
    position: "absolute",
    top: 58,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heroBackButton: {
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  heroBadgeWrap: {
    position: "absolute",
    left: 20,
    bottom: 18,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  headerNoHeroSpacer: {
    alignItems: "flex-start",
    marginBottom: 24,
  },
  eyebrow: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    color: colors.muted,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  headerAction: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  headerActionActive: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.text,
    alignItems: "center",
    justifyContent: "center",
  },
  heroHeaderAction: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroHeaderActionActive: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.95)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 30,
    lineHeight: 34,
    color: colors.text,
    marginBottom: 18,
  },
  titleInput: {
    marginBottom: 18,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 24,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.muted,
  },
  nutritionRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 28,
  },
  nutritionCard: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: colors.secondary,
    paddingVertical: 12,
    alignItems: "center",
  },
  nutritionValue: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.text,
    marginBottom: 3,
  },
  nutritionLabel: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.muted,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    color: colors.muted,
    letterSpacing: 1,
    marginBottom: 12,
  },
  inlineAction: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.brand,
  },
  ingredientsList: {
    gap: 10,
    marginBottom: 28,
  },
  ingredientRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.text + "55",
  },
  bodyText: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 21,
    color: colors.text,
  },
  editorRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  editorInput: {
    flex: 1,
  },
  removeButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  addButtonSmall: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  stepsList: {
    gap: 14,
  },
  stepRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  stepEditorCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  stepEditorHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.text,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  stepNumberText: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    color: colors.background,
  },
  stepInput: {
    marginBottom: 10,
  },
  minutesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  minutesInputWrap: {
    width: 72,
  },
  minutesInput: {
    textAlign: "center",
  },
  minutesLabel: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.muted,
  },
  addStepButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.border,
    paddingVertical: 13,
  },
  addStepText: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  primaryButton: {
    marginTop: 0,
    backgroundColor: colors.text,
  },
});
