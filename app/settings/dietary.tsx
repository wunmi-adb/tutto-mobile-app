import { useSettingsState } from "@/components/settings/SettingsProvider";
import SettingsChipEditor from "@/components/settings/SettingsChipEditor";
import { useRouter } from "expo-router";

export default function SettingsDietaryScreen() {
  const router = useRouter();
  const { dietary, setDietary } = useSettingsState();

  return (
    <SettingsChipEditor
      title="Dietary preferences"
      subtitle="Add any dietary needs or preferences Tutto should consider while planning meals."
      label="Dietary requirements"
      chips={dietary}
      placeholder="Type a requirement, press comma to add"
      hint="e.g. Vegetarian, Gluten-free, Halal, Dairy-free, Keto"
      onAdd={(value) =>
        setDietary((prev) =>
          prev.some((item) => item.toLowerCase() === value.toLowerCase()) ? prev : [...prev, value],
        )
      }
      onRemove={(value) => setDietary((prev) => prev.filter((item) => item !== value))}
      onBack={() => router.back()}
    />
  );
}
