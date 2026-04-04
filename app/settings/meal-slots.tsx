import { MEAL_SLOT_OPTIONS } from "@/components/settings/data";
import { useSettingsState } from "@/stores/settingsStore";
import SettingsSelectionEditor from "@/components/settings/SettingsSelectionEditor";
import { useI18n } from "@/i18n";
import { handleCaughtApiError } from "@/lib/api/handle-caught-api-error";
import { useUpdateHouseholdProfile } from "@/lib/api/household";
import { useRouter } from "expo-router";

function getMealSlotKeyFromLabel(
  label: string,
  t: ReturnType<typeof useI18n>["t"],
) {
  const option = MEAL_SLOT_OPTIONS.find((item) => t(item.valueKey) === label);
  return option ? itemToMealKey(option.valueKey) : label;
}

function itemToMealKey(valueKey: string) {
  return valueKey.replace("meals.options.", "").replace(".label", "");
}

export default function SettingsMealSlotsScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const { mealSlots, setMealSlots } = useSettingsState();
  const updateHouseholdMutation = useUpdateHouseholdProfile();

  return (
    <SettingsSelectionEditor
      title={t("settings.mealSlots.title")}
      subtitle={t("settings.mealSlots.subtitle")}
      options={MEAL_SLOT_OPTIONS.map((option) => ({
        value: t(option.valueKey),
        label: t(option.valueKey),
        sublabel: t(option.sublabelKey),
      }))}
      selected={mealSlots}
      onToggle={(value) =>
        setMealSlots((prev) =>
          prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
        )
      }
      onBack={() => router.back()}
      ctaLabel="Save"
      saving={updateHouseholdMutation.isPending}
      onSave={async () => {
        try {
          await updateHouseholdMutation.mutateAsync({
            meals: mealSlots.map((value) => getMealSlotKeyFromLabel(value, t)).join(", "),
          });
          router.back();
        } catch (error) {
          handleCaughtApiError(error);
        }
      }}
    />
  );
}
