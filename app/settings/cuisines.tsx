import { useSettingsState } from "@/components/settings/SettingsProvider";
import SettingsChipEditor from "@/components/settings/SettingsChipEditor";
import { useRouter } from "expo-router";

export default function SettingsCuisinesScreen() {
  const router = useRouter();
  const { cuisines, setCuisines } = useSettingsState();

  return (
    <SettingsChipEditor
      title="Cuisines"
      subtitle="Share the cuisines your household enjoys so recommendations feel more personal."
      label="Cuisines"
      chips={cuisines}
      placeholder="Type a cuisine, press comma to add"
      hint="e.g. Italian, Japanese, Mexican, Indian, Thai, Ethiopian"
      onAdd={(value) =>
        setCuisines((prev) =>
          prev.some((item) => item.toLowerCase() === value.toLowerCase()) ? prev : [...prev, value],
        )
      }
      onRemove={(value) => setCuisines((prev) => prev.filter((item) => item !== value))}
      onBack={() => router.back()}
    />
  );
}
