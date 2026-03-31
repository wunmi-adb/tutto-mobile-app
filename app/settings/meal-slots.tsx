import { MEAL_SLOT_OPTIONS } from "@/components/settings/data";
import { useSettingsState } from "@/components/settings/SettingsProvider";
import SettingsSelectionEditor from "@/components/settings/SettingsSelectionEditor";
import { useRouter } from "expo-router";

export default function SettingsMealSlotsScreen() {
  const router = useRouter();
  const { mealSlots, setMealSlots } = useSettingsState();

  return (
    <SettingsSelectionEditor
      title="Meal slots"
      subtitle="Select the moments in the day you actively plan around."
      options={MEAL_SLOT_OPTIONS}
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
