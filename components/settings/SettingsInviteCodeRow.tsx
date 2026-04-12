import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import { Feather } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  code: string;
  onPress: () => void;
  disabled?: boolean;
  showDivider?: boolean;
};

export default function SettingsInviteCodeRow({
  code,
  onPress,
  disabled = false,
  showDivider = true,
}: Props) {
  const { t } = useI18n();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.row,
        !showDivider && styles.rowNoDivider,
        pressed && !disabled && styles.rowPressed,
        disabled && styles.rowDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.left}>
        <Feather name="user-plus" size={18} color={colors.muted} />
        <Text style={styles.label}>{t("settings.inviteCode.label")}</Text>
      </View>

      <View style={styles.codeButton}>
        <Text style={styles.code}>{code}</Text>
        <Feather name="share-2" size={14} color={colors.muted} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 12,
  },
  rowNoDivider: {
    borderBottomWidth: 0,
  },
  rowPressed: {
    opacity: 0.8,
  },
  rowDisabled: {
    opacity: 0.5,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  label: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.text,
  },
  codeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  code: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    letterSpacing: 0.8,
    color: colors.muted,
  },
});
