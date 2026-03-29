import Input from "@/components/ui/Input";
import KeyboardAvoidingContainer from "@/components/ui/KeyboardAvoidingContainer";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
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

type MealRecipe = {
  name: string;
  time: string;
  servings: number;
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
  ingredients: string[];
  steps: string[];
};

type MealSlot = {
  id: string;
  type: string;
  recipe: MealRecipe | null;
};

type DayPlan = {
  day: string;
  date: number;
  month: string;
  meals: MealSlot[];
};

const RECIPE_POOL: Record<string, MealRecipe[]> = {
  Breakfast: [
    {
      name: "Avocado & Eggs on Toast",
      time: "15 min",
      servings: 2,
      calories: 380,
      protein: "18g",
      carbs: "32g",
      fat: "22g",
      ingredients: ["2 eggs", "1 avocado", "2 slices sourdough", "Chilli flakes", "Lemon juice", "Salt & pepper"],
      steps: [
        "Toast the sourdough until golden.",
        "Mash avocado with lemon juice, salt and pepper.",
        "Fry or poach eggs to your liking.",
        "Spread avocado on toast, top with eggs and chilli flakes.",
      ],
    },
    {
      name: "Oat Porridge with Berries",
      time: "10 min",
      servings: 2,
      calories: 290,
      protein: "10g",
      carbs: "48g",
      fat: "6g",
      ingredients: ["80g rolled oats", "300ml milk", "Honey", "Mixed berries", "Cinnamon"],
      steps: [
        "Combine oats and milk in a saucepan.",
        "Cook on medium heat, stirring for 5 minutes.",
        "Serve topped with berries, honey and cinnamon.",
      ],
    },
  ],
  Lunch: [
    {
      name: "Jollof Rice with Chicken",
      time: "45 min",
      servings: 4,
      calories: 520,
      protein: "32g",
      carbs: "58g",
      fat: "16g",
      ingredients: ["2 cups rice", "400g tin tomatoes", "4 chicken thighs", "1 onion", "Scotch bonnet", "Thyme", "Bay leaves", "Stock cube"],
      steps: [
        "Season and brown chicken thighs. Set aside.",
        "Blend tomatoes, onion and scotch bonnet.",
        "Fry the blended mix until reduced.",
        "Add rice, stock and spices. Cook covered on low heat for 30 min.",
        "Serve rice with chicken on top.",
      ],
    },
    {
      name: "Mediterranean Wrap",
      time: "10 min",
      servings: 1,
      calories: 420,
      protein: "22g",
      carbs: "40g",
      fat: "18g",
      ingredients: ["1 tortilla wrap", "Hummus", "Feta cheese", "Cucumber", "Tomato", "Mixed leaves", "Olives"],
      steps: [
        "Spread hummus over the wrap.",
        "Layer cucumber, tomato, olives, feta and leaves.",
        "Roll tightly and slice in half.",
      ],
    },
  ],
  Dinner: [
    {
      name: "Spaghetti Bolognese",
      time: "35 min",
      servings: 4,
      calories: 580,
      protein: "28g",
      carbs: "62g",
      fat: "22g",
      ingredients: ["400g spaghetti", "500g beef mince", "400g tin tomatoes", "1 onion", "2 garlic cloves", "Carrot", "Celery", "Oregano", "Parmesan"],
      steps: [
        "Brown mince in a large pan. Drain excess fat.",
        "Saute diced onion, carrot, celery and garlic.",
        "Add tinned tomatoes, oregano and simmer 20 min.",
        "Cook spaghetti according to packet. Drain.",
        "Serve sauce over spaghetti with grated parmesan.",
      ],
    },
    {
      name: "Grilled Salmon & Greens",
      time: "20 min",
      servings: 2,
      calories: 450,
      protein: "38g",
      carbs: "12g",
      fat: "28g",
      ingredients: ["2 salmon fillets", "Broccoli", "Asparagus", "Lemon", "Olive oil", "Garlic", "Salt & pepper"],
      steps: [
        "Season salmon with olive oil, garlic, lemon, salt and pepper.",
        "Grill salmon skin-side down for 6-8 min.",
        "Steam broccoli and asparagus until tender.",
        "Plate greens, top with salmon and a lemon wedge.",
      ],
    },
  ],
};

const pickRandom = (type: string): MealRecipe => {
  const pool = RECIPE_POOL[type] || RECIPE_POOL.Dinner;
  return pool[Math.floor(Math.random() * pool.length)];
};

const generateWeek = (): DayPlan[] => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

  return days.map((day, i) => {
    const currentDate = new Date(monday);
    currentDate.setDate(monday.getDate() + i);
    return {
      day,
      date: currentDate.getDate(),
      month: months[currentDate.getMonth()],
      meals: [
        { id: `${i}-b`, type: "Breakfast", recipe: pickRandom("Breakfast") },
        { id: `${i}-l`, type: "Lunch", recipe: pickRandom("Lunch") },
        { id: `${i}-d`, type: "Dinner", recipe: pickRandom("Dinner") },
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
  mealType: string;
  onBack: () => void;
}) {
  return (
    <Modal visible animationType="slide" onRequestClose={onBack}>
      <SafeAreaView style={styles.detailContainer}>
        <ScrollView style={styles.detailScroll} contentContainerStyle={styles.detailContent}>
          <View style={styles.detailHeader}>
            <TouchableOpacity style={styles.iconBtn} activeOpacity={0.75} onPress={onBack}>
              <Feather name="arrow-left" size={16} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.detailEyebrow}>{mealType}</Text>
            <View style={styles.detailSpacer} />
          </View>

          <Text style={styles.detailTitle}>{recipe.name}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Feather name="clock" size={14} color={colors.muted} />
              <Text style={styles.metaText}>{recipe.time}</Text>
            </View>
            <View style={styles.metaItem}>
              <Feather name="users" size={14} color={colors.muted} />
              <Text style={styles.metaText}>{recipe.servings} servings</Text>
            </View>
            <View style={styles.metaItem}>
              <Feather name="zap" size={14} color={colors.muted} />
              <Text style={styles.metaText}>{recipe.calories} cal</Text>
            </View>
          </View>

          <View style={styles.nutritionRow}>
            {[
              { label: "Protein", value: recipe.protein },
              { label: "Carbs", value: recipe.carbs },
              { label: "Fat", value: recipe.fat },
            ].map((item) => (
              <View key={item.label} style={styles.nutritionCard}>
                <Text style={styles.nutritionValue}>{item.value}</Text>
                <Text style={styles.nutritionLabel}>{item.label}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>INGREDIENTS</Text>
          <View style={styles.ingredientsList}>
            {recipe.ingredients.map((ingredient, index) => (
              <View key={`${ingredient}-${index}`} style={styles.ingredientRow}>
                <View style={styles.bullet} />
                <Text style={styles.bodyText}>{ingredient}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>INSTRUCTIONS</Text>
          <View style={styles.stepsList}>
            {recipe.steps.map((step, index) => (
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
  onAdd: (name: string, type: string) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const mealTypes = ["Breakfast", "Brunch", "Lunch", "Snack", "Dinner", "Supper"];
  const [selectedType, setSelectedType] = useState("");

  const canAdd = name.trim().length > 0 && selectedType.length > 0;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.sheetOverlay} onPress={onClose}>
        <KeyboardAvoidingContainer style={styles.sheetKeyboard}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Add a meal</Text>
              <TouchableOpacity activeOpacity={0.75} onPress={onClose}>
                <Feather name="x" size={18} color={colors.muted} />
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>MEAL TYPE</Text>
            <View style={styles.typeGrid}>
              {mealTypes.map((type) => {
                const active = selectedType === type;
                return (
                  <TouchableOpacity
                    key={type}
                    style={[styles.typeChip, active && styles.typeChipActive]}
                    activeOpacity={0.75}
                    onPress={() => setSelectedType(type)}
                  >
                    <Text style={[styles.typeChipText, active && styles.typeChipTextActive]}>{type}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.fieldLabel}>MEAL NAME</Text>
            <Text style={styles.helpText}>Just type the name and we&apos;ll generate the recipe for you.</Text>
            <Input
              value={name}
              onChangeText={setName}
              placeholder="e.g. Chicken stir-fry"
              containerStyle={styles.inputWrap}
            />

            <TouchableOpacity
              style={[styles.addButton, !canAdd && styles.addButtonDisabled]}
              disabled={!canAdd}
              activeOpacity={0.82}
              onPress={() => {
                if (!canAdd) return;
                onAdd(name.trim(), selectedType);
              }}
            >
              <Text style={styles.addButtonText}>Add meal</Text>
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
  if (!slot.recipe) return null;

  return (
    <View style={styles.mealCard}>
      <TouchableOpacity style={styles.mealMain} activeOpacity={0.75} onPress={onView}>
        <View style={styles.mealCopy}>
          <Text style={styles.mealType}>{slot.type}</Text>
          <Text style={styles.mealName}>{slot.recipe.name}</Text>
          <View style={styles.mealMetaRow}>
            <Text style={styles.mealMeta}>{slot.recipe.time}</Text>
            <Text style={styles.mealMeta}>{slot.recipe.calories} cal</Text>
          </View>
        </View>
        <Feather name="chevron-right" size={14} color={colors.muted + "66"} />
      </TouchableOpacity>

      <View style={styles.mealActions}>
        <TouchableOpacity style={[styles.mealAction, styles.mealActionDivider]} activeOpacity={0.75} onPress={onRandomise}>
          <Feather name="shuffle" size={12} color={colors.muted} />
          <Text style={styles.mealActionText}>Shuffle</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.mealAction} activeOpacity={0.75} onPress={onRemove}>
          <Feather name="x" size={12} color={colors.muted} />
          <Text style={styles.mealActionText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function PlanTab() {
  const [week, setWeek] = useState<DayPlan[]>(() => generateWeek());
  const todayIdx = (() => {
    const d = new Date().getDay();
    return (d + 6) % 7;
  })();
  const [selectedDay, setSelectedDay] = useState(todayIdx);
  const [viewingRecipe, setViewingRecipe] = useState<{ recipe: MealRecipe; type: string } | null>(null);
  const [addingMealForDay, setAddingMealForDay] = useState<number | null>(null);

  const currentDay = week[selectedDay];

  const updateMeal = (dayIdx: number, mealId: string, updates: Partial<MealSlot>) => {
    setWeek((prev) =>
      prev.map((day, i) =>
        i === dayIdx
          ? { ...day, meals: day.meals.map((meal) => (meal.id === mealId ? { ...meal, ...updates } : meal)) }
          : day
      )
    );
  };

  const removeMeal = (dayIdx: number, mealId: string) => {
    setWeek((prev) =>
      prev.map((day, i) =>
        i === dayIdx ? { ...day, meals: day.meals.filter((meal) => meal.id !== mealId) } : day
      )
    );
  };

  const addMeal = (dayIdx: number, name: string, type: string) => {
    const newMeal: MealSlot = {
      id: `${dayIdx}-custom-${Date.now()}`,
      type,
      recipe: {
        name,
        time: "30 min",
        servings: 2,
        calories: 400,
        protein: "20g",
        carbs: "45g",
        fat: "15g",
        ingredients: ["Recipe will be generated..."],
        steps: ["Recipe instructions will be generated based on the meal name."],
      },
    };

    setWeek((prev) =>
      prev.map((day, i) => (i === dayIdx ? { ...day, meals: [...day.meals, newMeal] } : day))
    );
    setAddingMealForDay(null);
  };

  const randomiseMeal = (dayIdx: number, mealId: string, type: string) => {
    updateMeal(dayIdx, mealId, { recipe: pickRandom(type) });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Meal Plan</Text>
          <Text style={styles.pageSubtitle}>Plan your week ahead</Text>
        </View>

        <View style={styles.dayStripWrap}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dayStrip}>
            {week.map((day, index) => {
              const isToday = index === todayIdx;
              const isSelected = index === selectedDay;

              return (
                <TouchableOpacity
                  key={`${day.day}-${day.date}`}
                  style={[styles.dayChip, isSelected ? styles.dayChipActive : styles.dayChipInactive]}
                  activeOpacity={0.8}
                  onPress={() => setSelectedDay(index)}
                >
                  <Text style={[styles.dayChipLabel, isSelected && styles.dayChipLabelActive]}>{day.day}</Text>
                  <Text style={[styles.dayChipDate, isSelected && styles.dayChipDateActive]}>{day.date}</Text>
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

          <TouchableOpacity style={styles.addMealGhost} activeOpacity={0.82} onPress={() => setAddingMealForDay(selectedDay)}>
            <Feather name="plus" size={14} color={colors.muted} />
            <Text style={styles.addMealGhostText}>Add a meal</Text>
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
