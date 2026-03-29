import MealsIllustration from "@/assets/images/icon-meals.png";
import PantryIllustration from "@/assets/images/icon-pantry.png";
import ShoppingIllustration from "@/assets/images/icon-shopping.png";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const STATS = [
  { label: "PANTRY", value: "24", tab: "pantry", image: PantryIllustration },
  { label: "MEALS", value: "7", tab: "plan", image: MealsIllustration },
  { label: "TO BUY", value: "5", tab: "shopping", image: ShoppingIllustration },
];

export default function StatsRow() {
  const router = useRouter();

  return (
    <View style={styles.statsRow}>
      {STATS.map((stat) => (
        <TouchableOpacity
          key={stat.label}
          style={styles.statCard}
          activeOpacity={0.97}
          onPress={() => router.push(`/kitchen/${stat.tab}`)}
        >
          <Image source={stat.image} style={styles.statImage} resizeMode="contain" />
          <Text style={styles.statValue}>{stat.value}</Text>
          <Text style={styles.statLabel}>{stat.label}</Text>
          <Feather name="arrow-right" size={12} color={colors.muted + "80"} style={styles.statArrow} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 28 },
  statCard: { flex: 1, alignItems: "center", padding: 12, borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.background },
  statImage: { width: 120, height: 80 },
  statValue: { fontFamily: fonts.sansMedium, fontSize: 18, color: colors.text, lineHeight: 22 },
  statLabel: { fontFamily: fonts.sans, fontSize: 10, color: colors.muted, letterSpacing: 0.5, marginTop: 2 },
  statArrow: { marginTop: 8 },
});
