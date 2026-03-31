import { useSettingsState } from "@/components/settings/SettingsProvider";
import SettingsChipEditor from "@/components/settings/SettingsChipEditor";
import { useRouter } from "expo-router";

export default function SettingsAllergiesScreen() {
  const router = useRouter();
  const { allergies, setAllergies } = useSettingsState();

  return (
    <SettingsChipEditor
      title="Allergies"
      subtitle="List allergies so Tutto can help your household avoid unsafe ingredients."
      label="Allergies"
      chips={allergies}
      placeholder="Type an allergy, press comma to add"
      hint="e.g. Peanuts, Shellfish, Eggs, Soy, Lactose"
      onAdd={(value) =>
        setAllergies((prev) =>
          prev.some((item) => item.toLowerCase() === value.toLowerCase()) ? prev : [...prev, value],
        )
      }
      onRemove={(value) => setAllergies((prev) => prev.filter((item) => item !== value))}
      onBack={() => router.back()}
    />
  );
}
