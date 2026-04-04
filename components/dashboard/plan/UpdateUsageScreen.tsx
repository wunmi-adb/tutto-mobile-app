import { resolveMealRecipe } from "@/components/dashboard/plan/helpers";
import type { MealRecipe } from "@/components/dashboard/plan/types";
import type { PantryItem } from "@/components/dashboard/kitchen/types";
import FillGauge from "@/components/items/add-item/FillGauge";
import QtyStepper from "@/components/items/add-item/QtyStepper";
import {
  COOKED_FILL_OPTIONS,
  INGREDIENT_FILL_OPTIONS,
  type FillLevel,
} from "@/components/items/add-item/types";
import Button from "@/components/ui/Button";
import HapticPressable from "@/components/ui/HapticPressable";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import { useInfiniteInventoryItems } from "@/lib/api/inventory";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type RecipeRowState = {
  fillLevel?: FillLevel;
  finished: boolean;
  quantity?: number;
  used: boolean;
};

type CookedMealDraft = {
  fillLevel?: FillLevel;
  finished: boolean;
  used: boolean;
};

export type RecipeUsageChange = {
  fillLevel: FillLevel;
  finished: boolean;
  matchedItem: PantryItem | null;
  quantity: number;
  used: boolean;
};

export type RecipeUsageResult = {
  changedCount: number;
  changes: RecipeUsageChange[];
};

export type CookedMealUsageResult = {
  changed: boolean;
  fillLevel?: FillLevel;
  finished: boolean;
};

type Props =
  | {
      mode: "cooked_meal";
      location: string;
      mealName: string;
      initialFillLevel?: FillLevel;
      onDone: (result: CookedMealUsageResult) => Promise<void> | void;
      onSkip?: () => void;
      saving?: boolean;
    }
  | {
      mode: "recipe";
      onDone: (result: RecipeUsageResult) => Promise<void> | void;
      onSkip?: () => void;
      recipe: MealRecipe;
      saving?: boolean;
    };

const COOKED_DEFAULT_FILL_LEVEL: FillLevel = "half";
const RECIPE_FALLBACK_FILL_LEVEL: FillLevel = "sealed";
const COMMON_INGREDIENT_WORDS = new Set([
  "a",
  "an",
  "and",
  "chopped",
  "cup",
  "cups",
  "fresh",
  "g",
  "kg",
  "large",
  "medium",
  "ml",
  "of",
  "oz",
  "small",
  "tbsp",
  "teaspoon",
  "to",
  "tsp",
]);

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenizeIngredient(value: string) {
  return normalizeText(value)
    .split(" ")
    .filter((token) => token && !COMMON_INGREDIENT_WORDS.has(token) && Number.isNaN(Number(token)));
}

function getIngredientMatchScore(ingredient: string, item: PantryItem) {
  const normalizedIngredient = normalizeText(ingredient);
  const normalizedItemName = normalizeText(item.name);

  if (!normalizedIngredient || !normalizedItemName) {
    return 0;
  }

  if (normalizedIngredient.includes(normalizedItemName)) {
    return normalizedItemName.length + 10;
  }

  if (normalizedItemName.includes(normalizedIngredient)) {
    return normalizedIngredient.length + 10;
  }

  const ingredientTokens = tokenizeIngredient(ingredient);
  const itemTokens = tokenizeIngredient(item.name);
  const ingredientTokenSet = new Set(ingredientTokens);
  const itemTokenSet = new Set(itemTokens);

  let overlap = 0;

  ingredientTokenSet.forEach((token) => {
    if (itemTokenSet.has(token)) {
      overlap += token.length;
    }
  });

  return overlap;
}

function matchIngredientToInventoryItem(ingredient: string, items: PantryItem[]) {
  let bestMatch: PantryItem | null = null;
  let bestScore = 0;

  items.forEach((item) => {
    if (item.type !== "ingredient") {
      return;
    }

    const score = getIngredientMatchScore(ingredient, item);

    if (score > bestScore) {
      bestMatch = item;
      bestScore = score;
    }
  });

  if (bestScore > 0) {
    return bestMatch;
  }

  return null;
}

function getPantryItemLabel(t: ReturnType<typeof useI18n>["t"], item: PantryItem) {
  return t("kitchen.plan.updateUsage.matchedTo", { itemName: item.name });
}

function getFillLabelKey(mode: "cooked_meal" | "ingredient", level: FillLevel) {
  if (level === "sealed") {
    return "kitchen.fill.full" as const;
  }

  if (level === "just_opened") {
    if (mode === "cooked_meal") {
      return "kitchen.fill.full" as const;
    }

    return "kitchen.fill.almostFull" as const;
  }

  if (level === "half") {
    return "kitchen.fill.halfLeft" as const;
  }

  return "kitchen.fill.almostEmpty" as const;
}

function getFillLevelOptions(
  t: ReturnType<typeof useI18n>["t"],
  mode: "cooked_meal" | "ingredient",
) {
  const options = mode === "cooked_meal" ? COOKED_FILL_OPTIONS : INGREDIENT_FILL_OPTIONS;

  return options.map((option) => {
    return {
      key: option.key,
      label: t(getFillLabelKey(mode, option.key)),
      percent: option.percent,
    };
  });
}

function getRecipeDraftCount(drafts: RecipeRowState[]) {
  return drafts.filter((draft) => draft.used || draft.finished).length;
}

function getInitialQuantity(item: PantryItem | null) {
  return Math.max(1, Math.round(item?.batches[0]?.qty ?? 1));
}

function getInitialFillLevel(item: PantryItem | null) {
  return item?.batches[0]?.fillLevel ?? RECIPE_FALLBACK_FILL_LEVEL;
}

function getCookedMealChanged(draft: CookedMealDraft) {
  return draft.used || draft.finished;
}

function getCookedMealDoneResult(draft: CookedMealDraft) {
  return {
    changed: getCookedMealChanged(draft),
    fillLevel: draft.finished ? undefined : draft.fillLevel,
    finished: draft.finished,
  };
}

export default function UpdateUsageScreen(props: Props) {
  const { t } = useI18n();
  const isCookedMealMode = props.mode === "cooked_meal";
  const isRecipeMode = props.mode === "recipe";
  const inventoryQuery = useInfiniteInventoryItems();
  const inventoryItems = useMemo(
    () => inventoryQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [inventoryQuery.data],
  );

  const recipeDetails = useMemo(
    () => (isRecipeMode ? resolveMealRecipe(props.recipe, t) : null),
    [isRecipeMode, props, t],
  );

  const matchedItems = useMemo<(PantryItem | null)[]>(() => {
    if (!recipeDetails) {
      return [];
    }

    return recipeDetails.ingredients.map((ingredient) => matchIngredientToInventoryItem(ingredient, inventoryItems));
  }, [inventoryItems, recipeDetails]);

  const [recipeDrafts, setRecipeDrafts] = useState<RecipeRowState[]>(() =>
    isRecipeMode
      ? resolveMealRecipe(props.recipe, t).ingredients.map(() => ({
          fillLevel: undefined,
          finished: false,
          quantity: undefined,
          used: false,
        }))
      : [],
  );
  const [cookedDraft, setCookedDraft] = useState<CookedMealDraft>(() => ({
    fillLevel: isCookedMealMode ? props.initialFillLevel ?? COOKED_DEFAULT_FILL_LEVEL : undefined,
    finished: false,
    used: false,
  }));

  const ingredientFillOptions = useMemo(() => getFillLevelOptions(t, "ingredient"), [t]);
  const cookedFillOptions = useMemo(() => getFillLevelOptions(t, "cooked_meal"), [t]);

  let changedCount = 0;

  if (isRecipeMode) {
    changedCount = getRecipeDraftCount(recipeDrafts);
  } else if (getCookedMealChanged(cookedDraft)) {
    changedCount = 1;
  }

  const updateRecipeDraft = (index: number, updater: (draft: RecipeRowState) => RecipeRowState) => {
    setRecipeDrafts((current) => current.map((draft, draftIndex) => (draftIndex === index ? updater(draft) : draft)));
  };

  const getRecipeUsageResult = (): RecipeUsageResult => {
    return {
      changedCount: getRecipeDraftCount(recipeDrafts),
      changes: recipeDrafts.map((draft, index) => {
        const matchedItem: PantryItem | null = matchedItems[index] ?? null;

        return {
          fillLevel: draft.fillLevel ?? getInitialFillLevel(matchedItem),
          finished: draft.finished,
          matchedItem,
          quantity: draft.quantity ?? getInitialQuantity(matchedItem),
          used: draft.used,
        };
      }),
    };
  };

  const completeUsageUpdate = async () => {
    if (isCookedMealMode) {
      await props.onDone(getCookedMealDoneResult(cookedDraft));
      return;
    }

    await props.onDone(getRecipeUsageResult());
  };

  const getChoiceButtonStyle = (active: boolean, primary: boolean) => [
    styles.choice,
    active && (primary ? styles.choicePrimary : styles.choiceActive),
  ];

  const getChoiceTextStyle = (active: boolean, primary: boolean) => [
    styles.choiceText,
    active && (primary ? styles.choicePrimaryText : styles.choiceTextActive),
  ];

  const getDoneTitle = () => {
    if (isCookedMealMode) {
      if (changedCount > 0) {
        return t("kitchen.plan.updateUsage.doneLeftovers");
      }

      return t("kitchen.plan.updateUsage.done");
    }

    if (changedCount > 0) {
      return t("kitchen.plan.updateUsage.doneChanged", { count: changedCount });
    }

    return t("kitchen.plan.updateUsage.done");
  };

  const toggleCookedFinished = () => {
    setCookedDraft((current) => ({
      ...current,
      finished: !current.finished,
      used: true,
    }));
  };

  const markCookedMealUnchanged = () => {
    setCookedDraft((current) => ({ ...current, used: false, finished: false }));
  };

  const markCookedMealUsed = () => {
    setCookedDraft((current) => ({ ...current, used: true }));
  };

  const updateCookedMealFillLevel = (nextLevel: FillLevel) => {
    setCookedDraft((current) => ({
      ...current,
      fillLevel: nextLevel,
      used: true,
    }));
  };

  const toggleRecipeFinished = (index: number) => {
    updateRecipeDraft(index, (current) => ({
      ...current,
      finished: !current.finished,
      used: !current.finished || current.used,
    }));
  };

  const markRecipeIngredientUnchanged = (index: number) => {
    updateRecipeDraft(index, (current) => ({
      ...current,
      finished: false,
      used: false,
    }));
  };

  const markRecipeIngredientUsed = (index: number) => {
    updateRecipeDraft(index, (current) => ({
      ...current,
      used: true,
    }));
  };

  const updateRecipeIngredientQuantity = (index: number, nextQuantity: number) => {
    updateRecipeDraft(index, (current) => ({
      ...current,
      quantity: nextQuantity,
      used: true,
    }));
  };

  const updateRecipeIngredientFillLevel = (index: number, nextLevel: FillLevel) => {
    updateRecipeDraft(index, (current) => ({
      ...current,
      fillLevel: nextLevel,
      used: true,
    }));
  };

  const renderCookedMealAdjustment = () => {
    if (!cookedDraft.used) {
      return null;
    }

    if (cookedDraft.finished) {
      return (
        <View style={styles.adjustmentSection}>
          <View style={styles.finishedState}>
            <Feather name="check-circle" size={16} color={colors.success} />
            <Text style={styles.finishedStateText}>{t("dashboard.kitchen.status.finished")}</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.adjustmentSection}>
        <Text style={styles.fieldLabel}>{t("kitchen.plan.updateUsage.remainingFill")}</Text>
        <FillGauge
          level={cookedDraft.fillLevel ?? COOKED_DEFAULT_FILL_LEVEL}
          onChange={updateCookedMealFillLevel}
          options={cookedFillOptions}
        />
      </View>
    );
  };

  const renderChoiceButton = ({
    active,
    label,
    onPress,
    primary = false,
  }: {
    active: boolean;
    label: string;
    onPress: () => void;
    primary?: boolean;
  }) => (
    <HapticPressable
      style={getChoiceButtonStyle(active, primary)}
      pressedOpacity={0.82}
      onPress={onPress}
    >
      <Text style={getChoiceTextStyle(active, primary)}>{label}</Text>
    </HapticPressable>
  );

  const renderFinishedPill = (active: boolean, onPress: () => void) => (
    <HapticPressable
      style={[styles.finishedPill, active && styles.finishedPillActive]}
      pressedOpacity={0.82}
      onPress={onPress}
    >
      <Text style={[styles.finishedPillText, active && styles.finishedPillTextActive]}>
        {t("kitchen.plan.updateUsage.markFinished")}
      </Text>
    </HapticPressable>
  );

  const renderMatchedMeta = (matchedItem: PantryItem | null) => {
    if (!matchedItem) {
      return <Text style={styles.unmatchedText}>{t("kitchen.plan.updateUsage.noMatch")}</Text>;
    }

    return (
      <>
        <Text style={styles.cardMeta}>{getPantryItemLabel(t, matchedItem)}</Text>
        <View style={styles.metaStack}>
          <View style={styles.metaPill}>
            <Feather name="map-pin" size={12} color={colors.muted} />
            <Text style={styles.metaPillText}>{matchedItem.location}</Text>
          </View>
        </View>
      </>
    );
  };

  const renderRecipeAdjustment = (
    draft: RecipeRowState,
    fillLevel: FillLevel,
    index: number,
    matchedItem: PantryItem | null,
    quantity: number,
  ) => {
    if (!draft.used || !matchedItem) {
      return null;
    }

    if (draft.finished) {
      return (
        <View style={styles.adjustmentSection}>
          <View style={styles.finishedState}>
            <Feather name="check-circle" size={16} color={colors.success} />
            <Text style={styles.finishedStateText}>{t("dashboard.kitchen.status.finished")}</Text>
          </View>
        </View>
      );
    }

    if (matchedItem.countAsUnits) {
      return (
        <View style={styles.adjustmentSection}>
          <Text style={styles.fieldLabel}>{t("kitchen.plan.updateUsage.remainingQuantity")}</Text>
          <QtyStepper value={quantity} onChange={(nextQuantity) => updateRecipeIngredientQuantity(index, nextQuantity)} />
        </View>
      );
    }

    return (
      <View style={styles.adjustmentSection}>
        <Text style={styles.fieldLabel}>{t("kitchen.plan.updateUsage.remainingFill")}</Text>
        <FillGauge
          level={fillLevel}
          onChange={(nextLevel) => updateRecipeIngredientFillLevel(index, nextLevel)}
          options={ingredientFillOptions}
        />
      </View>
    );
  };

  const renderRecipeNote = (matchedItem: PantryItem | null) => {
    if (matchedItem) {
      return null;
    }

    return <Text style={styles.noteText}>{t("kitchen.plan.updateUsage.noMatchSubtitle")}</Text>;
  };

  const renderCookedMealCard = () => {
    if (!isCookedMealMode) {
      return null;
    }

    return (
      <View style={styles.list}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardCopy}>
              <Text style={styles.cardTitle}>{props.mealName}</Text>
              <Text style={styles.cardMeta}>{t("kitchen.plan.cookedMeal")}</Text>
            </View>
            {renderFinishedPill(cookedDraft.finished, toggleCookedFinished)}
          </View>

          <View style={styles.metaStack}>
            <View style={styles.metaPill}>
              <Feather name="map-pin" size={12} color={colors.muted} />
              <Text style={styles.metaPillText}>{props.location}</Text>
            </View>
          </View>

          <View style={styles.choiceRow}>
            {renderChoiceButton({
              active: !cookedDraft.used,
              label: t("kitchen.plan.updateUsage.noChange"),
              onPress: markCookedMealUnchanged,
            })}
            {renderChoiceButton({
              active: cookedDraft.used,
              label: t("kitchen.plan.updateUsage.usedSome"),
              onPress: markCookedMealUsed,
              primary: true,
            })}
          </View>
          {renderCookedMealAdjustment()}
        </View>
      </View>
    );
  };

  const renderRecipeCard = (ingredient: string, index: number) => {
    const matchedItem: PantryItem | null = matchedItems[index] ?? null;
    const draft = recipeDrafts[index];
    const quantity = draft.quantity ?? getInitialQuantity(matchedItem);
    const fillLevel = draft.fillLevel ?? getInitialFillLevel(matchedItem);

    return (
      <View key={`${ingredient}-${index}`} style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardCopy}>
            <Text style={styles.cardTitle}>{ingredient}</Text>
            {renderMatchedMeta(matchedItem)}
          </View>
          {matchedItem ? renderFinishedPill(draft.finished, () => toggleRecipeFinished(index)) : null}
        </View>

        <View style={styles.choiceRow}>
          {renderChoiceButton({
            active: !draft.used,
            label: t("kitchen.plan.updateUsage.noChange"),
            onPress: () => markRecipeIngredientUnchanged(index),
          })}
          {renderChoiceButton({
            active: draft.used,
            label: t("kitchen.plan.updateUsage.usedSome"),
            onPress: () => markRecipeIngredientUsed(index),
            primary: true,
          })}
        </View>

        {renderRecipeNote(matchedItem)}
        {renderRecipeAdjustment(draft, fillLevel, index, matchedItem, quantity)}
      </View>
    );
  };

  const renderRecipeCards = () => {
    if (!recipeDetails) {
      return null;
    }

    return <View style={styles.list}>{recipeDetails.ingredients.map(renderRecipeCard)}</View>;
  };

  const renderUsageContent = () => {
    if (isCookedMealMode) {
      return renderCookedMealCard();
    }

    return renderRecipeCards();
  };

  const renderHero = () => {
    if (isCookedMealMode) {
      return (
        <>
          <View style={styles.heroIcon}>
            <MaterialCommunityIcons name="fridge-outline" size={22} color={colors.text} />
          </View>
          <Text style={styles.heroTitle}>{t("kitchen.plan.updateUsage.title")}</Text>
          <Text style={styles.heroSubtitle}>
            {t("kitchen.plan.updateUsage.subtitleCooked", { mealName: props.mealName })}
          </Text>
        </>
      );
    }

    return (
      <>
        <View style={styles.heroIcon}>
          <Feather name="check" size={22} color={colors.success} />
        </View>
        <Text style={styles.heroTitle}>{t("kitchen.plan.updateUsage.title")}</Text>
        <Text style={styles.heroSubtitle}>
          {t("kitchen.plan.updateUsage.subtitle", { recipeName: recipeDetails?.name ?? "" })}
        </Text>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.topBar}>
        <HapticPressable
          onPress={() => {
            props.onSkip?.();
          }}
          pressedOpacity={0.8}
        >
          <Text style={styles.skipText}>{t("kitchen.plan.updateUsage.skip")}</Text>
        </HapticPressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.hero}>{renderHero()}</View>
        {renderUsageContent()}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={getDoneTitle()}
          loading={props.saving}
          onPress={() => {
            void completeUsageUpdate();
          }}
          style={styles.doneButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    alignItems: "flex-end",
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  skipText: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.muted,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  hero: {
    alignItems: "center",
    marginTop: 8,
    marginBottom: 28,
  },
  heroIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  heroTitle: {
    fontFamily: fonts.serif,
    fontSize: 28,
    lineHeight: 31,
    color: colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  heroSubtitle: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 21,
    color: colors.muted,
    textAlign: "center",
    maxWidth: 300,
  },
  list: {
    gap: 12,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  cardCopy: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.text,
  },
  cardMeta: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
  },
  metaStack: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  metaPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: colors.secondary,
  },
  metaPillText: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.text,
  },
  choiceRow: {
    flexDirection: "row",
    gap: 8,
  },
  choice: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  choiceActive: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  choicePrimary: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  choiceText: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.muted,
  },
  choiceTextActive: {
    color: colors.text,
  },
  choicePrimaryText: {
    color: colors.background,
  },
  finishedPill: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  finishedPillActive: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  finishedPillText: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    color: colors.muted,
  },
  finishedPillTextActive: {
    color: colors.background,
  },
  unmatchedText: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.warning,
  },
  noteText: {
    fontFamily: fonts.sans,
    fontSize: 12,
    lineHeight: 18,
    color: colors.muted,
  },
  adjustmentSection: {
    gap: 12,
    paddingTop: 4,
  },
  fieldLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  finishedState: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
  },
  finishedStateText: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.text,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  doneButton: {
    marginTop: 0,
  },
});
