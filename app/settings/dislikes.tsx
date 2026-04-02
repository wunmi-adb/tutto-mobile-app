import SettingsChipEditor from "@/components/settings/SettingsChipEditor";
import { useSettingsState } from "@/components/settings/SettingsProvider";
import { useI18n } from "@/i18n";
import { useRouter } from "expo-router";

function addUniqueValue(current: string[], value: string) {
  if (current.some((item) => item.toLowerCase() === value.toLowerCase())) {
    return current;
  }

  return [...current, value];
}

export default function SettingsDislikesScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const { dislikes, setDislikes } = useSettingsState();

  return (
    <SettingsChipEditor
      title={t("settings.dislikes.title")}
      subtitle={t("settings.dislikes.subtitle")}
      label={t("settings.dislikes.label")}
      chips={dislikes}
      placeholder={t("settings.dislikes.placeholder")}
      hint={t("settings.dislikes.hint")}
      onAdd={(value) => setDislikes((prev) => addUniqueValue(prev, value))}
      onRemove={(value) => setDislikes((prev) => prev.filter((item) => item !== value))}
      onBack={() => router.back()}
    />
  );
}
