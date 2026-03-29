import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function SettingsSubscriptionCard() {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Tutto Family</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Active</Text>
        </View>
      </View>

      <Pressable>
        <Text style={styles.link}>Manage subscription</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 28,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderRadius: 20,
    backgroundColor: "#01838C",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
    gap: 12,
  },
  title: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.background,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  badgeText: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.background,
  },
  link: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: "rgba(255,255,255,0.78)",
  },
});

