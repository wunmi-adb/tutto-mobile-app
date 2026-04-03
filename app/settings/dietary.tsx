import { useSettingsState } from "@/components/settings/SettingsProvider";
import SettingsChipEditor from "@/components/settings/SettingsChipEditor";
import { useI18n } from "@/i18n";
import { useUpdateHouseholdProfile } from "@/lib/api/household";
import { useRouter } from "expo-router";

export default function SettingsDietaryScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const { dietary, setDietary } = useSettingsState();
  const updateHouseholdMutation = useUpdateHouseholdProfile();

  return (
    <SettingsChipEditor
      title={t("settings.dietary.title")}
      subtitle={t("settings.dietary.subtitle")}
      label={t("settings.dietary.label")}
      chips={dietary}
      placeholder={t("settings.dietary.placeholder")}
      hint={t("settings.dietary.hint")}
      onAdd={(value) =>
        setDietary((prev) =>
          prev.some((item) => item.toLowerCase() === value.toLowerCase()) ? prev : [...prev, value],
        )
      }
      onRemove={(value) => setDietary((prev) => prev.filter((item) => item !== value))}
      onBack={() => router.back()}
      saving={updateHouseholdMutation.isPending}
      onSave={async () => {
        try {
          await updateHouseholdMutation.mutateAsync({ dietary: dietary.join(", ") });
          router.back();
        } catch {
          // The mutation hook already shows the translated error toast.
        }
      }}
    />
  );
}
