import HapticPressable from "@/components/ui/HapticPressable";
import { fonts } from "@/constants/fonts";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import {
  getMealStatusLabel,
  getProgressPercent,
} from "./plan-data";
import { planTheme } from "./plan-theme";
import type { Suggestion } from "./types";

type Props = {
  onPress: () => void;
  suggestion: Suggestion;
};

export default function PlanSuggestionCard({ onPress, suggestion }: Props) {
  const percent = getProgressPercent(suggestion);
  const isSnack = suggestion.type === "snack";
  const stateTextColor =
    percent >= 75 ? planTheme.success : percent >= 50 ? planTheme.warning : planTheme.mutedForeground;
  const stateFillColor =
    percent >= 75 ? planTheme.success : percent >= 50 ? planTheme.warning : planTheme.mutedForeground;

  return (
    <HapticPressable style={styles.card} pressedOpacity={0.96} hapticType="light" onPress={onPress}>
      <View style={styles.headerRow}>
        <View style={styles.copyBlock}>
          <View style={styles.titleWrap}>
            <Text
              accessible={false}
              importantForAccessibility="no"
              style={[styles.title, styles.titleUnderlay]}
            >
              {suggestion.name}
            </Text>
            <Text style={styles.title}>{suggestion.name}</Text>
          </View>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Feather name="clock" size={12} color={planTheme.mutedForeground} />
              <Text style={styles.metaText}>{suggestion.time}</Text>
            </View>
            <View style={styles.metaItem}>
              <Feather name="users" size={12} color={planTheme.mutedForeground} />
              <Text style={styles.metaText}>{suggestion.servings}</Text>
            </View>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="fire" size={12} color={planTheme.mutedForeground} />
              <Text style={styles.metaText}>{suggestion.calories} cal</Text>
            </View>
          </View>
        </View>

        <Feather
          name="chevron-right"
          size={16}
          color={planTheme.mutedForeground}
          style={styles.chevron}
        />
      </View>

      {isSnack ? (
        <View style={styles.badgeRow}>
          <View
            style={[
              styles.badge,
              suggestion.inPantry ? styles.badgeSuccess : styles.badgeWarning,
            ]}
          >
            <View
              style={[
                styles.badgeDot,
                suggestion.inPantry ? styles.badgeDotSuccess : styles.badgeDotWarning,
              ]}
            />
            <Text
              style={[
                styles.badgeText,
                suggestion.inPantry ? styles.badgeTextSuccess : styles.badgeTextWarning,
              ]}
            >
              {suggestion.inPantry ? "Ready to eat · In your kitchen" : "Need to buy"}
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressCaption}>
              {suggestion.available} of {suggestion.total} ingredients
            </Text>
            <Text style={[styles.progressStatus, { color: stateTextColor }]}>
              {getMealStatusLabel(suggestion)}
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${percent}%`, backgroundColor: stateFillColor }]} />
          </View>
        </View>
      )}
    </HapticPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: planTheme.border,
    backgroundColor: planTheme.card,
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  copyBlock: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 15,
    lineHeight: 20,
    color: planTheme.foreground,
  },
  titleWrap: {
    position: "relative",
    alignSelf: "stretch",
  },
  titleUnderlay: {
    position: "absolute",
    top: 0,
    left: 0.35,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 12,
    marginTop: 6,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: planTheme.mutedForeground,
  },
  chevron: {
    marginTop: 4,
    flexShrink: 0,
  },
  badgeRow: {
    marginTop: 12,
  },
  badge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeSuccess: {
    backgroundColor: planTheme.successBackground,
  },
  badgeWarning: {
    backgroundColor: planTheme.warningBackground,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
  },
  badgeDotSuccess: {
    backgroundColor: "#22c55e",
  },
  badgeDotWarning: {
    backgroundColor: planTheme.warning,
  },
  badgeText: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
  },
  badgeTextSuccess: {
    color: "#15803d",
  },
  badgeTextWarning: {
    color: "#b45309",
  },
  progressSection: {
    marginTop: 12,
    gap: 6,
  },
  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  progressCaption: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: planTheme.mutedForeground,
  },
  progressStatus: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
  },
  progressTrack: {
    width: "100%",
    height: 6,
    borderRadius: 999,
    backgroundColor: planTheme.muted,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
  },
});
