import SettingsSelectionEditor from "@/components/settings/SettingsSelectionEditor";
import { useI18n } from "@/i18n";
import { handleCaughtApiError } from "@/lib/api/handle-caught-api-error";
import { useUpdateHouseholdProfile } from "@/lib/api/household";
import { useRouter } from "expo-router";
import { useSettingsState } from "@/stores/settingsStore";

const HOUSEHOLD_SIZE_OPTIONS = Array.from({ length: 8 }, (_, index) => index + 1);

export default function SettingsHouseholdScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const { householdSize, setHouseholdSize } = useSettingsState();
  const updateHouseholdMutation = useUpdateHouseholdProfile();

  return (
    <SettingsSelectionEditor
      title={t("settings.household.title")}
      subtitle={t("settings.household.subtitle")}
      options={HOUSEHOLD_SIZE_OPTIONS.map((count) => ({
        value: String(count),
        label:
          count === 1
            ? t("settings.household.memberSingular", { count })
            : t("settings.household.memberPlural", { count }),
      }))}
      selected={householdSize ? [String(householdSize)] : []}
      onToggle={(value) => {
        setHouseholdSize(Number(value));
      }}
      onBack={() => router.back()}
      variant="radio"
      ctaLabel="Save"
      saving={updateHouseholdMutation.isPending}
      onSave={async () => {
        if (!householdSize) {
          return;
        }

        try {
          await updateHouseholdMutation.mutateAsync({
            number_of_household: householdSize,
          });
          router.back();
        } catch (error) {
          handleCaughtApiError(error);
        }
      }}
    />
  );
}
