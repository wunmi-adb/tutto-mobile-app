import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { Feather } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text } from "react-native";

type Props = {
  label: string;
  selected?: boolean;
  onPress: () => void;
};

export default function Chip({ label, selected = false, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      {selected && (
        <Feather name="check" size={14} color={colors.background} style={styles.check} />
      )}
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.secondary,
  },
  chipSelected: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  check: {
    marginRight: 6,
  },
  label: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.text,
  },
  labelSelected: {
    color: colors.background,
  },
});
