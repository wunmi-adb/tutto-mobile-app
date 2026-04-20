import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { StyleSheet, Text, View } from "react-native";
import { getGreeting, getSubtitle } from "./data";

function formatDate(date = new Date()) {
  return date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
}

export default function HomeDashboardHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.date}>{formatDate()}</Text>
      <Text style={styles.title}>{getGreeting()}</Text>
      <Text style={styles.subtitle}>{getSubtitle()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 2,
  },
  date: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    letterSpacing: 0.4,
    color: colors.muted,
    marginBottom: 6,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 38,
    lineHeight: 42,
    letterSpacing: -0.5,
    color: colors.text,
  },
  subtitle: {
    marginTop: 4,
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted,
  },
});
