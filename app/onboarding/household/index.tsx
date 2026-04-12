import OnboardingTopBar from "@/components/onboarding/OnboardingTopBar";
import HapticPressable from "@/components/ui/HapticPressable";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HouseholdChoose() {
  const router = useRouter();
  const { t } = useI18n();

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingTopBar />

      <View style={styles.content}>
        <View style={styles.headingBlock}>
          <Text style={styles.title}>{t("household.choose.title")}</Text>
          <Text style={styles.subtitle}>{t("household.choose.subtitle")}</Text>
        </View>

        <View style={styles.cards}>
          <HapticPressable
            style={styles.card}
            onPress={() => router.push("/onboarding/household/create")}
            pressedOpacity={0.98}
            hapticType="light"
          >
            <View style={[styles.cardIcon, { backgroundColor: colors.brand }]}>
              <Feather name="plus" size={22} color={colors.background} />
            </View>
            <View>
              <Text style={styles.cardTitle}>{t("household.choose.createTitle")}</Text>
              <Text style={styles.cardDescription}>
                {t("household.choose.createDescription")}
              </Text>
            </View>
          </HapticPressable>

          <HapticPressable
            style={styles.card}
            onPress={() => router.push("/onboarding/household/join")}
            pressedOpacity={0.98}
            hapticType="light"
          >
            <View style={[styles.cardIcon, styles.cardIconBordered]}>
              <Feather name="users" size={22} color={colors.text} />
            </View>
            <View>
              <Text style={styles.cardTitle}>{t("household.choose.joinTitle")}</Text>
              <Text style={styles.cardDescription}>
                {t("household.choose.joinDescription")}
              </Text>
            </View>
          </HapticPressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  headingBlock: {
    marginBottom: 40,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 36,
    lineHeight: 40,
    color: colors.text,
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: fonts.sans,
    fontSize: 14,
    letterSpacing: 0.3,
    color: colors.muted,
  },
  cards: {
    gap: 16,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 24,
    alignItems: "flex-start",
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  cardIconBordered: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  cardTitle: {
    fontFamily: fonts.sansMedium,
    fontSize: 18,
    color: colors.text,
    marginBottom: 4,
  },
  cardDescription: {
    fontFamily: fonts.sans,
    fontSize: 13,
    lineHeight: 21,
    color: colors.muted,
  },
});
