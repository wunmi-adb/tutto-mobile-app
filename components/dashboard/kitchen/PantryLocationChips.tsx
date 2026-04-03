import HapticPressable from "@/components/ui/HapticPressable";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { ScrollView, StyleSheet, Text } from "react-native";
import type { PantryLocationFilter } from "./types";

type Props = {
  locations: PantryLocationFilter[];
  selectedKey: string;
  onSelect: (key: string) => void;
};

export default function PantryLocationChips({ locations, selectedKey, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {locations.map((location) => {
        const active = location.key === selectedKey;

        return (
          <HapticPressable
            key={location.key}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onSelect(location.key)}
            hapticType="selection"
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>
              {location.label}
            </Text>
          </HapticPressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 8,
    paddingBottom: 18,
  },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.background,
  },
  chipActive: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  chipText: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.muted,
  },
  chipTextActive: {
    color: colors.background,
  },
});
