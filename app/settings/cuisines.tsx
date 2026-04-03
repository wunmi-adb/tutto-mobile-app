import { useSettingsState } from "@/components/settings/SettingsProvider";
import SettingsChipEditor from "@/components/settings/SettingsChipEditor";
import { useI18n } from "@/i18n";
import { useUpdateHouseholdProfile } from "@/lib/api/household";
import { useRouter } from "expo-router";

export default function SettingsCuisinesScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const { cuisines, setCuisines } = useSettingsState();
  const updateHouseholdMutation = useUpdateHouseholdProfile();

  return (
    <SettingsChipEditor
      title={t("settings.cuisines.title")}
      subtitle={t("settings.cuisines.subtitle")}
      label={t("settings.cuisines.label")}
      chips={cuisines}
      placeholder={t("settings.cuisines.placeholder")}
      hint={t("settings.cuisines.hint")}
      onAdd={(value) =>
        setCuisines((prev) =>
          prev.some((item) => item.toLowerCase() === value.toLowerCase()) ? prev : [...prev, value],
        )
      }
      onRemove={(value) => setCuisines((prev) => prev.filter((item) => item !== value))}
      onBack={() => router.back()}
      saving={updateHouseholdMutation.isPending}
      onSave={async () => {
        try {
          await updateHouseholdMutation.mutateAsync({ love: cuisines.join(", ") });
          router.back();
        } catch {
          // The mutation hook already shows the translated error toast.
        }
      }}
    />
  );
}
