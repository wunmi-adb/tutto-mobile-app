import HapticPressable from "@/components/ui/HapticPressable";
import SegmentedTabs from "@/components/ui/SegmentedTabs";
import { fonts } from "@/constants/fonts";
import { useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MEAL_TIME_FILTERS, SEGMENTS } from "./plan-data";
import { planTheme } from "./plan-theme";
import type { MealTime, SuggestionType } from "./types";

type Props = {
  mealTimeFilter: MealTime | null;
  onMealTimeChange: (value: MealTime | null) => void;
  onTypeChange: (value: SuggestionType | null) => void;
  typeFilter: SuggestionType | null;
};

export default function PlanFilterControls({
  mealTimeFilter,
  onMealTimeChange,
  onTypeChange,
  typeFilter,
}: Props) {
  const activeSegment = typeFilter ?? "all";

  return (
    <View style={styles.container}>
      <SegmentedControl activeValue={activeSegment} onChange={onTypeChange} />

      {typeFilter === "meal" ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {MEAL_TIME_FILTERS.map((item) => (
            <FilterChip
              key={item.label}
              active={mealTimeFilter === item.value}
              label={item.label}
              onPress={() => onMealTimeChange(item.value)}
            />
          ))}
        </ScrollView>
      ) : null}
    </View>
  );
}

function SegmentedControl({
  activeValue,
  onChange,
}: {
  activeValue: "all" | SuggestionType;
  onChange: (value: SuggestionType | null) => void;
}) {
  const options = useMemo(
    () =>
      SEGMENTS.map((item) => ({
        value: item.value,
        label: item.label,
      })),
    [],
  );

  return (
    <SegmentedTabs
      options={options}
      value={activeValue}
      onChange={(nextValue) => onChange(nextValue === "all" ? null : nextValue)}
      backgroundColor={planTheme.muted}
      activeBackgroundColor={planTheme.card}
      inactiveTextColor={planTheme.mutedForeground}
      activeTextColor={planTheme.foreground}
      containerStyle={styles.segmentedControl}
      tabStyle={styles.segmentButton}
      indicatorStyle={styles.segmentIndicator}
      pressedOpacity={0.9}
    />
  );
}

function FilterChip({
  active,
  label,
  onPress,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <HapticPressable
      style={[styles.chip, active ? styles.chipActive : styles.chipInactive]}
      pressedOpacity={0.92}
      onPress={onPress}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </HapticPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  segmentedControl: {
    borderRadius: 12,
  },
  segmentIndicator: {
    borderRadius: 10,
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.06)",
  },
  segmentButton: {
    minHeight: 36,
    borderRadius: 10,
  },
  chipRow: {
    gap: 8,
    paddingRight: 20,
  },
  chip: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  chipActive: {
    backgroundColor: planTheme.foreground,
  },
  chipInactive: {
    backgroundColor: planTheme.muted,
  },
  chipText: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: planTheme.mutedForeground,
  },
  chipTextActive: {
    color: planTheme.background,
  },
});
