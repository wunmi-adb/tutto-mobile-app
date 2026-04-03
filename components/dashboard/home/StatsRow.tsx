import MealsIllustration from "@/assets/images/icon-meals.png";
import PantryIllustration from "@/assets/images/icon-pantry.png";
import ShoppingIllustration from "@/assets/images/icon-shopping.png";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import type { TranslationKey } from "@/i18n/messages";
import { Feather } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const STATS = [
  {
    labelKey: "kitchen.home.stats.pantry",
    value: "24",
    href: "/dashboard/kitchen",
    image: PantryIllustration,
  },
  {
    labelKey: "kitchen.home.stats.meals",
    value: "7",
    href: "/dashboard/plan",
    image: MealsIllustration,
  },
  {
    labelKey: "kitchen.home.stats.toBuy",
    value: "5",
    href: "/dashboard/shopping",
    image: ShoppingIllustration,
  },
] as const satisfies readonly {
  labelKey: TranslationKey;
  value: string;
  href: Href;
  image: number;
}[];

export default function StatsRow() {
  const router = useRouter();
  const { t } = useI18n();

  return (
    <View style={styles.statsRow}>
      {STATS.map((stat) => (
        <TouchableOpacity
          key={stat.labelKey}
          style={styles.statCard}
          activeOpacity={0.97}
          onPress={() => router.push(stat.href)}
        >
          <Image source={stat.image} style={styles.statImage} resizeMode="contain" />
          <Text style={styles.statValue}>{stat.value}</Text>
          <Text style={styles.statLabel}>{t(stat.labelKey)}</Text>
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
