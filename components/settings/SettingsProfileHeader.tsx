import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { Feather } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  name: string;
  email: string;
  onBack: () => void;
};

export default function SettingsProfileHeader({ name, email, onBack }: Props) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <View>
      <Pressable style={styles.backButton} onPress={onBack}>
        <Feather name="arrow-left" size={16} color={colors.text} />
      </Pressable>

      <View style={styles.profileRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials || "TT"}</Text>
        </View>
        <View style={styles.textWrap}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.text,
  },
  avatarText: {
    fontFamily: fonts.sansBold,
    fontSize: 20,
    color: colors.background,
  },
  textWrap: {
    flex: 1,
  },
  name: {
    fontFamily: fonts.sansMedium,
    fontSize: 18,
    color: colors.text,
  },
  email: {
    marginTop: 3,
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
  },
});

