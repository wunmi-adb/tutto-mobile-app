import SettingsTextEditor from "@/components/settings/SettingsTextEditor";
import { useSettingsState } from "@/components/settings/SettingsProvider";
import { useRouter } from "expo-router";

export default function SettingsKitchenNameScreen() {
  const router = useRouter();
  const { kitchenName, setKitchenName } = useSettingsState();

  return (
    <SettingsTextEditor
      title="Kitchen name"
      subtitle="Give your shared kitchen a name that feels familiar to everyone."
      label="Kitchen name"
      value={kitchenName}
      placeholder="The Okafor Family"
      onChangeText={setKitchenName}
      onBack={() => router.back()}
    />
  );
}
