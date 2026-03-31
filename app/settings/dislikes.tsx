import SettingsChipEditor from "@/components/settings/SettingsChipEditor";
import { useSettingsState } from "@/components/settings/SettingsProvider";
import { useRouter } from "expo-router";

function addUniqueValue(current: string[], value: string) {
  if (current.some((item) => item.toLowerCase() === value.toLowerCase())) {
    return current;
  }

  return [...current, value];
}

export default function SettingsDislikesScreen() {
  const router = useRouter();
  const { dislikes, setDislikes } = useSettingsState();

  return (
    <SettingsChipEditor
      title="Dislikes"
      subtitle="Tell Tutto what your household would rather not see in meal suggestions."
      label="Dislikes"
      chips={dislikes}
      placeholder="Type a dislike, press comma to add"
      hint="e.g. Liver, Blue cheese, Cilantro, Olives"
      onAdd={(value) => setDislikes((prev) => addUniqueValue(prev, value))}
      onRemove={(value) => setDislikes((prev) => prev.filter((item) => item !== value))}
      onBack={() => router.back()}
    />
  );
}
