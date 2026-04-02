import HapticPressable, { HapticFeedbackType } from "@/components/ui/HapticPressable";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { ReactNode, useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

type Props = Omit<PressableProps, "children" | "style"> & {
  title: string;
  variant?: "primary" | "secondary";
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  style?: StyleProp<ViewStyle>;
  hapticType?: HapticFeedbackType;
  loading?: boolean;
};

function ButtonSpinner({ color }: { color: string }) {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 320,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    animation.start();

    return () => {
      animation.stop();
      rotation.setValue(0);
    };
  }, [rotation]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View
      style={[
        styles.spinner,
        {
          borderColor: color,
          borderRightColor: "transparent",
          transform: [{ rotate: spin }],
        },
      ]}
    />
  );
}

export default function Button({
  title,
  disabled,
  style,
  variant = "primary",
  leftIcon,
  rightIcon,
  hapticType,
  loading = false,
  ...props
}: Props) {
  const isSecondary = variant === "secondary";
  const textColor = isSecondary ? colors.text : colors.background;
  const isDisabled = disabled || loading;

  return (
    <HapticPressable
      style={[
        styles.btn,
        isSecondary && styles.btnSecondary,
        loading && styles.loading,
        disabled && !loading && styles.disabled,
        style,
      ]}
      disabled={isDisabled}
      pressedOpacity={0.85}
      hapticType={hapticType ?? (isSecondary ? "selection" : "medium")}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      {...props}
    >
      {loading ? <ButtonSpinner color={textColor} /> : leftIcon ? <View>{leftIcon}</View> : null}
      <Text style={[styles.text, isSecondary && styles.textSecondary]}>{title}</Text>
      {!loading && rightIcon ? <View>{rightIcon}</View> : null}
    </HapticPressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.brand,
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 24,
  },
  btnSecondary: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.border,
  },
  disabled: {
    opacity: 0.3,
  },
  loading: {
    opacity: 0.58,
  },
  text: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    letterSpacing: 0.3,
    color: colors.background,
  },
  textSecondary: {
    color: colors.text,
  },
  spinner: {
    width: 16,
    height: 16,
    borderRadius: 999,
    borderWidth: 2,
  },
});
