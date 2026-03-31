import SettingsSelectionEditor from "@/components/settings/SettingsSelectionEditor";
import { useI18n } from "@/i18n";
import { useRouter } from "expo-router";

export default function SettingsLanguageScreen() {
  const router = useRouter();
  const { language, languages, setLanguage } = useI18n();
  const selectedLabel =
    languages.find((item) => item.code === language)?.label ?? "English";

  return (
    <SettingsSelectionEditor
      title="Language"
      subtitle="Choose the language you want Tutto to use across the app."
      options={languages.map((item) => item.label)}
      selected={[selectedLabel]}
      onToggle={(label) => {
        const next = languages.find((item) => item.label === label);
        if (next) {
          void setLanguage(next.code);
        }
      }}
      onBack={() => router.back()}
      variant="radio"
    />
  );
}
