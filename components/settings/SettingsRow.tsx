import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { Feather } from "@expo/vector-icons";
import { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  icon: ReactNode;
  label: string;
  value?: string;
  onPress: () => void;
  danger?: boolean;
  showDivider?: boolean;
};

export default function SettingsRow({
  icon,
  label,
  value,
  onPress,
  danger = false,
  showDivider = true,
}: Props) {
  return (
    <Pressable style={[styles.row, !showDivider && styles.rowNoDivider]} onPress={onPress}>
      <View style={styles.rowLeft}>
        <View style={styles.iconWrap}>{icon}</View>
        <View style={styles.textWrap}>
          <Text style={[styles.label, danger && styles.labelDanger]}>{label}</Text>
          {value ? <Text style={styles.value}>{value}</Text> : null}
        </View>
      </View>
      <Feather name="chevron-right" size={18} color={danger ? colors.danger : colors.muted} />
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
  rowLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconWrap: {
    width: 22,
    alignItems: "center",
  },
  textWrap: {
    flex: 1,
  },
  label: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.text,
  },
  labelDanger: {
    color: colors.danger,
  },
  value: {
    marginTop: 3,
    fontFamily: fonts.sans,
    fontSize: 13,
    lineHeight: 18,
    color: colors.muted,
  },
});
