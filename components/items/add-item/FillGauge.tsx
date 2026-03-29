import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FILL_OPTIONS, FillLevel } from "./types";

type Props = {
  level: FillLevel;
  onChange: (l: FillLevel) => void;
};


export default function FillGauge({ level, onChange }: Props) {
  const current = FILL_OPTIONS.find((o) => o.key === level)!;

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${current.percent}%` }]} />
      </View>
      <View style={styles.pills}>
        {FILL_OPTIONS.map((opt) => {
          const selected = opt.key === level;
          return (
            <TouchableOpacity
              key={opt.key}
              style={[styles.pill, selected && styles.pillSelected]}
              activeOpacity={0.7}
              onPress={() => onChange(opt.key)}
            >
              <Text style={[styles.pillText, selected && styles.pillTextSelected]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10 },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    overflow: "hidden",
  },
  fill: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  pills: {
    flexDirection: "row",
    gap: 6,
  },
  pill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  pillSelected: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  pillText: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    lineHeight: 16,
    color: colors.muted,
    textAlign: "center",
    textAlignVertical: "center",
    includeFontPadding: false,
  },
  pillTextSelected: {
    color: colors.background,
  },
});
