import Button from "@/components/ui/Button";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  onTryAgain: () => void;
};

export default function StorageCaptureErrorState({ onTryAgain }: Props) {
  const { t } = useI18n();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <View style={styles.iconInner}>
            <Feather name="alert-circle" size={28} color={colors.danger} />
          </View>
        </View>

        <View style={styles.textBlock}>
          <Text style={styles.title}>{t("storage.onboarding.voice.errorTitle")}</Text>
          <Text style={styles.subtitle}>{t("storage.onboarding.voice.errorSubtitle")}</Text>
        </View>

        <Button
          title={t("storage.onboarding.voice.retry")}
          onPress={onTryAgain}
          style={styles.retryButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    width: "100%",
    maxWidth: 420,
    alignItems: "center",
    paddingHorizontal: 32,
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: `${colors.danger}10`,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: `${colors.danger}16`,
    marginBottom: 24,
  },
  iconInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  textBlock: {
    alignItems: "center",
    gap: 10,
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
    color: colors.muted,
    textAlign: "center",
    lineHeight: 21,
    maxWidth: 280,
  },
  retryButton: {
    width: "100%",
    marginTop: 24,
  },
});
