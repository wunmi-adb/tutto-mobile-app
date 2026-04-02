import * as Haptics from "expo-haptics";
import { ReactNode } from "react";
import {
  GestureResponderEvent,
  Platform,
  Pressable,
  PressableProps,
  StyleProp,
  ViewStyle,
} from "react-native";

export type HapticFeedbackType = "selection" | "light" | "medium" | "heavy";

type HapticPressableProps = Omit<PressableProps, "children" | "style"> & {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  pressedOpacity?: number;
  pressedStyle?: StyleProp<ViewStyle>;
  hapticType?: HapticFeedbackType;
  hapticsDisabled?: boolean;
};

async function triggerHapticAsync(type: HapticFeedbackType) {
  if (Platform.OS === "web") {
    return;
  }

  try {
    switch (type) {
      case "light":
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        return;
      case "medium":
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        return;
      case "heavy":
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        return;
      case "selection":
      default:
        await Haptics.selectionAsync();
    }
  } catch {
    // Ignore unsupported haptics errors so presses still work everywhere.
  }
}

export default function HapticPressable({
  children,
  style,
  onPress,
  disabled,
  pressedOpacity = 0.7,
  pressedStyle,
  hapticType = "selection",
  hapticsDisabled = false,
  ...props
}: HapticPressableProps) {
  const handlePress = (event: GestureResponderEvent) => {
    if (!disabled && !hapticsDisabled) {
      void triggerHapticAsync(hapticType);
    }

    onPress?.(event);
  };

  return (
    <Pressable
      {...props}
      disabled={disabled}
      onPress={handlePress}
      style={({ pressed }) => [
        style,
        pressed && pressedOpacity !== 1 ? { opacity: pressedOpacity } : null,
        pressed && pressedStyle,
      ]}
    >
      {children}
    </Pressable>
  );
}
