import { useSettingsState } from "@/components/settings/SettingsProvider";
import SettingsChipEditor from "@/components/settings/SettingsChipEditor";
import { useI18n } from "@/i18n";
import { useRouter } from "expo-router";

export default function SettingsAllergiesScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const { allergies, setAllergies } = useSettingsState();

  return (
    <SettingsChipEditor
      title={t("settings.allergies.title")}
      subtitle={t("settings.allergies.subtitle")}
      label={t("settings.allergies.label")}
      chips={allergies}
      placeholder={t("settings.allergies.placeholder")}
      hint={t("settings.allergies.hint")}
      onAdd={(value) =>
        setAllergies((prev) =>
          prev.some((item) => item.toLowerCase() === value.toLowerCase()) ? prev : [...prev, value],
        )
      }
      onRemove={(value) => setAllergies((prev) => prev.filter((item) => item !== value))}
      onBack={() => router.back()}
    />
  );
}
