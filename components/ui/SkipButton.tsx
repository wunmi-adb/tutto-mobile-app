import HapticPressable from "@/components/ui/HapticPressable";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { PressableProps, StyleProp, StyleSheet, Text, TextStyle, ViewStyle } from "react-native";

type SkipButtonProps = Omit<PressableProps, "children" | "style"> & {
  label: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export default function SkipButton({ label, style, textStyle, ...props }: SkipButtonProps) {
  return (
    <HapticPressable
      {...props}
      style={style}
      pressedOpacity={0.7}
      hapticType="selection"
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={[styles.label, textStyle]}>{label}</Text>
    </HapticPressable>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.muted,
  },
});
