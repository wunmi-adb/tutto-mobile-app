import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { Feather } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  code: string;
  copied: boolean;
  onCopy: () => void;
};

export default function SettingsInviteCodeRow({ code, copied, onCopy }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <Feather name="users" size={18} color={colors.muted} />
        <Text style={styles.label}>Invite code</Text>
      </View>

      <Pressable style={styles.codeButton} onPress={onCopy}>
        <Text style={styles.code}>{copied ? "Copied" : code}</Text>
        <Feather name="copy" size={14} color={copied ? colors.brand : colors.muted} />
      </Pressable>
    </View>
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

