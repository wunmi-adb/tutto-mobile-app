import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { ReactNode } from "react";
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, View } from "react-native";

type Props = TouchableOpacityProps & {
  title: string;
  variant?: "primary" | "secondary";
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

export default function Button({ title, disabled, style, variant = "primary", leftIcon, rightIcon, ...props }: Props) {
  const isSecondary = variant === "secondary";
  return (
    <TouchableOpacity
      style={[styles.btn, isSecondary && styles.btnSecondary, disabled && styles.disabled, style]}
      disabled={disabled}
      activeOpacity={0.85}
      {...props}
    >
      {leftIcon && <View>{leftIcon}</View>}
      <Text style={[styles.text, isSecondary && styles.textSecondary]}>{title}</Text>
      {rightIcon && <View>{rightIcon}</View>}
    </TouchableOpacity>
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
  text: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    letterSpacing: 0.3,
    color: colors.background,
  },
  textSecondary: {
    color: colors.text,
  },
});
