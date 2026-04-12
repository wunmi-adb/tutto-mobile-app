import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getGreeting, getSubtitle } from "./data";

export default function HomeDashboardHeader() {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <View style={styles.copy}>
        <Text style={styles.title}>{getGreeting()} 👋</Text>
        <Text style={styles.subtitle}>{getSubtitle()}</Text>
      </View>

      <TouchableOpacity
        style={styles.iconButton}
        activeOpacity={0.75}
        onPress={() => router.push("/settings")}
      >
        <Feather name="settings" size={16} color={colors.muted} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
  },
  copy: {
    flex: 1,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 32,
    lineHeight: 36,
    color: colors.text,
  },
  subtitle: {
    marginTop: 4,
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
});
