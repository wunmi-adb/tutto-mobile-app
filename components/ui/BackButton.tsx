import HapticPressable, { HapticFeedbackType } from "@/components/ui/HapticPressable";
import { colors } from "@/constants/colors";
import { Feather } from "@expo/vector-icons";
import { PressableProps, StyleProp, StyleSheet, ViewStyle } from "react-native";

type BackButtonProps = Omit<PressableProps, "style"> & {
  style?: StyleProp<ViewStyle>;
  hapticType?: HapticFeedbackType;
  hapticsDisabled?: boolean;
};

export default function BackButton({ style, hapticType = "selection", hapticsDisabled, ...props }: BackButtonProps) {
  return (
    <HapticPressable
      style={[styles.button, style]}
      pressedOpacity={0.7}
      hapticType={hapticType}
      hapticsDisabled={hapticsDisabled}
      accessibilityRole="button"
      accessibilityLabel="Go back"
      hitSlop={8}
      {...props}
    >
      <Feather name="arrow-left" size={16} color={colors.text} />
    </HapticPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
});
