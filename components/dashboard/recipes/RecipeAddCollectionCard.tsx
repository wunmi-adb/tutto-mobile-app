import HapticPressable from "@/components/ui/HapticPressable";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text } from "react-native";

type Props = {
  onPress: () => void;
  label: string;
};

export default function RecipeAddCollectionCard({ onPress, label }: Props) {
  return (
    <HapticPressable
      style={styles.card}
      onPress={onPress}
      hapticType="medium"
      pressedOpacity={1}
    >
      <Feather name="plus" size={24} color={colors.muted} />
      <Text style={styles.label}>{label}</Text>
    </HapticPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    minHeight: 188,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: colors.background,
  },
  label: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.muted,
  },
});
