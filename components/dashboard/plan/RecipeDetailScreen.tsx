import {
  getMealTypeLabel,
  type MealTypeId,
} from "@/components/dashboard/data";
import { resolveMealRecipe } from "@/components/dashboard/plan/helpers";
import type { MealRecipe } from "@/components/dashboard/plan/types";
import BackButton from "@/components/ui/BackButton";
import Button from "@/components/ui/Button";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import { Feather } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  mealType: MealTypeId;
  onBack: () => void;
  onStartCooking: () => void;
  recipe: MealRecipe;
};

export default function RecipeDetailScreen({
  mealType,
  onBack,
  onStartCooking,
  recipe,
}: Props) {
  const { t } = useI18n();
  const recipeDetails = resolveMealRecipe(recipe, t);

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <BackButton onPress={onBack} />
          <Text style={styles.eyebrow}>{getMealTypeLabel(t, mealType)}</Text>
          <View style={styles.headerSpacer} />
        </View>

        <Text style={styles.title}>{recipeDetails.name}</Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Feather name="clock" size={14} color={colors.muted} />
            <Text style={styles.metaText}>
              {t("kitchen.common.minutes", { count: recipeDetails.timeMinutes })}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Feather name="users" size={14} color={colors.muted} />
            <Text style={styles.metaText}>
              {t("kitchen.common.servings", { count: recipeDetails.servings })}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Feather name="zap" size={14} color={colors.muted} />
            <Text style={styles.metaText}>
              {t("kitchen.common.calories", { count: recipeDetails.calories })}
            </Text>
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

      <View style={styles.footer}>
        <Button
          title={t("kitchen.plan.startCooking")}
          onPress={onStartCooking}
          leftIcon={<Feather name="play" size={16} color={colors.background} />}
          style={styles.startButton}
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
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  eyebrow: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    color: colors.muted,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  headerSpacer: {
    width: 36,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 30,
    lineHeight: 34,
    color: colors.text,
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
  sectionTitle: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    color: colors.muted,
    letterSpacing: 1,
    marginBottom: 12,
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
  stepsList: {
    gap: 14,
  },
  stepRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
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
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  startButton: {
    marginTop: 0,
    backgroundColor: colors.text,
  },
});
