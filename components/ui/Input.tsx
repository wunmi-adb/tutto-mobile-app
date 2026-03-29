import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useRef } from "react";
import { Animated, StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from "react-native";

type Props = TextInputProps & {
  label?: string;
  variant?: "default" | "code";
  containerStyle?: ViewStyle;
};

export default function Input({ label, variant = "default", containerStyle, style, onFocus, onBlur, ...props }: Props) {
  const focusAnim = useRef(new Animated.Value(0)).current;

  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.muted],
  });

  const handleFocus = (e: Parameters<NonNullable<TextInputProps["onFocus"]>>[0]) => {
    focusAnim.stopAnimation();
    Animated.timing(focusAnim, { toValue: 1, duration: 150, useNativeDriver: false }).start();
    onFocus?.(e);
  };

  const handleBlur = (e: Parameters<NonNullable<TextInputProps["onBlur"]>>[0]) => {
    focusAnim.stopAnimation();
    Animated.timing(focusAnim, { toValue: 0, duration: 150, useNativeDriver: false }).start();
    onBlur?.(e);
  };

  return (
    <View style={containerStyle}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Animated.View style={[styles.inputWrapper, { borderColor }]}>
        <TextInput
          {...props}
          style={[styles.input, variant === "code" && styles.inputCode, style]}
          placeholderTextColor={colors.muted + "80"}
          selectionColor={colors.text}
          cursorColor={colors.text}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    letterSpacing: 0.5,
    color: colors.muted,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  inputWrapper: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  input: {
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.text,
    padding: 0,
  },
  inputCode: {
    textAlign: "center",
  },
});
