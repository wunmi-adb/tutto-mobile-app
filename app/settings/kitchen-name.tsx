import SettingsTextEditor from "@/components/settings/SettingsTextEditor";
import { useSettingsState } from "@/components/settings/SettingsProvider";
import { useI18n } from "@/i18n";
import { useUpdateHouseholdProfile } from "@/lib/api/household";
import { useRouter } from "expo-router";

export default function SettingsKitchenNameScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const { kitchenName, setKitchenName } = useSettingsState();
  const updateHouseholdMutation = useUpdateHouseholdProfile();

  return (
    <SettingsTextEditor
      title={t("settings.kitchenName.title")}
      subtitle={t("settings.kitchenName.subtitle")}
      label={t("settings.kitchenName.label")}
      value={kitchenName}
      placeholder={t("settings.kitchenName.placeholder")}
      onChangeText={setKitchenName}
      onBack={() => router.back()}
      saving={updateHouseholdMutation.isPending}
      onSave={async () => {
        try {
          await updateHouseholdMutation.mutateAsync({ name: kitchenName.trim() });
          router.back();
        } catch {
          // The mutation hook already shows the translated error toast.
        }
      }}
    />
  );
}
