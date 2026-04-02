import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
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
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignItems: "center",
    justifyContent: "center",
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
  label: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.text,
  },
  labelSelected: {
    color: colors.background,
  },
});
