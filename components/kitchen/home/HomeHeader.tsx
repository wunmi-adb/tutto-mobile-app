import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getGreeting } from "./data";

export default function HomeHeader() {
  const router = useRouter();

  return (
    <View style={styles.pageHeader}>
      <View>
        <Text style={styles.greeting}>{getGreeting()} 👋</Text>
        <Text style={styles.greetingSubtitle}>{"Here's your kitchen at a glance"}</Text>
      </View>
      <TouchableOpacity
        style={styles.iconBtn}
        activeOpacity={0.7}
        onPress={() => router.push("/settings")}
      >
        <Feather name="settings" size={16} color={colors.muted} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  pageHeader: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 },
  greeting: { fontFamily: fonts.serif, fontSize: 32, lineHeight: 36, color: colors.text },
  greetingSubtitle: { fontFamily: fonts.sans, fontSize: 13, color: colors.muted, marginTop: 4 },
  iconBtn: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center", marginTop: 4 },
});
