import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { Feather } from "@expo/vector-icons";
import { useRef } from "react";
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
  const scale = useRef(new Animated.Value(1)).current;

  function handlePressIn() {
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 40, bounciness: 2 }).start();
  }

  function handlePressOut() {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 2 }).start();
  }

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={styles.card}
        activeOpacity={1}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
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
            <Text style={styles.metaText}>{meal.servings} serv</Text>
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
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{meal.protein}</Text>
            <Text style={styles.macroLabel}>protein</Text>
          </View>
          <View style={styles.macroDivider} />
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{meal.carbs}</Text>
            <Text style={styles.macroLabel}>carbs</Text>
          </View>
          <View style={styles.macroDivider} />
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{meal.fat}</Text>
            <Text style={styles.macroLabel}>fat</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
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
        <Text style={styles.sectionTitle}>{section.label}</Text>
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
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: fonts.serifItalic,
    fontSize: 17,
    letterSpacing: -0.2,
    color: colors.text,
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
    width: 272,
    borderRadius: 20,
    backgroundColor: colors.secondary,
    paddingHorizontal: 18,
    paddingVertical: 16,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 2,
  },
  cardTitle: {
    fontFamily: fonts.serif,
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: -0.2,
    color: colors.text,
    marginBottom: 10,
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
    marginBottom: 14,
  },
  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 7,
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
    height: 4,
    borderRadius: 999,
    backgroundColor: `${colors.text}18`,
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
    paddingVertical: 6,
    marginBottom: 14,
  },
  badgeDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  badgeText: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
  },
  macroRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  macroItem: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  macroDivider: {
    width: 1,
    height: 24,
    backgroundColor: `${colors.text}18`,
  },
  macroValue: {
    fontFamily: fonts.sansBold,
    fontSize: 13,
    color: colors.text,
  },
  macroLabel: {
    fontFamily: fonts.sans,
    fontSize: 9,
    color: colors.muted,
    letterSpacing: 0.2,
  },
});
