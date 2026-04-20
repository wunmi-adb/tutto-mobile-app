import SettingsScreen from "@/components/settings/SettingsScreen";
import { useSettingsSync } from "@/stores/settingsStore";

export default function SettingsTab() {
  useSettingsSync();

  return <SettingsScreen showBackButton={false} />;
}
