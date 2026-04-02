import SettingsDetailLayout from "@/components/settings/SettingsDetailLayout";
import SettingsRow from "@/components/settings/SettingsRow";
import { colors } from "@/constants/colors";
import { useI18n } from "@/i18n";
import { Feather } from "@expo/vector-icons";
import * as Linking from "expo-linking";

type Props = {
  onBack: () => void;
};

export default function SettingsSupportView({ onBack }: Props) {
  const { t } = useI18n();

  return (
    <SettingsDetailLayout
      title={t("settings.support.title")}
      subtitle={t("settings.support.subtitle")}
      onBack={onBack}
    >
      <SettingsRow
        icon={<Feather name="mail" size={18} color={colors.muted} />}
        label={t("settings.support.emailSupport")}
        value={t("settings.support.emailAddress")}
        onPress={() => Linking.openURL("mailto:hello@tutto.app")}
      />
      <SettingsRow
        icon={<Feather name="message-circle" size={18} color={colors.muted} />}
        label={t("settings.support.shareFeedback")}
        value={t("settings.support.feedbackValue")}
        onPress={() => Linking.openURL("mailto:hello@tutto.app?subject=Tutto%20feedback")}
      />
      <SettingsRow
        icon={<Feather name="shield" size={18} color={colors.muted} />}
        label={t("settings.support.privacyPolicy")}
        value={t("settings.support.privacyValue")}
        onPress={() => Linking.openURL("https://example.com/privacy")}
      />
    </SettingsDetailLayout>
  );
}
