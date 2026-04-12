import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getSingleParamValue } from "@/lib/utils/search-params";

const SUCCESS_REDIRECT_MS = 1800;

export default function OnboardingStorageSuccess() {
  const router = useRouter();
  const { t } = useI18n();
  const { count } = useLocalSearchParams<{
    count?: string | string[];
  }>();

  const itemCount = useMemo(() => {
    const rawCount = Number(getSingleParamValue(count));

    if (!Number.isFinite(rawCount) || rawCount < 1) {
      return 1;
    }

    return Math.floor(rawCount);
  }, [count]);

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/onboarding/share-tutorial");
    }, SUCCESS_REDIRECT_MS);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Feather name="check" size={32} color={colors.success} />
        </View>
        <View style={styles.textBlock}>
          <Text style={styles.title}>
            {t(
              itemCount === 1
                ? "storage.onboarding.success.title.singular"
                : "storage.onboarding.success.title.plural",
              { count: itemCount },
            )}
          </Text>
          <Text style={styles.subtitle}>{t("storage.onboarding.success.subtitle")}</Text>
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
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: `${colors.success}14`,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  textBlock: {
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 28,
    lineHeight: 32,
    color: colors.text,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted,
    textAlign: "center",
  },
});
