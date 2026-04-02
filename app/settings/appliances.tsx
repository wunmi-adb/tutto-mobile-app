import { useSettingsState } from "@/components/settings/SettingsProvider";
import SettingsChipEditor from "@/components/settings/SettingsChipEditor";
import { useI18n } from "@/i18n";
import { useRouter } from "expo-router";

export default function SettingsAppliancesScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const { appliances, setAppliances } = useSettingsState();

  return (
    <SettingsChipEditor
      title={t("settings.appliances.title")}
      subtitle={t("settings.appliances.subtitle")}
      label={t("settings.appliances.label")}
      chips={appliances}
      placeholder={t("settings.appliances.placeholder")}
      hint={t("settings.appliances.hint")}
      onAdd={(value) =>
        setAppliances((prev) =>
          prev.some((item) => item.toLowerCase() === value.toLowerCase()) ? prev : [...prev, value],
        )
      }
      onRemove={(value) => setAppliances((prev) => prev.filter((item) => item !== value))}
      onBack={() => router.back()}
    />
  );
}
