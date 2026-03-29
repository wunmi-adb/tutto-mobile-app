import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  label: string;
  sublabel?: string;
  selected: boolean;
  onPress: () => void;
  variant?: "checkbox" | "radio";
  dashed?: boolean;
};

export default function SelectableRow({
  label,
  sublabel,
  selected,
  onPress,
  variant = "checkbox",
  dashed = false,
}: Props) {
  return (
    <TouchableOpacity
      style={[styles.row, selected && styles.rowActive, dashed && !selected && styles.rowDashed]}
      onPress={onPress}
      activeOpacity={0.97}
    >
      <View>
        <Text style={styles.label}>{label}</Text>
        {sublabel && <Text style={styles.sublabel}>{sublabel}</Text>}
      </View>
      {variant === "checkbox" ? (
        <View style={[styles.checkbox, selected && styles.indicatorActive]}>
          {selected && <Feather name="check" size={14} color={colors.background} />}
        </View>
      ) : (
        <View style={[styles.radio, selected && styles.indicatorActive]}>
          {selected && <View style={styles.radioDot} />}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowActive: {
    borderColor: colors.text,
    backgroundColor: colors.text + "08",
  },
  rowDashed: {
    borderStyle: "dashed",
  },
  label: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.text,
    marginBottom: 2,
  },
  sublabel: {
    fontFamily: fonts.sans,
    fontSize: 12,
    letterSpacing: 0.3,
    color: colors.muted,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  indicatorActive: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.background,
  },
});
