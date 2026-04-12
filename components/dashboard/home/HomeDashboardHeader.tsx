import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { StyleSheet, Text, View } from "react-native";
import { getGreeting, getSubtitle } from "./data";

export default function HomeDashboardHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.copy}>
        <Text style={styles.title}>{getGreeting()} 👋</Text>
        <Text style={styles.subtitle}>{getSubtitle()}</Text>
      </View>
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
});
