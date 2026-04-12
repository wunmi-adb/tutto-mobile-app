import BackButton from "@/components/ui/BackButton";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  name: string;
  email: string;
  onBack: () => void;
  showBackButton?: boolean;
};

export default function SettingsProfileHeader({
  name,
  email,
  onBack,
  showBackButton = true,
}: Props) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <View>
      {showBackButton ? <BackButton style={styles.backButton} onPress={onBack} /> : null}

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
