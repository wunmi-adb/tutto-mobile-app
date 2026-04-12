import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { Feather } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  DashboardMeal,
  getMealAvailabilityPercent,
  getMealReadiness,
  type MealSection,
} from "./data";

function HomeMealCard({
  meal,
  onPress,
}: {
  meal: DashboardMeal;
  onPress: () => void;
}) {
  const readiness = getMealReadiness(meal);
  const availabilityPercent = getMealAvailabilityPercent(meal);
  const isSnack = meal.mealTime === "snack";

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.82} onPress={onPress}>
      <Text style={styles.cardTitle}>{meal.name}</Text>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Feather name="clock" size={11} color={colors.muted} />
          <Text style={styles.metaText}>{meal.time}</Text>
        </View>
        <View style={styles.metaItem}>
          <Feather name="zap" size={11} color={colors.muted} />
          <Text style={styles.metaText}>{meal.calories} cal</Text>
        </View>
        <View style={styles.metaItem}>
          <Feather name="users" size={11} color={colors.muted} />
          <Text style={styles.metaText}>{meal.servings}</Text>
        </View>
      </View>

      {isSnack ? (
        <View style={[styles.badge, { backgroundColor: readiness.backgroundColor }]}>
          <View style={[styles.badgeDot, { backgroundColor: readiness.dotColor }]} />
          <Text style={[styles.badgeText, { color: readiness.accentColor }]}>{readiness.label}</Text>
        </View>
      ) : (
        <View style={styles.progressWrap}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressCopy}>
              {meal.availableIngredients} of {meal.ingredients.length} ingredients
            </Text>
            <Text style={[styles.progressStatus, { color: readiness.accentColor }]}>
              {readiness.label}
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${availabilityPercent}%`,
                  backgroundColor: readiness.accentColor,
                },
              ]}
            />
          </View>
        </View>
      )}

      <View style={styles.macroRow}>
        <View style={styles.macroPill}>
          <Text style={styles.macroPillText}>P: {meal.protein}</Text>
        </View>
        <View style={styles.macroPill}>
          <Text style={styles.macroPillText}>C: {meal.carbs}</Text>
        </View>
        <View style={styles.macroPill}>
          <Text style={styles.macroPillText}>F: {meal.fat}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeMealSection({
  section,
  actionLabel,
  onPressAction,
  onSelectMeal,
}: {
  section: MealSection;
  actionLabel?: string;
  onPressAction?: () => void;
  onSelectMeal: (meal: DashboardMeal) => void;
}) {
  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{section.label.toUpperCase()}</Text>
        {actionLabel && onPressAction ? (
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.75} onPress={onPressAction}>
            <Text style={styles.actionLabel}>{actionLabel}</Text>
            <Feather name="arrow-right" size={12} color={colors.brand} />
          </TouchableOpacity>
        ) : null}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.rail}
      >
        {section.meals.map((meal) => (
          <HomeMealCard key={meal.id} meal={meal} onPress={() => onSelectMeal(meal)} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    letterSpacing: 1,
    color: colors.muted,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.brand,
  },
  rail: {
    gap: 12,
    paddingRight: 24,
  },
  card: {
    width: 280,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  cardTitle: {
    fontFamily: fonts.serif,
    fontSize: 18,
    lineHeight: 22,
    color: colors.text,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.muted,
  },
  progressWrap: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 6,
  },
  progressCopy: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.muted,
  },
  progressStatus: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    textAlign: "right",
  },
  progressTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: colors.secondary,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
  },
  badge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginBottom: 12,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
  },
  macroRow: {
    flexDirection: "row",
    gap: 6,
  },
  macroPill: {
    borderRadius: 999,
    backgroundColor: colors.secondary,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  macroPillText: {
    fontFamily: fonts.sansMedium,
    fontSize: 10,
    color: colors.muted,
  },
});
