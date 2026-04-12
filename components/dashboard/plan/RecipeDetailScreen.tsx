import { resolveMealRecipe } from "@/components/dashboard/plan/helpers";
import RecipeSourceBadge from "@/components/dashboard/recipes/RecipeSourceBadge";
import type { RecipeCreator, RecipeSource } from "@/components/dashboard/recipes/types";
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
import { useEffect, useMemo, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

type Props = {
  creator?: RecipeCreator;
  heroImage?: string;
  mealType: string;
  onBack: () => void;
  onCookedThis: (recipe: MealRecipe) => void;
  onSave: (recipe: MealRecipe) => void;
  onStartCooking: (recipe: MealRecipe) => void;
  recipe: MealRecipe;
  source?: RecipeSource;
};

const KITCHEN_INVENTORY = [
  "plain flour",
  "flour",
  "eggs",
  "egg",
  "milk",
  "butter",
  "salt",
  "sugar",
  "olive oil",
  "garlic",
  "onion",
  "onions",
  "pepper",
  "black pepper",
  "spaghetti",
  "pasta",
  "rice",
  "soy sauce",
  "ginger",
  "chilli flakes",
  "lemon",
  "lemon juice",
  "paprika",
  "cumin",
  "vegetable oil",
] as const;

const PLATFORM_LABELS: Record<RecipeCreator["platform"], string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
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

function isInKitchen(ingredient: string) {
  const lower = ingredient.toLowerCase();
  return KITCHEN_INVENTORY.some((item) => lower.includes(item));
}

function getIngredientStatusMap(ingredients: string[]) {
  return ingredients.reduce<Record<number, boolean>>((acc, ingredient, index) => {
    acc[index] = isInKitchen(ingredient);
    return acc;
  }, {});
}

export default function RecipeDetailScreen({
  creator,
  heroImage,
  mealType: _mealType,
  onBack,
  onCookedThis: _onCookedThis,
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
  const [ingredientStatus, setIngredientStatus] = useState<Record<number, boolean>>(() =>
    getIngredientStatusMap(recipeDetails.ingredients),
  );

  useEffect(() => {
    setIngredientStatus(getIngredientStatusMap(ingredients));
  }, [ingredients]);

  const handleSave = () => {
    onSave(serializedRecipe);
    finishEditing();
  };

  const handleStartCooking = () => {
    onStartCooking(serializedRecipe);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        title: recipeDetails.name,
        message: `Check out this recipe: ${recipeDetails.name}`,
      });
    } catch {
      // Ignore cancelled or unsupported share flows.
    }
  };

  const handleOpenCreator = () => {
    if (!creator) {
      return;
    }

    void Linking.openURL(creator.url);
  };

  const toggleIngredientStatus = (index: number) => {
    setIngredientStatus((current) => ({
      ...current,
      [index]: !current[index],
    }));
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

  const haveCount = ingredients.filter((_, index) => ingredientStatus[index]).length;
  const needCount = ingredients.length - haveCount;

  const renderHeaderAction = () => {
    const actionStyle = heroImage ? styles.heroHeaderAction : styles.headerAction;
    const actionActiveStyle = heroImage ? styles.heroHeaderActionActive : styles.headerActionActive;
    const iconColor = heroImage ? colors.text : colors.text;
    const activeIconColor = heroImage ? colors.text : colors.background;

    if (editing) {
      return (
        <HapticPressable style={actionActiveStyle} onPress={handleSave} pressedOpacity={1} hapticType="medium">
          <Feather name="check" size={16} color={activeIconColor} />
        </HapticPressable>
      );
    }

    return (
      <HapticPressable style={actionStyle} onPress={startEditing} pressedOpacity={1} hapticType="selection">
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
        <View pointerEvents="none" style={styles.heroFadeWrap}>
          <Svg width="100%" height="100%" preserveAspectRatio="none">
            <Defs>
              <LinearGradient id="recipeHeroFade" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#ffffff" stopOpacity="0" />
                <Stop offset="0.5" stopColor="#ffffff" stopOpacity="0.4" />
                <Stop offset="1" stopColor="#ffffff" stopOpacity="1" />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height="100%" fill="url(#recipeHeroFade)" />
          </Svg>
        </View>
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
      return <View style={styles.headerNoHeroSpacer} />;
    }

    return (
      <View style={styles.header}>
        <BackButton onPress={onBack} />
        {source ? <RecipeSourceBadge source={source} /> : <View style={styles.headerBadgeSpacer} />}
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
            pressedOpacity={1}
            hapticType="selection"
          >
            <Feather name="trash-2" size={15} color={colors.muted} />
          </HapticPressable>
        </View>
      );
    }

    if (ingredientStatus[index]) {
      return (
        <HapticPressable
          key={`${ingredient}-${index}`}
          style={styles.ingredientToggleRow}
          onPress={() => toggleIngredientStatus(index)}
          pressedOpacity={1}
          hapticType="selection"
        >
          <Feather name="check-circle" size={15} color={colors.brand} />
          <Text style={styles.ingredientToggleText}>{ingredient}</Text>
        </HapticPressable>
      );
    }

    return (
      <HapticPressable
        key={`${ingredient}-${index}`}
        style={styles.ingredientToggleRow}
        onPress={() => toggleIngredientStatus(index)}
        pressedOpacity={1}
        hapticType="selection"
      >
        <View style={styles.ingredientNeedIndicator} />
        <Text style={styles.ingredientNeedText}>{ingredient}</Text>
        <Text style={styles.ingredientNeedLabel}>NEED</Text>
      </HapticPressable>
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
        <HapticPressable style={styles.addButtonSmall} onPress={addIngredient} pressedOpacity={1} hapticType="selection">
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
            <HapticPressable onPress={createStepRemoveHandler(index)} pressedOpacity={1} hapticType="selection">
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
      <HapticPressable style={styles.addStepButton} onPress={addStep} pressedOpacity={1} hapticType="selection">
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
      <View style={styles.footerActions}>
        <Button
          title={t("kitchen.plan.startCooking")}
          onPress={handleStartCooking}
          leftIcon={<Feather name="play" size={16} color={colors.background} />}
          style={styles.primaryButton}
        />
        <HapticPressable style={styles.shareButton} onPress={handleShare} pressedOpacity={1} hapticType="selection">
          <Feather name="share-2" size={16} color={colors.text} />
          <Text style={styles.shareButtonText}>Share</Text>
        </HapticPressable>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={heroImage ? ["bottom"] : ["top", "bottom"]}>
      <KeyboardAvoidingView style={styles.keyboardAvoider} behavior={getKeyboardBehavior()}>
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

          {creator ? (
            <HapticPressable style={styles.creatorCard} onPress={handleOpenCreator} pressedOpacity={1} hapticType="selection">
              <View style={styles.creatorAvatar}>
                <Text style={styles.creatorAvatarText}>{creator.name.charAt(0)}</Text>
              </View>
              <View style={styles.creatorCopy}>
                <Text numberOfLines={1} style={styles.creatorName}>{creator.name}</Text>
                <Text style={styles.creatorMeta}>
                  {creator.handle} · {PLATFORM_LABELS[creator.platform]}
                </Text>
              </View>
              <Feather name="external-link" size={14} color={colors.muted} />
            </HapticPressable>
          ) : null}

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
          </View>

          {!editing ? (
            <>
              <View style={styles.ingredientsSummary}>
                <View style={styles.ingredientsSummaryItem}>
                  <Feather name="check-circle" size={14} color={colors.brand} />
                  <Text style={styles.ingredientsSummaryText}>{haveCount} in kitchen</Text>
                </View>
                <View style={styles.ingredientsDivider} />
                <View style={styles.ingredientsSummaryItem}>
                  <Feather name="alert-circle" size={14} color="#f97316" />
                  <Text style={styles.ingredientsSummaryText}>{needCount} to get</Text>
                </View>
              </View>
              <Text style={styles.ingredientsHint}>Tap an ingredient to toggle have / need</Text>
            </>
          ) : null}

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

        <View style={styles.footer}>{renderFooterAction()}</View>
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
    height: 224,
    position: "relative",
    marginBottom: 12,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(26, 18, 8, 0.14)",
  },
  heroFadeWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 88,
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
    borderColor: "transparent",
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
    marginBottom: 12,
  },
  headerBadgeSpacer: {
    width: 36,
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
    backgroundColor: colors.brand,
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
    backgroundColor: colors.brand,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 28,
    lineHeight: 32,
    color: colors.text,
    marginBottom: 16,
  },
  titleInput: {
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 20,
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
  creatorCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    backgroundColor: `${colors.secondary}80`,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 20,
  },
  creatorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${colors.brand}14`,
    alignItems: "center",
    justifyContent: "center",
  },
  creatorAvatarText: {
    fontFamily: fonts.sansBold,
    fontSize: 14,
    color: colors.brand,
  },
  creatorCopy: {
    flex: 1,
  },
  creatorName: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.text,
    marginBottom: 2,
  },
  creatorMeta: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.muted,
  },
  nutritionRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 28,
  },
  nutritionCard: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: `${colors.secondary}cc`,
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
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    color: colors.muted,
    letterSpacing: 1,
    marginBottom: 12,
    textTransform: "uppercase",
  },
  ingredientsSummary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 14,
    backgroundColor: `${colors.secondary}80`,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  ingredientsSummaryItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ingredientsSummaryText: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.text,
  },
  ingredientsDivider: {
    width: 1,
    height: 16,
    backgroundColor: colors.border,
  },
  ingredientsHint: {
    fontFamily: fonts.sans,
    fontSize: 10,
    color: colors.muted,
    marginBottom: 10,
    paddingHorizontal: 12,
  },
  ingredientsList: {
    gap: 4,
    marginBottom: 28,
  },
  ingredientToggleRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  ingredientToggleText: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.text,
  },
  ingredientNeedIndicator: {
    width: 15,
    height: 15,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: `${colors.muted}4d`,
  },
  ingredientNeedText: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.muted,
  },
  ingredientNeedLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 10,
    color: "#f97316cc",
    letterSpacing: 0.6,
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
  footerActions: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  primaryButton: {
    marginTop: 0,
    backgroundColor: colors.text,
    flex: 1,
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 18,
    minHeight: 52,
  },
  shareButtonText: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.text,
  },
});
