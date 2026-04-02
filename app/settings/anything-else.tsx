import SettingsTextEditor from "@/components/settings/SettingsTextEditor";
import { useSettingsState } from "@/components/settings/SettingsProvider";
import { useI18n } from "@/i18n";
import { useRouter } from "expo-router";

export default function SettingsAnythingElseScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const { anythingElse, setAnythingElse } = useSettingsState();

  return (
    <SettingsTextEditor
      title={t("settings.anythingElse.title")}
      subtitle={t("settings.anythingElse.subtitle")}
      label={t("settings.anythingElse.label")}
      value={anythingElse}
      placeholder={t("settings.anythingElse.placeholder")}
      onChangeText={setAnythingElse}
      onBack={() => router.back()}
      multiline
    />
  );
}
