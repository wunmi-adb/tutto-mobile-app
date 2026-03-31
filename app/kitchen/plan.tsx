import {
  formatDayLabel,
  getMealTypeLabel,
  getRecipeIngredients,
  getRecipeName,
  getRecipeSteps,
  RECIPE_DEFINITIONS,
  type MealTypeId,
  type RecipeId,
} from "@/components/kitchen/data";
import Input from "@/components/ui/Input";
import KeyboardAvoidingContainer from "@/components/ui/KeyboardAvoidingContainer";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type CustomMealRecipe = {
  kind: "custom";
  name: string;
  timeMinutes: number;
  servings: number;
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
  ingredients: string[];
  steps: string[];
};

type MealRecipe =
  | { kind: "preset"; recipeId: RecipeId }
  | CustomMealRecipe;

type MealSlot = {
  id: string;
  type: MealTypeId;
  recipe: MealRecipe | null;
};

type DayPlan = {
  date: string;
  meals: MealSlot[];
};

const RECIPE_POOLS: Record<MealTypeId, RecipeId[]> = {
  breakfast: ["avocadoEggsToast", "oatPorridgeBerries"],
  brunch: [],
  lunch: ["jollofRiceChicken", "mediterraneanWrap"],
  snack: [],
  dinner: ["spaghettiBolognese", "grilledSalmonGreens"],
  supper: [],
};

const ADDABLE_MEAL_TYPES: MealTypeId[] = [
  "breakfast",
  "brunch",
  "lunch",
  "snack",
  "dinner",
  "supper",
];

const pickRandomRecipe = (type: MealTypeId): MealRecipe | null => {
  const pool = RECIPE_POOLS[type];

  if (!pool.length) {
    return null;
  }

  return {
    kind: "preset",
    recipeId: pool[Math.floor(Math.random() * pool.length)],
  };
};

const generateWeek = (): DayPlan[] => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

  return Array.from({ length: 7 }, (_, index) => {
    const currentDate = new Date(monday);
    currentDate.setDate(monday.getDate() + index);

    return {
      date: currentDate.toISOString(),
      meals: [
        { id: `${index}-b`, type: "breakfast", recipe: pickRandomRecipe("breakfast") },
        { id: `${index}-l`, type: "lunch", recipe: pickRandomRecipe("lunch") },
        { id: `${index}-d`, type: "dinner", recipe: pickRandomRecipe("dinner") },
      ],
    };
  });
};

function RecipeDetail({
  recipe,
  mealType,
  onBack,
}: {
  recipe: MealRecipe;
  mealType: MealTypeId;
  onBack: () => void;
}) {
  const { t } = useI18n();

  const recipeDetails =
    recipe.kind === "preset"
      ? {
          name: getRecipeName(t, recipe.recipeId),
          timeMinutes: RECIPE_DEFINITIONS[recipe.recipeId].timeMinutes,
          servings: RECIPE_DEFINITIONS[recipe.recipeId].servings,
          calories: RECIPE_DEFINITIONS[recipe.recipeId].calories,
          protein: RECIPE_DEFINITIONS[recipe.recipeId].protein,
          carbs: RECIPE_DEFINITIONS[recipe.recipeId].carbs,
          fat: RECIPE_DEFINITIONS[recipe.recipeId].fat,
          ingredients: getRecipeIngredients(t, recipe.recipeId),
          steps: getRecipeSteps(t, recipe.recipeId),
        }
      : recipe;

  return (
    <Modal visible animationType="slide" onRequestClose={onBack}>
      <SafeAreaView style={styles.detailContainer}>
        <ScrollView style={styles.detailScroll} contentContainerStyle={styles.detailContent}>
          <View style={styles.detailHeader}>
            <TouchableOpacity style={styles.iconBtn} activeOpacity={0.75} onPress={onBack}>
              <Feather name="arrow-left" size={16} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.detailEyebrow}>{getMealTypeLabel(t, mealType)}</Text>
            <View style={styles.detailSpacer} />
          </View>

          <Text style={styles.detailTitle}>{recipeDetails.name}</Text>

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
            {[
              { label: t("kitchen.nutrition.protein"), value: recipeDetails.protein },
              { label: t("kitchen.nutrition.carbs"), value: recipeDetails.carbs },
              { label: t("kitchen.nutrition.fat"), value: recipeDetails.fat },
            ].map((item) => (
              <View key={item.label} style={styles.nutritionCard}>
                <Text style={styles.nutritionValue}>{item.value}</Text>
                <Text style={styles.nutritionLabel}>{item.label}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>{t("kitchen.common.ingredients")}</Text>
          <View style={styles.ingredientsList}>
            {recipeDetails.ingredients.map((ingredient, index) => (
              <View key={`${ingredient}-${index}`} style={styles.ingredientRow}>
                <View style={styles.bullet} />
                <Text style={styles.bodyText}>{ingredient}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>{t("kitchen.common.instructions")}</Text>
          <View style={styles.stepsList}>
            {recipeDetails.steps.map((step, index) => (
              <View key={`${step}-${index}`} style={styles.stepRow}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.bodyText}>{step}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

function AddMealModal({
  onAdd,
  onClose,
}: {
  onAdd: (name: string, type: MealTypeId) => void;
  onClose: () => void;
}) {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [selectedType, setSelectedType] = useState<MealTypeId | null>(null);

  const canAdd = name.trim().length > 0 && selectedType !== null;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.sheetOverlay} onPress={onClose}>
        <KeyboardAvoidingContainer style={styles.sheetKeyboard}>
          <Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{t("kitchen.plan.modal.title")}</Text>
              <TouchableOpacity activeOpacity={0.75} onPress={onClose}>
                <Feather name="x" size={18} color={colors.muted} />
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>{t("kitchen.plan.modal.mealTypeLabel")}</Text>
            <View style={styles.typeGrid}>
              {ADDABLE_MEAL_TYPES.map((mealType) => {
                const active = selectedType === mealType;

                return (
                  <TouchableOpacity
                    key={mealType}
                    style={[styles.typeChip, active && styles.typeChipActive]}
                    activeOpacity={0.75}
                    onPress={() => setSelectedType(mealType)}
                  >
                    <Text style={[styles.typeChipText, active && styles.typeChipTextActive]}>
                      {getMealTypeLabel(t, mealType)}
                    </Text>
                  </TouchableOpacity>
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
          </Pressable>
        </KeyboardAvoidingContainer>
      </Pressable>
    </Modal>
  );
}

function MealCard({
  slot,
  onView,
  onRandomise,
  onRemove,
}: {
  slot: MealSlot;
  onView: () => void;
  onRandomise: () => void;
  onRemove: () => void;
}) {
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

export default function PlanTab() {
  const { language, t } = useI18n();
  const [week, setWeek] = useState<DayPlan[]>(() => generateWeek());
  const todayIdx = (() => {
    const day = new Date().getDay();
    return (day + 6) % 7;
  })();
  const [selectedDay, setSelectedDay] = useState(todayIdx);
  const [viewingRecipe, setViewingRecipe] = useState<{ recipe: MealRecipe; type: MealTypeId } | null>(null);
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

  const addMeal = (dayIdx: number, name: string, type: MealTypeId) => {
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

  const randomiseMeal = (dayIdx: number, mealId: string, type: MealTypeId) => {
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
              onView={() => slot.recipe && setViewingRecipe({ recipe: slot.recipe, type: slot.type })}
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

      {viewingRecipe ? (
        <RecipeDetail
          recipe={viewingRecipe.recipe}
          mealType={viewingRecipe.type}
          onBack={() => setViewingRecipe(null)}
        />
      ) : null}

      {addingMealForDay !== null ? (
        <AddMealModal
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
  mealCard: { borderRadius: 16, borderWidth: 1, borderColor: colors.border, overflow: "hidden", backgroundColor: colors.background },
  mealMain: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 14 },
  mealCopy: { flex: 1 },
  mealType: { fontFamily: fonts.sansMedium, fontSize: 11, color: colors.muted, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 4 },
  mealName: { fontFamily: fonts.sansMedium, fontSize: 15, color: colors.text },
  mealMetaRow: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 6 },
  mealMeta: { fontFamily: fonts.sans, fontSize: 12, color: colors.muted },
  mealActions: { flexDirection: "row", borderTopWidth: 1, borderTopColor: colors.border },
  mealAction: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 11 },
  mealActionDivider: { borderRightWidth: 1, borderRightColor: colors.border },
  mealActionText: { fontFamily: fonts.sans, fontSize: 12, color: colors.muted },
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
  detailContainer: { flex: 1, backgroundColor: colors.background },
  detailScroll: { flex: 1 },
  detailContent: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32 },
  detailHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 24 },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  detailEyebrow: { fontFamily: fonts.sansMedium, fontSize: 11, color: colors.muted, letterSpacing: 1, textTransform: "uppercase" },
  detailSpacer: { width: 36 },
  detailTitle: { fontFamily: fonts.serif, fontSize: 30, lineHeight: 34, color: colors.text, marginBottom: 18 },
  metaRow: { flexDirection: "row", flexWrap: "wrap", gap: 16, marginBottom: 24 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  metaText: { fontFamily: fonts.sans, fontSize: 12, color: colors.muted },
  nutritionRow: { flexDirection: "row", gap: 10, marginBottom: 28 },
  nutritionCard: { flex: 1, borderRadius: 14, backgroundColor: colors.secondary, paddingVertical: 12, alignItems: "center" },
  nutritionValue: { fontFamily: fonts.sansMedium, fontSize: 14, color: colors.text, marginBottom: 3 },
  nutritionLabel: { fontFamily: fonts.sans, fontSize: 11, color: colors.muted },
  sectionTitle: { fontFamily: fonts.sansMedium, fontSize: 11, color: colors.muted, letterSpacing: 1, marginBottom: 12 },
  ingredientsList: { gap: 10, marginBottom: 28 },
  ingredientRow: { flexDirection: "row", gap: 10, alignItems: "center" },
  bullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.text + "55" },
  bodyText: { flex: 1, fontFamily: fonts.sans, fontSize: 14, lineHeight: 21, color: colors.text },
  stepsList: { gap: 14 },
  stepRow: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  stepNumber: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.text, alignItems: "center", justifyContent: "center", marginTop: 1 },
  stepNumberText: { fontFamily: fonts.sansMedium, fontSize: 11, color: colors.background },
  sheetOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  sheetKeyboard: { justifyContent: "flex-end" },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 36,
  },
  sheetHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 18 },
  sheetTitle: { fontFamily: fonts.sansMedium, fontSize: 15, color: colors.text },
  fieldLabel: { fontFamily: fonts.sansMedium, fontSize: 12, letterSpacing: 0.5, color: colors.muted, marginBottom: 10, textTransform: "uppercase" },
  typeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 },
  typeChip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: colors.border },
  typeChipActive: { backgroundColor: colors.text, borderColor: colors.text },
  typeChipText: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.muted },
  typeChipTextActive: { color: colors.background },
  helpText: { fontFamily: fonts.sans, fontSize: 12, color: colors.muted, marginBottom: 10 },
  inputWrap: { marginBottom: 18 },
  addButton: { borderRadius: 12, backgroundColor: colors.brand, alignItems: "center", paddingVertical: 15 },
  addButtonDisabled: { opacity: 0.3 },
  addButtonText: { fontFamily: fonts.sansMedium, fontSize: 15, color: colors.background },
});
