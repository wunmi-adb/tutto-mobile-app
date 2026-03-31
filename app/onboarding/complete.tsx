import OnboardingTopBar from "@/components/onboarding/OnboardingTopBar";
import Button from "@/components/ui/Button";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnboardingComplete() {
  const router = useRouter();
  const { t } = useI18n();
  const { location } = useLocalSearchParams<{ location: string }>();
  const storageName = location ?? t("addItems.defaultStorage");

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingTopBar />
      <View style={styles.content}>
        <View style={styles.checkCircle}>
          <Feather name="check" size={40} color={colors.success} />
        </View>

        <Text style={styles.title}>{t("complete.title", { storageName })}</Text>
        <Text style={styles.subtitle}>
          {t("complete.subtitle")}
        </Text>

        <View style={styles.actions}>
          <Button
            variant="secondary"
            title={t("complete.addLocation")}
            leftIcon={<Feather name="plus" size={16} color={colors.text} />}
            style={styles.btn}
            onPress={() => router.replace("/onboarding/storage")}
          />
          <Button
            title={t("complete.goToKitchen")}
            rightIcon={<Feather name="arrow-right" size={16} color={colors.background} />}
            style={styles.btn}
            onPress={() => router.replace("/kitchen")}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  checkCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.success + "1a",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 32,
    lineHeight: 36,
    color: colors.text,
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: fonts.sans,
    fontSize: 14,
    letterSpacing: 0.3,
    lineHeight: 21,
    color: colors.muted,
    textAlign: "center",
    maxWidth: 280,
    marginBottom: 48,
  },
  actions: { width: "100%" },
  btn: { marginTop: 12 },
});
