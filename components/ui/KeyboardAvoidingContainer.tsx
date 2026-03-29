import { PropsWithChildren } from "react";
import { KeyboardAvoidingView, Platform, StyleProp, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  extraOffset?: boolean;
}>;

export default function KeyboardAvoidingContainer({
  children,
  style,
  extraOffset = false,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      style={style}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={extraOffset ? insets.top / 4 : 0}
    >
      {children}
    </KeyboardAvoidingView>
  );
}
