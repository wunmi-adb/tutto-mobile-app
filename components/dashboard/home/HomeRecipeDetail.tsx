import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { Feather } from "@expo/vector-icons";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { DashboardMeal } from "./data";

export default function HomeRecipeDetail({
  meal,
  onClose,
}: {
  meal: DashboardMeal | null;
  onClose: () => void;
}) {
  if (!meal) {
    return null;
  }

  return (
    <Modal animationType="slide" presentationStyle="pageSheet" visible onRequestClose={onClose}>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} activeOpacity={0.75} onPress={onClose}>
              <Feather name="arrow-left" size={16} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.mealType}>{meal.mealTime.toUpperCase()}</Text>
            <View style={styles.headerSpacer} />
          </View>

          <Text style={styles.title}>{meal.name}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Feather name="clock" size={14} color={colors.muted} />
              <Text style={styles.metaText}>{meal.time}</Text>
            </View>
            <View style={styles.metaItem}>
              <Feather name="users" size={14} color={colors.muted} />
              <Text style={styles.metaText}>{meal.servings} servings</Text>
            </View>
            <View style={styles.metaItem}>
              <Feather name="zap" size={14} color={colors.muted} />
              <Text style={styles.metaText}>{meal.calories} cal</Text>
            </View>
          </View>

          <View style={styles.macroRow}>
            <View style={styles.macroCard}>
              <Text style={styles.macroValue}>{meal.protein}</Text>
              <Text style={styles.macroLabel}>PROTEIN</Text>
            </View>
            <View style={styles.macroCard}>
              <Text style={styles.macroValue}>{meal.carbs}</Text>
              <Text style={styles.macroLabel}>CARBS</Text>
            </View>
            <View style={styles.macroCard}>
              <Text style={styles.macroValue}>{meal.fat}</Text>
              <Text style={styles.macroLabel}>FAT</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>INGREDIENTS</Text>
          {meal.ingredients.map((ingredient) => (
            <View key={ingredient} style={styles.ingredientRow}>
              <View style={styles.ingredientDot} />
              <Text style={styles.ingredientText}>{ingredient}</Text>
            </View>
          ))}

          <Text style={[styles.sectionTitle, styles.instructionsTitle]}>INSTRUCTIONS</Text>
          {meal.steps.map((step, index) => (
            <View key={`${meal.id}-step-${index + 1}`} style={styles.stepRow}>
              <View style={styles.stepCount}>
                <Text style={styles.stepCountText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  headerSpacer: {
    width: 36,
    height: 36,
  },
  mealType: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    letterSpacing: 1,
    color: colors.muted,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 28,
    lineHeight: 32,
    color: colors.text,
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
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
  macroRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 28,
  },
  macroCard: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: colors.secondary,
    padding: 12,
    alignItems: "center",
  },
  macroValue: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.text,
  },
  macroLabel: {
    marginTop: 2,
    fontFamily: fonts.sans,
    fontSize: 10,
    letterSpacing: 0.8,
    color: colors.muted,
  },
  sectionTitle: {
    marginBottom: 12,
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    letterSpacing: 1,
    color: colors.muted,
  },
  instructionsTitle: {
    marginTop: 24,
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  ingredientDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: `${colors.text}4d`,
  },
  ingredientText: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.text,
  },
  stepRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  stepCount: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.text,
    marginTop: 2,
  },
  stepCountText: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.background,
  },
  stepText: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 21,
    color: colors.text,
  },
});
