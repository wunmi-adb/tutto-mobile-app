import SettingsTextEditor from "@/components/settings/SettingsTextEditor";
import { useSettingsState } from "@/components/settings/SettingsProvider";
import { useRouter } from "expo-router";

export default function SettingsAnythingElseScreen() {
  const router = useRouter();
  const { anythingElse, setAnythingElse } = useSettingsState();

  return (
    <SettingsTextEditor
      title="Anything else?"
      subtitle="Add extra context about your kitchen, routine, or food preferences."
      label="Notes"
      value={anythingElse}
      placeholder="We batch cook on Sundays, prefer quick lunches, and love spicy food."
      onChangeText={setAnythingElse}
      onBack={() => router.back()}
      multiline
    />
  );
}
