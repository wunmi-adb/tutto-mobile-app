import { useSettingsState } from "@/components/settings/SettingsProvider";
import SettingsChipEditor from "@/components/settings/SettingsChipEditor";
import { useI18n } from "@/i18n";
import { useUpdateHouseholdProfile } from "@/lib/api/household";
import { useRouter } from "expo-router";

export default function SettingsAppliancesScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const { appliances, setAppliances } = useSettingsState();
  const updateHouseholdMutation = useUpdateHouseholdProfile();

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
      saving={updateHouseholdMutation.isPending}
      onSave={async () => {
        try {
          await updateHouseholdMutation.mutateAsync({
            kitchen_appliances: appliances.join(", "),
          });
          router.back();
        } catch {
          // The mutation hook already shows the translated error toast.
        }
      }}
    />
  );
}
