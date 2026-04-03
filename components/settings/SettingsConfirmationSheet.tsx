import Button from "@/components/ui/Button";
import BottomSheet from "@/components/ui/BottomSheet";
import Input from "@/components/ui/Input";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { StyleSheet, Text } from "react-native";

type Props = {
  visible: boolean;
  title: string;
  subtitle: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmDisabled?: boolean;
  destructive?: boolean;
  confirmLoading?: boolean;
  inputLabel?: string;
  inputPlaceholder?: string;
  inputValue?: string;
  onChangeInput?: (value: string) => void;
};

export default function SettingsConfirmationSheet({
  visible,
  title,
  subtitle,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  confirmDisabled = false,
  destructive = false,
  confirmLoading = false,
  inputLabel,
  inputPlaceholder,
  inputValue,
  onChangeInput,
}: Props) {
  return (
    <BottomSheet
      visible={visible}
      onClose={onCancel}
      contentStyle={styles.sheet}
      keyboardAvoiding={!!inputLabel}
    >
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      {inputLabel && onChangeInput ? (
        <Input
          label={inputLabel}
          value={inputValue ?? ""}
          onChangeText={onChangeInput}
          placeholder={inputPlaceholder ?? ""}
          autoCapitalize="none"
          keyboardType="email-address"
          containerStyle={styles.inputWrap}
        />
      ) : null}

      <Button
        title={confirmLabel}
        variant={destructive ? "danger" : "primary"}
        onPress={onConfirm}
        disabled={confirmDisabled}
        loading={confirmLoading}
        style={styles.primaryAction}
      />
      <Button
        title={cancelLabel}
        variant="soft"
        onPress={onCancel}
        style={styles.secondaryAction}
      />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheet: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  title: {
    fontFamily: fonts.sansMedium,
    fontSize: 18,
    color: colors.text,
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 21,
    color: colors.muted,
    textAlign: "center",
  },
  inputWrap: {
    marginTop: 20,
  },
  primaryAction: {
    width: "100%",
    marginTop: 20,
  },
  secondaryAction: {
    width: "100%",
    marginTop: 12,
  },
});
