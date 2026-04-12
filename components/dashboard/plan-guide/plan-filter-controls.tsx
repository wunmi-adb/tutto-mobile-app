import HapticPressable from "@/components/ui/HapticPressable";
import { fonts } from "@/constants/fonts";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
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
  const translateX = useRef(new Animated.Value(0)).current;
  const [containerWidth, setContainerWidth] = useState(0);
  const activeIndex = SEGMENTS.findIndex((item) => item.value === activeValue);
  const indicatorWidth = containerWidth > 0 ? (containerWidth - 8) / SEGMENTS.length : 0;

  useEffect(() => {
    if (!indicatorWidth) {
      return;
    }

    Animated.spring(translateX, {
      toValue: indicatorWidth * activeIndex,
      useNativeDriver: true,
      damping: 18,
      stiffness: 180,
      mass: 0.8,
    }).start();
  }, [activeIndex, indicatorWidth, translateX]);

  const handleLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  return (
    <View style={styles.segmentedControl} onLayout={handleLayout}>
      {indicatorWidth > 0 ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.segmentIndicator,
            {
              width: indicatorWidth,
              transform: [{ translateX }],
            },
          ]}
        />
      ) : null}

      {SEGMENTS.map((item) => {
        const active = item.value === activeValue;

        return (
          <HapticPressable
            key={item.value}
            style={styles.segmentButton}
            pressedOpacity={0.9}
            onPress={() => onChange(item.value === "all" ? null : item.value)}
          >
            <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{item.label}</Text>
          </HapticPressable>
        );
      })}
    </View>
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
    position: "relative",
    flexDirection: "row",
    borderRadius: 12,
    backgroundColor: planTheme.muted,
    padding: 4,
  },
  segmentIndicator: {
    position: "absolute",
    top: 4,
    left: 4,
    bottom: 4,
    borderRadius: 10,
    backgroundColor: planTheme.card,
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.06)",
  },
  segmentButton: {
    flex: 1,
    minHeight: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    zIndex: 1,
  },
  segmentText: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: planTheme.mutedForeground,
  },
  segmentTextActive: {
    color: planTheme.foreground,
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
