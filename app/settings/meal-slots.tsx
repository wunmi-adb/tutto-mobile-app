import { MEAL_SLOT_OPTIONS } from "@/components/settings/data";
import { useSettingsState } from "@/components/settings/SettingsProvider";
import SettingsSelectionEditor from "@/components/settings/SettingsSelectionEditor";
import { useI18n } from "@/i18n";
import { useRouter } from "expo-router";

export default function SettingsMealSlotsScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const { mealSlots, setMealSlots } = useSettingsState();

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
    />
  );
}
