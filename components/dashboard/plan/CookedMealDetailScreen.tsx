import { getMealTypeLabel, type MealTypeId } from "@/components/dashboard/data";
import BackButton from "@/components/ui/BackButton";
import Button from "@/components/ui/Button";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  location: string;
  mealName: string;
  mealType: MealTypeId;
  onBack: () => void;
  onUpdateUsage: () => void;
};

export default function CookedMealDetailScreen({
  location,
  mealName,
  mealType,
  onBack,
  onUpdateUsage,
}: Props) {
  const { t } = useI18n();

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <BackButton onPress={onBack} />
        <Text style={styles.eyebrow}>{getMealTypeLabel(t, mealType)}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <MaterialCommunityIcons name="fridge-outline" size={28} color={colors.text} />
        </View>
        <Text style={styles.title}>{mealName}</Text>
        <Text style={styles.subtitle}>{t("kitchen.plan.cookedMealReady")}</Text>

        <View style={styles.locationCard}>
          <Text style={styles.locationLabel}>{t("dashboard.kitchen.filters.location")}</Text>
          <Text style={styles.locationValue}>{location}</Text>
        </View>

        <View style={styles.infoCard}>
          <Feather name="edit-3" size={16} color={colors.muted} />
          <Text style={styles.infoText}>{t("kitchen.plan.updateUsage.subtitleCooked", { mealName })}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title={t("kitchen.plan.iveHadThis")}
          onPress={onUpdateUsage}
          style={styles.primaryButton}
          leftIcon={<Feather name="check" size={16} color={colors.background} />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  eyebrow: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    color: colors.muted,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  headerSpacer: {
    width: 36,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 22,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 30,
    lineHeight: 34,
    color: colors.text,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 21,
    color: colors.muted,
    textAlign: "center",
    maxWidth: 280,
  },
  locationCard: {
    width: "100%",
    borderRadius: 16,
    backgroundColor: colors.secondary,
    padding: 16,
    marginTop: 24,
    marginBottom: 14,
  },
  locationLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  locationValue: {
    fontFamily: fonts.sansMedium,
    fontSize: 16,
    color: colors.text,
  },
  infoCard: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  infoText: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  primaryButton: {
    marginTop: 0,
  },
});
