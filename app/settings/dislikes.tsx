import SettingsChipEditor from "@/components/settings/SettingsChipEditor";
import { useSettingsState } from "@/stores/settingsStore";
import { useI18n } from "@/i18n";
import { handleCaughtApiError } from "@/lib/api/handle-caught-api-error";
import { useUpdateHouseholdProfile } from "@/lib/api/household";
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
  const updateHouseholdMutation = useUpdateHouseholdProfile();

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
      saving={updateHouseholdMutation.isPending}
      onSave={async () => {
        try {
          await updateHouseholdMutation.mutateAsync({ dislike: dislikes.join(", ") });
          router.back();
        } catch (error) {
          handleCaughtApiError(error);
        }
      }}
    />
  );
}
